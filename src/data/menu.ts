export interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  spiceLevel: 0 | 1 | 2 | 3;
  hasCheese: boolean;
  hasSausage: boolean;
  image?: string;
  popular?: boolean;
}

export const menuCategories = [
  'Popular',
  'Classic Corn Dogs',
  'Potato Corn Dogs',
  'Ramen Corn Dogs',
  'Flaming Corn Dogs',
  'Smoked Corn Dogs',
  'Nashville Corn Dogs',
  'Cheeto Corn Dogs',
  'Zinger Corn Dogs',
  'Hot Dogs',
  'Burgers',
  'Loaded Fries',
  'Combo Meals',
  'Drinks',
];

export const menuItems: MenuItem[] = [
  { id: 1, name: 'Classic Corn Dog', category: 'Classic Corn Dogs', price: 500, description: 'Golden crispy corndog with your choice of filling.', spiceLevel: 0, hasCheese: true, hasSausage: true, popular: true },
  { id: 2, name: 'Potato Corn Dog', category: 'Potato Corn Dogs', price: 600, description: 'Golden potato cubes on the outside, gooey inside.', spiceLevel: 0, hasCheese: true, hasSausage: true, popular: true },
  { id: 3, name: 'Ramen Corn Dog', category: 'Ramen Corn Dogs', price: 700, description: 'Wrapped in crispy ramen noodles for extra-loud crunch.', spiceLevel: 1, hasCheese: true, hasSausage: true, popular: true },
  { id: 4, name: 'Flaming Corn Dog', category: 'Flaming Corn Dogs', price: 650, description: 'Fiery Cheeto crumbs with an intense crunch and molten centre.', spiceLevel: 3, hasCheese: true, hasSausage: true, popular: true },
  { id: 5, name: 'Smoked Corn Dog', category: 'Smoked Corn Dogs', price: 750, description: 'Rich smoky corndog with a crunchy crust and deep savoury finish.', spiceLevel: 2, hasCheese: true, hasSausage: true },
  { id: 6, name: 'Nashville Corn Dog', category: 'Nashville Corn Dogs', price: 680, description: 'Bold seasoning, rich spice and a satisfying crispy finish.', spiceLevel: 3, hasCheese: false, hasSausage: true, popular: true },
  { id: 7, name: 'Cheeto Corn Dog', category: 'Cheeto Corn Dogs', price: 670, description: 'Crushed Cheeto coating with a fiery, crunchy personality.', spiceLevel: 2, hasCheese: true, hasSausage: true },
  { id: 8, name: 'Zinger Corn Dog', category: 'Zinger Corn Dogs', price: 720, description: 'Heavy, crispy zinger-style corndog for maximum crunch.', spiceLevel: 2, hasCheese: false, hasSausage: true, popular: true },
  { id: 9, name: 'Green Corn Dog', category: 'Classic Corn Dogs', price: 620, description: 'Bold green-coated corndog with rich cheesy filling.', spiceLevel: 1, hasCheese: true, hasSausage: false },
  { id: 10, name: 'Classic Hot Dog', category: 'Hot Dogs', price: 450, description: 'Juicy sausage in a soft bun with your choice of sauces.', spiceLevel: 0, hasCheese: false, hasSausage: true },
  { id: 11, name: 'Cheese Hot Dog', category: 'Hot Dogs', price: 520, description: 'Hot dog loaded with molten cheese sauce.', spiceLevel: 0, hasCheese: true, hasSausage: true },
  { id: 12, name: 'Spicy Hot Dog', category: 'Hot Dogs', price: 550, description: 'Hot dog with spicy mayo and chilli flakes.', spiceLevel: 2, hasCheese: false, hasSausage: true },
  { id: 13, name: 'MFZ Crunch Burger', category: 'Burgers', price: 800, description: 'Crispy chicken patty, cheese, lettuce and MFZ signature sauce.', spiceLevel: 1, hasCheese: true, hasSausage: false, popular: true },
  { id: 14, name: 'Double Cheese Burger', category: 'Burgers', price: 950, description: 'Two beef patties, double cheese, caramelised onions.', spiceLevel: 0, hasCheese: true, hasSausage: false },
  { id: 15, name: 'Zinger Burger', category: 'Burgers', price: 880, description: 'Spicy zinger fillet with jalapeños and cheese.', spiceLevel: 3, hasCheese: true, hasSausage: false },
  { id: 16, name: 'Loaded Fries Cheese', category: 'Loaded Fries', price: 480, description: 'Crispy fries smothered in molten cheese sauce.', spiceLevel: 0, hasCheese: true, hasSausage: false, popular: true },
  { id: 17, name: 'Loaded Fries Spicy', category: 'Loaded Fries', price: 520, description: 'Fries with spicy mayo, jalapeños and chilli flakes.', spiceLevel: 3, hasCheese: false, hasSausage: false },
  { id: 18, name: 'Loaded Fries BBQ', category: 'Loaded Fries', price: 550, description: 'Fries with BBQ sauce, onions and cheese.', spiceLevel: 1, hasCheese: true, hasSausage: false },
  { id: 19, name: 'MFZ Combo for Two', category: 'Combo Meals', price: 1800, description: 'Two corndogs, loaded fries and two drinks.', spiceLevel: 0, hasCheese: true, hasSausage: true, popular: true },
  { id: 20, name: 'Solo Crunch Combo', category: 'Combo Meals', price: 950, description: 'One corndog, loaded fries and a drink.', spiceLevel: 0, hasCheese: true, hasSausage: true },
  { id: 21, name: 'Family Feast', category: 'Combo Meals', price: 3200, description: 'Four corndogs, two loaded fries, four drinks.', spiceLevel: 0, hasCheese: true, hasSausage: true },
  { id: 22, name: 'Cola', category: 'Drinks', price: 120, description: 'Chilled cola can.', spiceLevel: 0, hasCheese: false, hasSausage: false },
  { id: 23, name: 'Mango Lassi', category: 'Drinks', price: 180, description: 'Creamy mango yoghurt drink.', spiceLevel: 0, hasCheese: false, hasSausage: false, popular: true },
  { id: 24, name: 'Lemon Mint', category: 'Drinks', price: 150, description: 'Refreshing lemon mint cooler.', spiceLevel: 0, hasCheese: false, hasSausage: false },
];

export const formatPKR = (price: number) => `Rs ${price.toLocaleString()}`;
