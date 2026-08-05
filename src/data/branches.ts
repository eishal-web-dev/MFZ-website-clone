export interface Branch {
  id: number;
  name: string;
  area: string;
  address: string;
  hours: string;
  phone: string;
  whatsapp: string;
  delivery: boolean;
  mapX: number;
  mapY: number;
}

export const branches: Branch[] = [
  { id: 1, name: 'University Road', area: 'University Road, Peshawar', address: 'Confirm with MFZ', hours: 'Confirm with MFZ', phone: 'Confirm with MFZ', whatsapp: 'Confirm with MFZ', delivery: true, mapX: 62, mapY: 38 },
  { id: 2, name: 'HBK Arena', area: 'HBK Arena, Peshawar', address: 'Confirm with MFZ', hours: 'Confirm with MFZ', phone: 'Confirm with MFZ', whatsapp: 'Confirm with MFZ', delivery: true, mapX: 48, mapY: 52 },
  { id: 3, name: 'Gulbahar', area: 'Gulbahar, Peshawar', address: 'Confirm with MFZ', hours: 'Confirm with MFZ', phone: 'Confirm with MFZ', whatsapp: 'Confirm with MFZ', delivery: false, mapX: 35, mapY: 64 },
  { id: 4, name: 'Saddar', area: 'Saddar, Peshawar', address: 'Confirm with MFZ', hours: 'Confirm with MFZ', phone: 'Confirm with MFZ', whatsapp: 'Confirm with MFZ', delivery: true, mapX: 55, mapY: 76 },
];
