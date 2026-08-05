import classicImage from '../assets/products/classicCD.png';
import potatoImage from '../assets/products/potatoeCD.png';
import ramenImage from '../assets/products/noodlesCD.png';
import flamingImage from '../assets/products/flammingCD.png';
import smokedImage from '../assets/products/smoked.png';
import greenImage from '../assets/products/green.png';
import nashvilleImage from '../assets/products/nashville.png';

import combo3Image from '../assets/products/combo-3.png';
import combo4Image from '../assets/products/combo-4.png';
import combo5Image from '../assets/products/combo-5.png';

import pepsiImage from '../assets/products/imagepepsis.jpg';
import sevenUpImage from '../assets/products/7up-drink-750ml.webp';
import waterImage from '../assets/products/refreshing-bottled-water-hydration-go_191095-78790.avif';
import sauceImage from '../assets/products/three-delicious-dipping-sauces-ketchup-mustard-soy-sauce_191095-87793.avif';

/*
 * Temporary image mappings.
 *
 * You currently do not have separate Cheeto, Corny, or Zinger
 * images in src/assets/products.
 *
 * Replace these constants when you add dedicated images.
 */
const cheetoImage = flamingImage;
const cornyImage = classicImage;
const zingerImage = classicImage;

/* =========================================================
   TYPES
========================================================= */

export type ProductCategory =
  | 'Combo Meals'
  | 'Potato Corn Dogs'
  | 'Ramen Corn Dogs'
  | 'Flaming Corn Dogs'
  | 'Classic Corn Dogs'
  | 'Smoked Corn Dogs'
  | 'Cheeto Corn Dogs'
  | 'Nashville Corn Dogs'
  | 'Zinger Corn Dogs'
  | 'Corny Corn Dogs'
  | 'Green Corn Dogs'
  | 'Drinks and Beverages';

export type MenuFilterCategory =
  | 'All'
  | 'Popular'
  | ProductCategory;

export interface MenuItem {
  id: number;
  name: string;
  category: ProductCategory;
  price: number;
  description: string;
  spiceLevel: 0 | 1 | 2 | 3;
  hasCheese: boolean;
  hasSausage: boolean;
  image: string;
  popular?: boolean;
}

/* =========================================================
   CATEGORY FILTERS
========================================================= */

export const menuCategories: MenuFilterCategory[] = [
  'All',
  'Popular',
  'Combo Meals',
  'Potato Corn Dogs',
  'Ramen Corn Dogs',
  'Flaming Corn Dogs',
  'Classic Corn Dogs',
  'Smoked Corn Dogs',
  'Cheeto Corn Dogs',
  'Nashville Corn Dogs',
  'Zinger Corn Dogs',
  'Corny Corn Dogs',
  'Green Corn Dogs',
  'Drinks and Beverages',
];

/* =========================================================
   MENU ITEMS
========================================================= */

