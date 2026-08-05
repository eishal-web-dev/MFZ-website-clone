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
}

export const branches: Branch[] = [
  {
    id: 1,
    name: 'MFZ HBK Branch',
    area: 'HBK Arena, Peshawar',
    address: 'HBK Arena, Ring Road, Peshawar',
    hours: 'Contact branch to confirm current opening hours',
    phone: '0913049432',
    whatsapp: '923051880355',
    delivery: true,
    mapQuery: 'MFZ Corn Dog HBK Branch Peshawar',
    mapX: 68,
    mapY: 58,
  },
  {
    id: 2,
    name: 'MFZ Town Branch',
    area: 'University Town, Peshawar',
    address: 'University Town, Peshawar',
    hours: 'Contact branch to confirm current opening hours',
    phone: '0913091246',
    whatsapp: '923051880355',
    delivery: true,
    mapQuery: 'MFZ Corn Dog University Town Peshawar',
    mapX: 45,
    mapY: 42,
  },
  {
    id: 3,
    name: 'MFZ Gulbahar Branch',
    area: 'Gulbahar No. 1, Peshawar',
    address: 'Near Shell Pump, Gulbahar No. 1, Peshawar',
    hours: 'Contact branch to confirm current opening hours',
    phone: '0913026266',
    whatsapp: '923051880355',
    delivery: true,
    mapQuery: 'MFZ Corn Dog Gulbahar Branch Peshawar',
    mapX: 31,
    mapY: 34,
  },
  {
    id: 4,
    name: 'MFZ Head Office',
    area: 'Peshawar',
    address: 'Peshawar, Khyber Pakhtunkhwa',
    hours: 'Contact the office for availability',
    phone: '0915815133',
    whatsapp: '923051880355',
    delivery: false,
    mapQuery: 'MFZ Head Office Peshawar',
    mapX: 53,
    mapY: 50,
  },
];

export const getBranchById = (
  id: number,
): Branch | undefined =>
  branches.find((branch) => branch.id === id);

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