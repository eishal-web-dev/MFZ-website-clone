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

export type LocationSource = 'manual' | 'gps';

export interface MFZDeliveryLocation {
  city: 'Peshawar';
  source: LocationSource;
  areaId: string;
  areaName: string;
  zone: string;
  addressLine: string;
  landmark: string;
  deliveryNotes: string;
  branchId: number;
  branchName: string;
  latitude?: number;
  longitude?: number;
  accuracyMeters?: number;
  mapsUrl?: string;
  distanceToBranchKm?: number;
  savedAt: number;
}

interface SaveLocationInput {
  area: DeliveryArea;
  addressLine: string;
  landmark?: string;
  deliveryNotes?: string;
}

interface SaveGPSLocationInput {
  latitude: number;
  longitude: number;
  accuracyMeters: number;
  branch: Branch;
  distanceToBranchKm: number;
}

interface LocationContextValue {
  deliveryLocation: MFZDeliveryLocation | null;
  selectedBranch: Branch | null;
  hasLocation: boolean;
  selectorOpen: boolean;
  openSelector: () => void;
  closeSelector: () => void;
  saveLocation: (input: SaveLocationInput) => void;
  saveGPSLocation: (input: SaveGPSLocationInput) => void;
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
      !parsed.branchId ||
      !parsed.addressLine
    ) {
      return null;
    }

    return {
      ...parsed,
      source: parsed.source ?? 'manual',
    };
  } catch {
    return null;
  }
};

export function LocationProvider({ children }: { children: ReactNode }) {
  const [deliveryLocation, setDeliveryLocation] =
    useState<MFZDeliveryLocation | null>(() => readStoredLocation());

  // The manual picker no longer opens immediately. The app first tries the
  // browser's native geolocation permission flow. If that fails/gets denied,
  // AutoLocationResolver opens this selector as the fallback.
  const [selectorOpen, setSelectorOpen] = useState(false);

  const selectedBranch = useMemo(() => {
    if (!deliveryLocation) return null;
    return (
      branches.find((branch) => branch.id === deliveryLocation.branchId) ??
      null
    );
  }, [deliveryLocation]);

  const formattedAddress = useMemo(() => {
    if (!deliveryLocation) return '';

    if (deliveryLocation.source === 'gps' && deliveryLocation.mapsUrl) {
      return [
        'Live GPS delivery pin',
        deliveryLocation.mapsUrl,
        deliveryLocation.accuracyMeters
          ? `GPS accuracy ±${Math.round(deliveryLocation.accuracyMeters)}m`
          : '',
      ]
        .filter(Boolean)
        .join(' · ');
    }

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

  const persist = (nextLocation: MFZDeliveryLocation) => {
    setDeliveryLocation(nextLocation);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextLocation));
    setSelectorOpen(false);
    window.dispatchEvent(
      new CustomEvent('mfz-location-changed', { detail: nextLocation }),
    );
  };

  const saveLocation = ({
    area,
    addressLine,
    landmark = '',
    deliveryNotes = '',
  }: SaveLocationInput) => {
    const branch = branches.find((item) => item.id === area.branchId);
    if (!branch) return;

    persist({
      city: 'Peshawar',
      source: 'manual',
      areaId: area.id,
      areaName: area.name,
      zone: area.zone,
      addressLine: addressLine.trim(),
      landmark: landmark.trim(),
      deliveryNotes: deliveryNotes.trim(),
      branchId: branch.id,
      branchName: branch.name,
      savedAt: Date.now(),
    });
  };

  const saveGPSLocation = ({
    latitude,
    longitude,
    accuracyMeters,
    branch,
    distanceToBranchKm,
  }: SaveGPSLocationInput) => {
    const mapsUrl = `https://www.google.com/maps?q=${latitude.toFixed(6)},${longitude.toFixed(6)}`;

    persist({
      city: 'Peshawar',
      source: 'gps',
      areaId: 'live-gps',
      areaName: 'Live Location',
      zone: 'GPS detected',
      addressLine: mapsUrl,
      landmark: '',
      deliveryNotes: '',
      branchId: branch.id,
      branchName: branch.name,
      latitude,
      longitude,
      accuracyMeters,
      mapsUrl,
      distanceToBranchKm,
      savedAt: Date.now(),
    });
  };

  const clearLocation = () => {
    setDeliveryLocation(null);
    window.localStorage.removeItem(STORAGE_KEY);
    setSelectorOpen(false);
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
    saveGPSLocation,
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
  if (!stored || stored.source === 'gps') return null;
  return getDeliveryAreaById(stored.areaId) ?? null;
}
