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
import waterImage from '../assets/products/refreshing-bottled-water-hydration-go_191095-78790.avif';
import sauceImage from '../assets/products/three-delicious-dipping-sauces-ketchup-mustard-soy-sauce_191095-87793.avif';

export type ProductCategory =
  | 'Premium Corn Dogs'
  | 'Corn Dogs'
  | 'Meals & Combos'
  | 'Friday Deals'
  | 'Add-ons & Drinks';

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

export const menuCategories: MenuFilterCategory[] = [
  'All',
  'Popular',
  'Premium Corn Dogs',
  'Corn Dogs',
  'Meals & Combos',
  'Friday Deals',
  'Add-ons & Drinks',
];

const item = (
  id: number,
  name: string,
  category: ProductCategory,
  price: number,
  description: string,
  image: string,
  options: Partial<
    Pick<
      MenuItem,
      'spiceLevel' | 'hasCheese' | 'hasSausage' | 'popular'
    >
  > = {},
): MenuItem => ({
  id,
  name,
  category,
  price,
  description,
  image,
  spiceLevel: options.spiceLevel ?? 0,
  hasCheese: options.hasCheese ?? true,
  hasSausage: options.hasSausage ?? true,
  popular: options.popular,
});

export const menuItems: MenuItem[] = [
  // Premium corn dogs - premium filling is included.
  item(1, 'Smash', 'Premium Corn Dogs', 649, 'The signature MFZ premium corn dog with a bold crunchy coating.', greenImage, { spiceLevel: 2, popular: true }),
  item(2, 'Papor', 'Premium Corn Dogs', 539, 'A premium corn dog layered with crisp papor-style bites.', flamingImage, { spiceLevel: 1 }),
  item(3, 'Kabab', 'Premium Corn Dogs', 569, 'A hearty premium corn dog finished with savoury kabab pieces.', smokedImage, { spiceLevel: 1, popular: true }),
  item(4, 'Zinger', 'Premium Corn Dogs', 549, 'Crunchy zinger-style chicken coating with your preferred premium filling.', classicImage, { spiceLevel: 2, popular: true }),
  item(5, 'Pizza', 'Premium Corn Dogs', 529, 'Pizza-inspired toppings, cheese and seasoning on a crispy corn dog.', potatoImage, { spiceLevel: 1 }),
  item(6, 'Arabian', 'Premium Corn Dogs', 569, 'Arabian-inspired savoury coating with a rich premium filling.', smokedImage, { spiceLevel: 1 }),

  // Regular corn dogs.
  item(7, 'Ramen', 'Corn Dogs', 349, 'A crispy ramen-noodle coated corn dog.', ramenImage, { spiceLevel: 1, popular: true }),
  item(8, 'Smock', 'Corn Dogs', 379, 'A smoky, crunchy MFZ corn dog with signature sauce.', smokedImage, { spiceLevel: 2 }),
  item(9, 'Nashvil', 'Corn Dogs', 399, 'Nashville-style heat and crunch in every bite.', nashvilleImage, { spiceLevel: 3, popular: true }),
  item(10, 'Cheeto', 'Corn Dogs', 420, 'A vibrant Cheeto crumb coating with a bold cheesy crunch.', flamingImage, { spiceLevel: 2, popular: true }),
  item(11, 'Potato', 'Corn Dogs', 379, 'A golden corn dog coated with crispy seasoned potato cubes.', potatoImage, { spiceLevel: 0, popular: true }),
  item(12, 'Flamingo', 'Corn Dogs', 379, 'A fiery red crumb coating for serious spice lovers.', flamingImage, { spiceLevel: 3, popular: true }),
  item(13, 'Classic', 'Corn Dogs', 349, 'The original golden MFZ corn dog with signature sauces.', classicImage, { spiceLevel: 0, popular: true }),
  item(14, 'Green', 'Corn Dogs', 369, 'A fresh green chilli and herb crunch around a cheesy corn dog.', greenImage, { spiceLevel: 2 }),
  item(15, 'Corny', 'Corn Dogs', 399, 'Sweet corn kernels create a crisp, colourful coating.', potatoImage, { spiceLevel: 0 }),
  item(16, 'Vegie', 'Corn Dogs', 349, 'A vegetable-topped corn dog with a colourful savoury crunch.', potatoImage, { spiceLevel: 1, hasSausage: false }),
  item(17, 'Plain', 'Corn Dogs', 299, 'A simple crispy corn dog with full sausage and no cheese.', classicImage, { hasCheese: false, hasSausage: true }),

  // Meals and combos.
  item(18, 'Hot Meal', 'Meals & Combos', 999, 'Three hot corn dogs served with three drinks.', combo3Image, { spiceLevel: 3, popular: true }),
  item(19, 'Green Meal', 'Meals & Combos', 1150, 'Three green corn dogs served with three drinks.', combo3Image, { spiceLevel: 2 }),
  item(20, 'Premium 2', 'Meals & Combos', 1150, 'Two assorted premium corn dogs with two drinks.', combo3Image, { popular: true }),
  item(21, 'Cheeto Meal', 'Meals & Combos', 1260, 'Three Cheeto corn dogs served with three drinks.', combo3Image, { spiceLevel: 2 }),
  item(22, 'Veg Meal', 'Meals & Combos', 999, 'A three-piece vegetable-inspired corn dog selection.', combo3Image, { hasSausage: false }),
  item(23, 'Combo 3 Mix', 'Meals & Combos', 999, 'Three different MFZ corn dogs in one mixed combo.', combo3Image, { popular: true }),
  item(24, 'Zinger 2', 'Meals & Combos', 1150, 'Two Zinger corn dogs with two drinks and dipping sauces.', combo3Image, { spiceLevel: 2 }),
  item(25, 'Premium 2 Pro', 'Meals & Combos', 1050, 'Two premium corn dogs with two drinks and dipping sauces.', combo3Image),
  item(26, 'Pizza Meal', 'Meals & Combos', 999, 'Two Pizza corn dogs with two drinks and dipping sauces.', combo3Image),
  item(27, 'Combo 3', 'Meals & Combos', 999, 'Three assorted MFZ corn dogs for sharing.', combo3Image, { popular: true }),
  item(28, 'Combo 2', 'Meals & Combos', 779, 'Two assorted MFZ corn dogs with two drinks.', combo3Image),
  item(29, 'Classic Meal', 'Meals & Combos', 999, 'Three Classic corn dogs served with three drinks.', combo3Image),

  // Friday-only deals.
  item(30, 'Friday Combo 10', 'Friday Deals', 1999, 'Ten assorted MFZ corn dogs in the Friday sharing deal.', combo5Image, { popular: true }),
  item(31, 'Friday Zinger 5', 'Friday Deals', 1999, 'Five crunchy Zinger corn dogs in a Friday-only deal.', combo5Image, { spiceLevel: 2 }),
  item(32, 'Friday Premium 5', 'Friday Deals', 2499, 'Five assorted premium corn dogs in a Friday-only deal.', combo5Image, { popular: true }),
  item(33, 'Friday Combo 5', 'Friday Deals', 999, 'Five assorted corn dogs in the Friday value deal.', combo5Image, { popular: true }),
  item(34, 'Friday Plain 6', 'Friday Deals', 999, 'Six Plain full-sausage corn dogs in the Friday deal.', combo4Image, { hasCheese: false }),
  item(35, 'Friday Premium 3', 'Friday Deals', 1650, 'Three premium corn dogs with three drinks and dipping sauces.', combo3Image),

  // Filling upgrades, drinks and extras.
  item(36, 'Full Sausage + Cheese Wrap', 'Add-ons & Drinks', 79, 'Upgrade the filling to full sausage with a cheese wrap.', sauceImage, { hasCheese: true, hasSausage: true }),
  item(37, 'Full Mozzarella Cheese', 'Add-ons & Drinks', 49, 'Upgrade the filling to full stretchy mozzarella cheese.', sauceImage, { hasCheese: true, hasSausage: false }),
  item(38, 'Cheetos Powder', 'Add-ons & Drinks', 50, 'Extra Cheetos powder for more flavour and crunch.', sauceImage, { hasCheese: false, hasSausage: false }),
  item(39, 'Extra Sauce', 'Add-ons & Drinks', 50, 'Choose an extra serving of your favourite MFZ sauce.', sauceImage, { hasCheese: false, hasSausage: false }),
  item(40, 'Dip Sauce', 'Add-ons & Drinks', 50, 'An extra creamy MFZ dipping sauce.', sauceImage, { hasCheese: false, hasSausage: false }),
  item(41, 'Drink', 'Add-ons & Drinks', 99, 'A chilled soft drink with your meal.', pepsiImage, { hasCheese: false, hasSausage: false }),
  item(42, 'Small Water', 'Add-ons & Drinks', 50, 'A refreshing small bottle of water.', waterImage, { hasCheese: false, hasSausage: false }),
  item(43, 'Extra Tray', 'Add-ons & Drinks', 30, 'An additional serving tray for your order.', sauceImage, { hasCheese: false, hasSausage: false }),
  item(44, 'Extra Box', 'Add-ons & Drinks', 30, 'An additional takeaway box for your order.', sauceImage, { hasCheese: false, hasSausage: false }),
  item(45, 'Extra Food Bag', 'Add-ons & Drinks', 30, 'An additional MFZ takeaway food bag.', sauceImage, { hasCheese: false, hasSausage: false }),
];

export const formatPKR = (price: number): string =>
  `Rs. ${price.toLocaleString('en-PK')}`;

export const getMenuItemById = (
  id: number,
): MenuItem | undefined =>
  menuItems.find((menuItem) => menuItem.id === id);

export const getPopularMenuItems = (): MenuItem[] =>
  menuItems.filter((menuItem) => menuItem.popular);

export const getMenuItemsByCategory = (
  category: MenuFilterCategory,
): MenuItem[] => {
  if (category === 'All') return menuItems;
  if (category === 'Popular') return getPopularMenuItems();

  return menuItems.filter(
    (menuItem) => menuItem.category === category,
  );
};
