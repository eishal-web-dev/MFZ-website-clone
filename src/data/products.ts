import flamingImage from '../assets/products/flammingCD.png';
import potatoImage from '../assets/products/potatoeCD.png';
import ramenImage from '../assets/products/noodlesCD.png';
import classicImage from '../assets/products/classicCD.png';
import smokedImage from '../assets/products/smoked.png';
import greenImage from '../assets/products/green.png';
import nashvilleImage from '../assets/products/nashville.png';

export type FillingOption =
  | 'Full Cheese'
  | 'Full Sausage'
  | 'Half & Half'
  | 'Cheese Wrap'
  | 'Sausage & Cheese Wrap';

export interface ProductVisual {
  scale: number;
  rotation: number;
  offsetX: number;
  offsetY: number;
}

export interface Product {
  id: number;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  price: number;
  image: string;
  dominantColor: string;
  secondaryColor: string;
  accentColor: string;
  onAccent: string;
  textColor: string;
  mutedText: string;
  bgColor: string;
  bgGradient: string;
  particleType:
    | 'sparks'
    | 'potato'
    | 'ramen'
    | 'crumbs'
    | 'embers'
    | 'herbs'
    | 'chilli'
    | 'flakes';
  particleColor: string;
  ingredients: string[];
  spiceLevel: 0 | 1 | 2 | 3;
  fillingOptions: FillingOption[];
  category: string;
  cta: string;
  coating: string;
  visual: ProductVisual;
}

