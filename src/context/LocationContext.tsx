import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { branches, type Branch } from '@/data/branches';
import {
  getDeliveryAreaById,
  type DeliveryArea,
} from '@/data/deliveryAreas';

const STORAGE_KEY = 'mfz-delivery-location';

export interface MFZDeliveryLocation {
  city: 'Peshawar';
  areaId: string;
  areaName: string;
  zone: string;
  addressLine: string;
  landmark: string;
  deliveryNotes: string;
  branchId: number;
  branchName: string;
  savedAt: number;
}

interface SaveLocationInput {
  area: DeliveryArea;
  addressLine: string;
  landmark?: string;
  deliveryNotes?: string;
}

interface LocationContextValue {
  deliveryLocation: MFZDeliveryLocation | null;
  selectedBranch: Branch | null;
  hasLocation: boolean;
  selectorOpen: boolean;
  openSelector: () => void;
  closeSelector: () => void;
  saveLocation: (input: SaveLocationInput) => void;
  clearLocation: () => void;
  formattedAddress: string;
}

const LocationContext = createContext<LocationContextValue | null>(null);

const readStoredLocation = (): MFZDeliveryLocation | null => {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as MFZDeliveryLocation;

    if (
      parsed.city !== 'Peshawar' ||
      !parsed.areaId ||
      !parsed.branchId ||
      !parsed.addressLine
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

export function LocationProvider({ children }: { children: ReactNode }) {
  const [deliveryLocation, setDeliveryLocation] =
    useState<MFZDeliveryLocation | null>(() => readStoredLocation());

  const [selectorOpen, setSelectorOpen] = useState(
    () => readStoredLocation() === null,
  );

  const selectedBranch = useMemo(() => {
    if (!deliveryLocation) return null;
    return (
      branches.find((branch) => branch.id === deliveryLocation.branchId) ??
      null
    );
  }, [deliveryLocation]);

  const formattedAddress = useMemo(() => {
    if (!deliveryLocation) return '';

    return [
      deliveryLocation.addressLine,
      deliveryLocation.areaName,
      deliveryLocation.city,
      deliveryLocation.landmark
        ? `Landmark: ${deliveryLocation.landmark}`
        : '',
    ]
      .filter(Boolean)
      .join(', ');
  }, [deliveryLocation]);

  const saveLocation = ({
    area,
    addressLine,
    landmark = '',
    deliveryNotes = '',
  }: SaveLocationInput) => {
    const branch = branches.find((item) => item.id === area.branchId);
    if (!branch) return;

    const nextLocation: MFZDeliveryLocation = {
      city: 'Peshawar',
      areaId: area.id,
      areaName: area.name,
      zone: area.zone,
      addressLine: addressLine.trim(),
      landmark: landmark.trim(),
      deliveryNotes: deliveryNotes.trim(),
      branchId: branch.id,
      branchName: branch.name,
      savedAt: Date.now(),
    };

    setDeliveryLocation(nextLocation);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextLocation));
    setSelectorOpen(false);
    window.dispatchEvent(
      new CustomEvent('mfz-location-changed', { detail: nextLocation }),
    );
  };

  const clearLocation = () => {
    setDeliveryLocation(null);
    window.localStorage.removeItem(STORAGE_KEY);
    setSelectorOpen(true);
  };

  const value: LocationContextValue = {
    deliveryLocation,
    selectedBranch,
    hasLocation: Boolean(deliveryLocation),
    selectorOpen,
    openSelector: () => setSelectorOpen(true),
    closeSelector: () => {
      if (deliveryLocation) setSelectorOpen(false);
    },
    saveLocation,
    clearLocation,
    formattedAddress,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}

export function useDeliveryLocation() {
  const context = useContext(LocationContext);

  if (!context) {
    throw new Error(
      'useDeliveryLocation must be used within LocationProvider',
    );
  }

  return context;
}

export function getStoredMFZLocation() {
  return readStoredLocation();
}

export function getStoredMFZArea() {
  const stored = readStoredLocation();
  return stored ? getDeliveryAreaById(stored.areaId) ?? null : null;
}