export const menuItems: MenuItem[] = [
  /* =======================================================
     COMBO MEALS
  ======================================================= */

  {
    id: 1,
    name: 'Combo 4 Corn Dogs',
    category: 'Combo Meals',
    price: 1560,
    description:
      'Four crispy corn dogs with varied coatings and fillings, made for sharing.',
    spiceLevel: 0,
    hasCheese: true,
    hasSausage: true,
    image: combo4Image,
    popular: true,
  },
  {
    id: 2,
    name: 'Combo 5 Corn Dogs',
    category: 'Combo Meals',
    price: 2100,
    description:
      'Five crispy corn dogs in assorted flavours for a complete group meal.',
    spiceLevel: 1,
    hasCheese: true,
    hasSausage: true,
    image: combo5Image,
    popular: true,
  },
  {
    id: 3,
    name: 'Combo Meal 3',
    category: 'Combo Meals',
    price: 1198,
    description:
      'Three crispy corn dogs featuring three distinct coating and flavour varieties.',
    spiceLevel: 1,
    hasCheese: true,
    hasSausage: true,
    image: combo3Image,
    popular: true,
  },

  /* =======================================================
     POTATO CORN DOGS
  ======================================================= */

  {
    id: 4,
    name: 'Potato Corn Dog with Cheese and Sausage',
    category: 'Potato Corn Dogs',
    price: 399,
    description:
      'Golden corn dog coated with seasoned potato cubes and filled with cheese and sausage.',
    spiceLevel: 0,
    hasCheese: true,
    hasSausage: true,
    image: potatoImage,
    popular: true,
  },
  {
    id: 5,
    name: 'Potato Corn Dog with Mozzarella Cheese',
    category: 'Potato Corn Dogs',
    price: 450,
    description:
      'Crispy potato-coated corn dog filled with hot, stretchy mozzarella cheese.',
    spiceLevel: 0,
    hasCheese: true,
    hasSausage: false,
    image: potatoImage,
  },
  {
    id: 6,
    name: 'Potato Corn Dog with Sausage and Cheese Wrap',
    category: 'Potato Corn Dogs',
    price: 470,
    description:
      'Golden potato-coated corn dog with sausage and a rich cheese wrap.',
    spiceLevel: 0,
    hasCheese: true,
    hasSausage: true,
    image: potatoImage,
    popular: true,
  },
  {
    id: 7,
    name: 'Potato Corn Dog with Sausage',
    category: 'Potato Corn Dogs',
    price: 399,
    description:
      'Crispy potato-coated corn dog with a savoury sausage centre.',
    spiceLevel: 0,
    hasCheese: false,
    hasSausage: true,
    image: potatoImage,
  },

  /* =======================================================
     RAMEN CORN DOGS
  ======================================================= */

  {
    id: 8,
    name: 'Ramen Corn Dog with Cheese and Sausage',
    category: 'Ramen Corn Dogs',
    price: 380,
    description:
      'Corn dog wrapped in crispy ramen noodles with cheese and sausage inside.',
    spiceLevel: 1,
    hasCheese: true,
    hasSausage: true,
    image: ramenImage,
    popular: true,
  },
  {
    id: 9,
    name: 'Ramen Corn Dog with Sausage and Cheese Wrap',
    category: 'Ramen Corn Dogs',
    price: 450,
    description:
      'Crunchy ramen-coated corn dog with sausage and a savoury cheese wrap.',
    spiceLevel: 1,
    hasCheese: true,
    hasSausage: true,
    image: ramenImage,
  },
  {
    id: 10,
    name: 'Ramen Corn Dog with Cheese',
    category: 'Ramen Corn Dogs',
    price: 430,
    description:
      'Crispy ramen noodle coating with a soft and cheesy centre.',
    spiceLevel: 1,
    hasCheese: true,
    hasSausage: false,
    image: ramenImage,
  },
  {
    id: 11,
    name: 'Ramen Corn Dog with Sausage',
    category: 'Ramen Corn Dogs',
    price: 380,
    description:
      'Crispy ramen-coated corn dog with a juicy sausage filling.',
    spiceLevel: 1,
    hasCheese: false,
    hasSausage: true,
    image: ramenImage,
  },

  /* =======================================================
     FLAMING CORN DOGS
  ======================================================= */

  {
    id: 12,
    name: 'Flaming Corn Dog with Sausage and Cheese Wrap',
    category: 'Flaming Corn Dogs',
    price: 420,
    description:
      'Crispy corn dog coated with fiery crumbs and filled with sausage and cheese wrap.',
    spiceLevel: 3,
    hasCheese: true,
    hasSausage: true,
    image: flamingImage,
    popular: true,
  },
  {
    id: 13,
    name: 'Flaming Corn Dog Half and Half',
    category: 'Flaming Corn Dogs',
    price: 350,
    description:
      'Spicy Flaming coating with a half-cheese and half-sausage filling.',
    spiceLevel: 3,
    hasCheese: true,
    hasSausage: true,
    image: flamingImage,
  },
  {
    id: 14,
    name: 'Flaming Corn Dog with Full Cheese',
    category: 'Flaming Corn Dogs',
    price: 399,
    description:
      'Flaming hot coating with a fully melted cheese centre.',
    spiceLevel: 3,
    hasCheese: true,
    hasSausage: false,
    image: flamingImage,
    popular: true,
  },
  {
    id: 15,
    name: 'Flaming Corn Dog with Sausage',
    category: 'Flaming Corn Dogs',
    price: 350,
    description:
      'Fiery seasoned corn dog coating with a juicy sausage centre.',
    spiceLevel: 3,
    hasCheese: false,
    hasSausage: true,
    image: flamingImage,
  },

  /* =======================================================
     CLASSIC CORN DOGS
  ======================================================= */

  {
    id: 16,
    name: 'Classic Corn Dog with Cheese Wrap',
    category: 'Classic Corn Dogs',
    price: 370,
    description:
      'Golden classic corn dog with a savoury cheese-wrapped filling.',
    spiceLevel: 0,
    hasCheese: true,
    hasSausage: false,
    image: classicImage,
  },
  {
    id: 17,
    name: 'Classic Corn Dog with Full Cheese',
    category: 'Classic Corn Dogs',
    price: 350,
    description:
      'Classic crispy corn dog filled completely with melted cheese.',
    spiceLevel: 0,
    hasCheese: true,
    hasSausage: false,
    image: classicImage,
    popular: true,
  },
  {
    id: 18,
    name: 'Classic Corn Dog with Sausage',
    category: 'Classic Corn Dogs',
    price: 299,
    description:
      'Golden classic corn dog with a juicy sausage inside.',
    spiceLevel: 0,
    hasCheese: false,
    hasSausage: true,
    image: classicImage,
  },

  /* =======================================================
     SMOKED CORN DOGS
  ======================================================= */

  {
    id: 19,
    name: 'Smoked Full Cheese',
    category: 'Smoked Corn Dogs',
    price: 450,
    description:
      'Smoky crispy corn dog filled completely with melted cheese.',
    spiceLevel: 2,
    hasCheese: true,
    hasSausage: false,
    image: smokedImage,
  },
  {
    id: 20,
    name: 'Smoked Cheese Wrap',
    category: 'Smoked Corn Dogs',
    price: 460,
    description:
      'Smoky corn dog with a crispy exterior and rich cheese wrap.',
    spiceLevel: 2,
    hasCheese: true,
    hasSausage: false,
    image: smokedImage,
  },
  {
    id: 21,
    name: 'Smoked Half and Half',
    category: 'Smoked Corn Dogs',
    price: 399,
    description:
      'Smoky seasoned coating with half cheese and half sausage.',
    spiceLevel: 2,
    hasCheese: true,
    hasSausage: true,
    image: smokedImage,
    popular: true,
  },
  {
    id: 22,
    name: 'Smoked Full Sausage',
    category: 'Smoked Corn Dogs',
    price: 399,
    description:
      'Smoky crispy corn dog filled completely with sausage.',
    spiceLevel: 2,
    hasCheese: false,
    hasSausage: true,
    image: smokedImage,
  },

  /* =======================================================
     CHEETO CORN DOGS
  ======================================================= */

  {
    id: 23,
    name: 'Cheeto Full Sausage',
    category: 'Cheeto Corn Dogs',
    price: 450,
    description:
      'Corn dog coated with crunchy Cheeto seasoning and filled with sausage.',
    spiceLevel: 2,
    hasCheese: false,
    hasSausage: true,
    image: cheetoImage,
  },
  {
    id: 24,
    name: 'Cheeto Half and Half',
    category: 'Cheeto Corn Dogs',
    price: 450,
    description:
      'Crunchy Cheeto coating with half cheese and half sausage.',
    spiceLevel: 2,
    hasCheese: true,
    hasSausage: true,
    image: cheetoImage,
    popular: true,
  },
  {
    id: 25,
    name: 'Cheeto Full Cheese',
    category: 'Cheeto Corn Dogs',
    price: 499,
    description:
      'Crispy Cheeto-coated corn dog filled completely with melted cheese.',
    spiceLevel: 2,
    hasCheese: true,
    hasSausage: false,
    image: cheetoImage,
  },
  {
    id: 26,
    name: 'Cheeto Cheese Wrap',
    category: 'Cheeto Corn Dogs',
    price: 520,
    description:
      'Cheeto-seasoned crispy coating with a rich cheese wrap.',
    spiceLevel: 2,
    hasCheese: true,
    hasSausage: false,
    image: cheetoImage,
  },

  /* =======================================================
     NASHVILLE CORN DOGS
  ======================================================= */

  {
    id: 27,
    name: 'Nashville Cheese Wrap',
    category: 'Nashville Corn Dogs',
    price: 460,
    description:
      'Nashville-style crispy corn dog with a melted cheese wrap.',
    spiceLevel: 3,
    hasCheese: true,
    hasSausage: false,
    image: nashvilleImage,
  },
  {
    id: 28,
    name: 'Nashville Full Cheese',
    category: 'Nashville Corn Dogs',
    price: 450,
    description:
      'Spicy Nashville-style corn dog filled completely with cheese.',
    spiceLevel: 3,
    hasCheese: true,
    hasSausage: false,
    image: nashvilleImage,
    popular: true,
  },
  {
    id: 29,
    name: 'Nashville Full Sausage',
    category: 'Nashville Corn Dogs',
    price: 399,
    description:
      'Spicy Nashville coating with a full sausage filling.',
    spiceLevel: 3,
    hasCheese: false,
    hasSausage: true,
    image: nashvilleImage,
  },
  {
    id: 30,
    name: 'Nashville Half and Half',
    category: 'Nashville Corn Dogs',
    price: 399,
    description:
      'Nashville-style seasoning with half cheese and half sausage.',
    spiceLevel: 3,
    hasCheese: true,
    hasSausage: true,
    image: nashvilleImage,
  },

  /* =======================================================
     ZINGER CORN DOGS
  ======================================================= */

  {
    id: 31,
    name: 'Zinger Half and Half',
    category: 'Zinger Corn Dogs',
    price: 549,
    description:
      'Crispy Zinger-style coating with half cheese and half sausage.',
    spiceLevel: 2,
    hasCheese: true,
    hasSausage: true,
    image: zingerImage,
    popular: true,
  },
  {
    id: 32,
    name: 'Zinger Full Cheese',
    category: 'Zinger Corn Dogs',
    price: 599,
    description:
      'Crunchy Zinger-style corn dog filled completely with cheese.',
    spiceLevel: 2,
    hasCheese: true,
    hasSausage: false,
    image: zingerImage,
  },
  {
    id: 33,
    name: 'Zinger Full Sausage',
    category: 'Zinger Corn Dogs',
    price: 549,
    description:
      'Crunchy Zinger-style coating with a full sausage filling.',
    spiceLevel: 2,
    hasCheese: false,
    hasSausage: true,
    image: zingerImage,
  },
  {
    id: 34,
    name: 'Zinger Cheese Wrap',
    category: 'Zinger Corn Dogs',
    price: 620,
    description:
      'Crispy Zinger-style corn dog with a rich cheese wrap.',
    spiceLevel: 2,
    hasCheese: true,
    hasSausage: false,
    image: zingerImage,
  },

  /* =======================================================
     CORNY CORN DOGS
  ======================================================= */

  {
    id: 35,
    name: 'Corny Full Sausage',
    category: 'Corny Corn Dogs',
    price: 399,
    description:
      'Classic cornmeal coating with a juicy full sausage filling.',
    spiceLevel: 0,
    hasCheese: false,
    hasSausage: true,
    image: cornyImage,
  },
  {
    id: 36,
    name: 'Corny Cheese Wrap',
    category: 'Corny Corn Dogs',
    price: 460,
    description:
      'Golden cornmeal coating with a savoury cheese wrap.',
    spiceLevel: 0,
    hasCheese: true,
    hasSausage: false,
    image: cornyImage,
  },
  {
    id: 37,
    name: 'Corny Half and Half',
    category: 'Corny Corn Dogs',
    price: 399,
    description:
      'Golden Corny coating with half cheese and half sausage.',
    spiceLevel: 0,
    hasCheese: true,
    hasSausage: true,
    image: cornyImage,
    popular: true,
  },
  {
    id: 38,
    name: 'Corny Full Cheese',
    category: 'Corny Corn Dogs',
    price: 450,
    description:
      'Golden cornmeal corn dog filled completely with melted cheese.',
    spiceLevel: 0,
    hasCheese: true,
    hasSausage: false,
    image: cornyImage,
  },

  /* =======================================================
     GREEN CORN DOGS
  ======================================================= */

  {
    id: 39,
    name: 'Green Half and Half',
    category: 'Green Corn Dogs',
    price: 399,
    description:
      'Green-coated corn dog with half cheese and half sausage.',
    spiceLevel: 1,
    hasCheese: true,
    hasSausage: true,
    image: greenImage,
    popular: true,
  },
  {
    id: 40,
    name: 'Green Cheese Wrap',
    category: 'Green Corn Dogs',
    price: 460,
    description:
      'Green crispy coating with a rich cheese wrap.',
    spiceLevel: 1,
    hasCheese: true,
    hasSausage: false,
    image: greenImage,
  },
  {
    id: 41,
    name: 'Green Full Sausage',
    category: 'Green Corn Dogs',
    price: 399,
    description:
      'Green crispy coating with a full sausage centre.',
    spiceLevel: 1,
    hasCheese: false,
    hasSausage: true,
    image: greenImage,
  },
  {
    id: 42,
    name: 'Green Full Cheese',
    category: 'Green Corn Dogs',
    price: 399,
    description:
      'Green crispy coating with a full melted-cheese centre.',
    spiceLevel: 1,
    hasCheese: true,
    hasSausage: false,
    image: greenImage,
  },

  /* =======================================================
     DRINKS AND BEVERAGES
  ======================================================= */

  {
    id: 43,
    name: 'Bottled Water 500ml',
    category: 'Drinks and Beverages',
    price: 50,
    description:
      'Refreshing bottled water in a convenient 500ml size.',
    spiceLevel: 0,
    hasCheese: false,
    hasSausage: false,
    image: waterImage,
  },
  {
    id: 44,
    name: '7Up 250ml',
    category: 'Drinks and Beverages',
    price: 99,
    description:
      'Refreshing lemon-lime 7Up in a convenient 250ml bottle.',
    spiceLevel: 0,
    hasCheese: false,
    hasSausage: false,
    image: sevenUpImage,
  },
  {
    id: 45,
    name: 'Pepsi 250ml',
    category: 'Drinks and Beverages',
    price: 99,
    description:
      'Ice-cold Pepsi in a convenient 250ml bottle.',
    spiceLevel: 0,
    hasCheese: false,
    hasSausage: false,
    image: pepsiImage,
    popular: true,
  },
  {
    id: 46,
    name: 'Dip Sauce',
    category: 'Drinks and Beverages',
    price: 50,
    description:
      'Creamy dipping sauce made to complement your favourite MFZ meal.',
    spiceLevel: 0,
    hasCheese: false,
    hasSausage: false,
    image: sauceImage,
  },
];

/* =========================================================
   HELPERS
========================================================= */

export const formatPKR = (price: number): string =>
  `Rs. ${price.toLocaleString('en-PK')}`;

export const getMenuItemById = (
  id: number,
): MenuItem | undefined =>
  menuItems.find((item) => item.id === id);

export const getPopularMenuItems = (): MenuItem[] =>
  menuItems.filter((item) => item.popular);

export const getMenuItemsByCategory = (
  category: MenuFilterCategory,
): MenuItem[] => {
  if (category === 'All') {
    return menuItems;
  }

  if (category === 'Popular') {
    return getPopularMenuItems();
  }

  return menuItems.filter(
    (item) => item.category === category,
  );
};