export const products: Product[] = [
  {
    id: 1,
    name: 'Flaming Corn Dog',
    shortName: 'Flaming',
    tagline: 'Turn Up the Crunch.',
    description:
      'A bold, spicy corndog coated in fiery Cheeto crumbs with an intense crunch and a molten centre.',
    price: 650,
    image: flamingImage,
    dominantColor: '#e11d2a',
    secondaryColor: '#d24a14',
    accentColor: '#ffd60a',
    onAccent: '#1a0505',
    textColor: '#fff5e6',
    mutedText: '#f6d9cf',
    bgColor: '#1a0505',
    bgGradient:
      'radial-gradient(circle at 60% 40%, #8e0d12 0%, #4a0509 50%, #140202 100%)',
    particleType: 'sparks',
    particleColor: '#ff8a00',
    ingredients: [
      'Cheeto crumbs',
      'Chilli flakes',
      'Molten cheese',
      'Spicy batter',
    ],
    spiceLevel: 3,
    fillingOptions: ['Full Cheese', 'Full Sausage', 'Half & Half'],
    category: 'Flaming Corn Dogs',
    cta: 'Taste the Heat',
    coating: 'Flaming',
    visual: {
      scale: 1,
      rotation: -10,
      offsetX: 0,
      offsetY: 0,
    },
  },
  {
    id: 2,
    name: 'Potato Corn Dog',
    shortName: 'Potato',
    tagline: 'Golden on the Outside. Gooey Inside.',
    description:
      'A crispy corndog covered with golden potato cubes and filled with sausage, cheese or half-and-half.',
    price: 600,
    image: potatoImage,
    dominantColor: '#f5a623',
    secondaryColor: '#f7e3a1',
    accentColor: '#b8341a',
    onAccent: '#fff5e6',
    textColor: '#fff5e6',
    mutedText: '#f4ddbd',
    bgColor: '#1a1208',
    bgGradient:
      'radial-gradient(circle at 55% 45%, #a86610 0%, #5a3a08 50%, #1a1208 100%)',
    particleType: 'potato',
    particleColor: '#ffcf6b',
    ingredients: [
      'Potato cubes',
      'Sea salt',
      'Breadcrumb',
      'Cheese pull',
    ],
    spiceLevel: 0,
    fillingOptions: [
      'Full Cheese',
      'Full Sausage',
      'Half & Half',
      'Cheese Wrap',
    ],
    category: 'Potato Corn Dogs',
    cta: 'Go Golden',
    coating: 'Potato',
    visual: {
      scale: 0.94,
      rotation: -8,
      offsetX: 0,
      offsetY: 0,
    },
  },
  {
    id: 3,
    name: 'Ramen Corn Dog',
    shortName: 'Ramen',
    tagline: 'Crunch Beyond Ordinary.',
    description:
      'A Korean-inspired corndog wrapped in crispy ramen noodles for an extra-loud crunch.',
    price: 700,
    image: ramenImage,
    dominantColor: '#ff6b1a',
    secondaryColor: '#a3e635',
    accentColor: '#ffd60a',
    onAccent: '#1a0a04',
    textColor: '#fff5e6',
    mutedText: '#f6dcc3',
    bgColor: '#1a0a04',
    bgGradient:
      'radial-gradient(circle at 50% 45%, #b34d0c 0%, #5a2604 50%, #140702 100%)',
    particleType: 'ramen',
    particleColor: '#ffe08a',
    ingredients: [
      'Ramen noodles',
      'Spring onion',
      'Sauce droplets',
      'Crunchy batter',
    ],
    spiceLevel: 1,
    fillingOptions: ['Full Cheese', 'Full Sausage', 'Half & Half'],
    category: 'Ramen Corn Dogs',
    cta: 'Hear the Crunch',
    coating: 'Ramen',
    visual: {
      scale: 0.96,
      rotation: -9,
      offsetX: 0,
      offsetY: 0,
    },
  },
  {
    id: 4,
    name: 'Classic Corn Dog',
    shortName: 'Classic',
    tagline: 'The Original Never Misses.',
    description:
      'A perfectly golden classic corndog with a crisp outer layer and your choice of cheese, sausage or half-and-half.',
    price: 500,
    image: classicImage,
    dominantColor: '#f7e3a1',
    secondaryColor: '#f5a623',
    accentColor: '#b8341a',
    onAccent: '#fff5e6',
    textColor: '#fff5e6',
    mutedText: '#ead9b5',
    bgColor: '#1a1408',
    bgGradient:
      'radial-gradient(circle at 50% 45%, #8a6a18 0%, #4a3a14 50%, #1a1408 100%)',
    particleType: 'crumbs',
    particleColor: '#f5d77a',
    ingredients: [
      'Golden crumbs',
      'Ketchup',
      'Mustard',
      'Cheese cubes',
    ],
    spiceLevel: 0,
    fillingOptions: ['Full Cheese', 'Full Sausage', 'Half & Half'],
    category: 'Classic Corn Dogs',
    cta: 'Keep It Classic',
    coating: 'Classic',
    visual: {
      scale: 0.92,
      rotation: -8,
      offsetX: 0,
      offsetY: 0,
    },
  },
  {
    id: 5,
    name: 'Smoked Corn Dog',
    shortName: 'Smoked',
    tagline: 'Dark. Smoky. Addictive.',
    description:
      'A rich smoky corndog with a crunchy crust and a deep savoury finish.',
    price: 750,
    image: smokedImage,
    dominantColor: '#2a2a2a',
    secondaryColor: '#6b6b6b',
    accentColor: '#ff7a1a',
    onAccent: '#1a0a02',
    textColor: '#f0e6d8',
    mutedText: '#cbbcae',
    bgColor: '#050505',
    bgGradient:
      'radial-gradient(circle at 50% 45%, #2a2a2a 0%, #141414 50%, #050505 100%)',
    particleType: 'embers',
    particleColor: '#ff8a3d',
    ingredients: [
      'Smoke trails',
      'Charcoal crust',
      'Embers',
      'Dark sauce',
    ],
    spiceLevel: 2,
    fillingOptions: ['Full Cheese', 'Full Sausage', 'Half & Half'],
    category: 'Smoked Corn Dogs',
    cta: 'Enter the Smoke',
    coating: 'Smoked',
    visual: {
      scale: 0.95,
      rotation: -9,
      offsetX: 0,
      offsetY: 0,
    },
  },
  {
    id: 6,
    name: 'Green Corn Dog',
    shortName: 'Green',
    tagline: 'Different Looks Delicious.',
    description:
      'A bold green-coated corndog with a playful appearance and rich cheesy filling.',
    price: 620,
    image: greenImage,
    dominantColor: '#39ff14',
    secondaryColor: '#14532d',
    accentColor: '#22c55e',
    onAccent: '#052e16',
    textColor: '#fff5e6',
    mutedText: '#cce8d2',
    bgColor: '#052e16',
    bgGradient:
      'radial-gradient(circle at 50% 45%, #166534 0%, #0a3a1a 50%, #052e16 100%)',
    particleType: 'herbs',
    particleColor: '#86efac',
    ingredients: [
      'Green crumbs',
      'Herbs',
      'Cheese ribbons',
      'Neon glow',
    ],
    spiceLevel: 1,
    fillingOptions: ['Full Cheese', 'Half & Half', 'Cheese Wrap'],
    category: 'Green Corn Dogs',
    cta: 'Go Green',
    coating: 'Green',
    visual: {
      scale: 0.95,
      rotation: -8,
      offsetX: 0,
      offsetY: 0,
    },
  },
  {
    id: 7,
    name: 'Nashville Corn Dog',
    shortName: 'Nashville',
    tagline: 'Sweet Heat. Serious Crunch.',
    description:
      'A Nashville-inspired corndog with bold seasoning, rich spice and a satisfying crispy finish.',
    price: 680,
    image: nashvilleImage,
    dominantColor: '#b91c1c',
    secondaryColor: '#7f1d1d',
    accentColor: '#f59e0b',
    onAccent: '#1a0505',
    textColor: '#fff5e6',
    mutedText: '#f0c6ba',
    bgColor: '#1a0505',
    bgGradient:
      'radial-gradient(circle at 50% 45%, #7f1d1d 0%, #3a0a0a 50%, #140202 100%)',
    particleType: 'chilli',
    particleColor: '#f59e0b',
    ingredients: [
      'Chilli dust',
      'Honey droplets',
      'Seasoning',
      'Hot sauce',
    ],
    spiceLevel: 3,
    fillingOptions: [
      'Full Sausage',
      'Half & Half',
      'Sausage & Cheese Wrap',
    ],
    category: 'Nashville Corn Dogs',
    cta: 'Feel the Heat',
    coating: 'Nashville',
    visual: {
      scale: 0.95,
      rotation: -8,
      offsetX: 0,
      offsetY: 0,
    },
  },
  {
    id: 8,
    name: 'Zinger Corn Dog',
    shortName: 'Zinger',
    tagline: 'Bigger Bite. Louder Crunch.',
    description:
      'A heavy, crispy zinger-style corndog made for customers who want maximum crunch.',
    price: 720,

    // No Zinger image exists in your assets folder yet.
    // This keeps the project compiling until you add one.
    image: classicImage,

    dominantColor: '#fde047',
    secondaryColor: '#1a1a1a',
    accentColor: '#dc2626',
    onAccent: '#fff5e6',
    textColor: '#fff5e6',
    mutedText: '#e7d7b2',
    bgColor: '#1a1408',
    bgGradient:
      'radial-gradient(circle at 50% 45%, #8a6a08 0%, #4a3a08 50%, #1a1408 100%)',
    particleType: 'flakes',
    particleColor: '#facc15',
    ingredients: [
      'Fried flakes',
      'Spicy mayo',
      'Impact crumbs',
      'Bold seasoning',
    ],
    spiceLevel: 2,
    fillingOptions: [
      'Full Sausage',
      'Half & Half',
      'Sausage & Cheese Wrap',
    ],
    category: 'Zinger Corn Dogs',
    cta: 'Take the Big Bite',
    coating: 'Zinger',
    visual: {
      scale: 0.92,
      rotation: -8,
      offsetX: 0,
      offsetY: 0,
    },
  },
];

export const getProductById = (id: number): Product | undefined =>
  products.find((product) => product.id === id);