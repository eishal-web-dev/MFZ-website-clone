export interface DeliveryArea {
  id: string;
  name: string;
  zone: string;
  branchId: number;
  keywords: string[];
}

export const deliveryAreas: DeliveryArea[] = [
  {
    id: 'hayatabad',
    name: 'Hayatabad',
    zone: 'Hayatabad',
    branchId: 1,
    keywords: ['phase 1', 'phase 2', 'phase 3', 'phase 4', 'phase 5', 'phase 6', 'phase 7'],
  },
  {
    id: 'ring-road',
    name: 'Ring Road',
    zone: 'Ring Road',
    branchId: 1,
    keywords: ['hbk arena', 'achini', 'ring road'],
  },
  {
    id: 'achini',
    name: 'Achini / Achini Payan',
    zone: 'Ring Road',
    branchId: 1,
    keywords: ['achini payan', 'achini bala'],
  },
  {
    id: 'pishtakhara',
    name: 'Pishtakhara',
    zone: 'Ring Road',
    branchId: 1,
    keywords: ['pishtakhara chowk'],
  },
  {
    id: 'university-town',
    name: 'University Town',
    zone: 'University Town',
    branchId: 2,
    keywords: ['town', 'old bara road', 'arbab road'],
  },
  {
    id: 'university-road',
    name: 'University Road',
    zone: 'University Town',
    branchId: 2,
    keywords: ['university road', 'main university road'],
  },
  {
    id: 'tehkal',
    name: 'Tehkal',
    zone: 'University Town',
    branchId: 2,
    keywords: ['tehkal bala', 'tehkal payan'],
  },
  {
    id: 'board-bazaar',
    name: 'Board Bazaar',
    zone: 'University Town',
    branchId: 2,
    keywords: ['board', 'board bazar'],
  },
  {
    id: 'abdara',
    name: 'Abdara Road',
    zone: 'University Town',
    branchId: 2,
    keywords: ['abdara'],
  },
  {
    id: 'danishabad',
    name: 'Danishabad',
    zone: 'University Town',
    branchId: 2,
    keywords: ['danish abad'],
  },
  {
    id: 'rahatabad',
    name: 'Rahatabad',
    zone: 'University Town',
    branchId: 2,
    keywords: ['rahat abad'],
  },
  {
    id: 'saddar',
    name: 'Saddar / Cantonment',
    zone: 'Central Peshawar',
    branchId: 2,
    keywords: ['saddar', 'cantt', 'cantonment'],
  },
  {
    id: 'gulbahar',
    name: 'Gulbahar',
    zone: 'Gulbahar',
    branchId: 3,
    keywords: ['gulbahar no 1', 'gulbahar no 2', 'gulbahar no 3', 'gulbahar no 4'],
  },
  {
    id: 'faqirabad',
    name: 'Faqirabad',
    zone: 'Gulbahar',
    branchId: 3,
    keywords: ['faqir abad'],
  },
  {
    id: 'hashtnagri',
    name: 'Hashtnagri',
    zone: 'Gulbahar',
    branchId: 3,
    keywords: ['hashtnagri'],
  },
  {
    id: 'charsadda-road',
    name: 'Charsadda Road',
    zone: 'Gulbahar',
    branchId: 3,
    keywords: ['charsadda rd'],
  },
  {
    id: 'dalazak-road',
    name: 'Dalazak Road',
    zone: 'Gulbahar',
    branchId: 3,
    keywords: ['dalazak rd'],
  },
  {
    id: 'gt-road',
    name: 'GT Road / City Side',
    zone: 'Central Peshawar',
    branchId: 3,
    keywords: ['gt road', 'city', 'shahi bagh'],
  },
];

export const getDeliveryAreaById = (id: string) =>
  deliveryAreas.find((area) => area.id === id);
