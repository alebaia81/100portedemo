import menuJson from './menu.json';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "Hamburger" | "Pizze" | "Birre" | "Specialità" | "Contorni" | string;
  image?: string;
  promo?: boolean;
}

export const MENU_DATA: Product[] = menuJson.map((item) => ({
  id: item.id,
  name: item.name,
  description: item.description,
  price: item.price,
  category: item.category,
  image: item.image,
  promo: item.promo ?? false,
}));
