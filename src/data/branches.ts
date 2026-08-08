export interface Branch {
  id: number;
  name: string;
  area: string;
  address: string;
  hours: string;
  phone: string;
  whatsapp: string;
  delivery: boolean;
  mapQuery: string;
  mapX: number;
  mapY: number;
  latitude: number;
  longitude: number;
}

export interface BranchDistance {
  branch: Branch;
  distanceKm: number;
}

export const branches: Branch[] = [
  {
    id: 1,
    name: 'MFZ HBK Branch',
    area: 'HBK Arena, Peshawar',
    address: 'HBK Arena, Ring Road, Peshawar',
    hours: 'Contact branch to confirm current opening hours',
    phone: '+091 3049432',
    whatsapp: '+92 305 1880355',
    delivery: true,
    mapQuery: 'MFZ Corn Dog HBK Branch Peshawar',
    mapX: 68,
    mapY: 58,
    // HBK Arena / Main Ring Road area.
    latitude: 33.97419,
    longitude: 71.4736,
  },
  {
    id: 2,
    name: 'MFZ Town Branch',
    area: 'University Town, Peshawar',
    address: 'University Town, Peshawar',
    hours: 'Contact branch to confirm current opening hours',
    phone: '+091 3091246',
    whatsapp: '+92 305 1880355',
    delivery: true,
    mapQuery: 'MFZ Corn Dog University Town Peshawar',
    mapX: 45,
    mapY: 42,
    // University Town / University Road service area.
    latitude: 33.9957,
    longitude: 71.505,
  },
  {
    id: 3,
    name: 'MFZ Gulbahar Branch',
    area: 'Gulbahar No. 1, Peshawar',
    address: 'Near Salman Bakers, Gulbahar No. 1, Peshawar',
    hours: 'Contact branch to confirm current opening hours',
    phone: '+091 3026266',
    whatsapp: '+92 305 1880355',
    delivery: true,
    mapQuery: 'MFZ Corn Dog Gulbahar Branch Peshawar',
    mapX: 31,
    mapY: 34,
    // Gulbahar No. 1 / Salman Bakers area.
    latitude: 34.012,
    longitude: 71.593,
  },
  {
    id: 4,
    name: 'MFZ Head Office',
    area: 'Peshawar',
    address: 'Peshawar, Khyber Pakhtunkhwa',
    hours: 'Contact the office for availability',
    phone: '+ 091 5815133',
    whatsapp: '+92 305 1880355',
    delivery: false,
    mapQuery: 'MFZ Head Office Peshawar',
    mapX: 53,
    mapY: 50,
    latitude: 34.0151,
    longitude: 71.5249,
  },
];

export const getBranchById = (
  id: number,
): Branch | undefined =>
  branches.find((branch) => branch.id === id);

const toRadians = (value: number) => (value * Math.PI) / 180;

export const distanceBetweenKm = (
  latitudeA: number,
  longitudeA: number,
  latitudeB: number,
  longitudeB: number,
) => {
  const earthRadiusKm = 6371;
  const dLat = toRadians(latitudeB - latitudeA);
  const dLng = toRadians(longitudeB - longitudeA);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(latitudeA)) *
      Math.cos(toRadians(latitudeB)) *
      Math.sin(dLng / 2) ** 2;

  return 2 * earthRadiusKm * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const findNearestDeliveryBranch = (
  latitude: number,
  longitude: number,
): BranchDistance | null => {
  const deliveryBranches = branches.filter((branch) => branch.delivery);
  if (!deliveryBranches.length) return null;

  return deliveryBranches.reduce<BranchDistance | null>((nearest, branch) => {
    const distanceKm = distanceBetweenKm(
      latitude,
      longitude,
      branch.latitude,
      branch.longitude,
    );

    if (!nearest || distanceKm < nearest.distanceKm) {
      return { branch, distanceKm };
    }

    return nearest;
  }, null);
};

export const formatPhoneForDisplay = (
  phone: string,
): string => {
  if (phone.startsWith('091') && phone.length === 10) {
    return `${phone.slice(0, 3)}-${phone.slice(3)}`;
  }

  if (phone.startsWith('92')) {
    return `+${phone}`;
  }

  return phone;
};
