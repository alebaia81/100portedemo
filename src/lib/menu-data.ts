export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "Hamburger" | "Pizze" | "Birre" | "Specialità" | "Contorni";
  image?: string;
  promo?: boolean;
}

export const MENU_DATA: Product[] = [
  {
    id: "polpo",
    name: "Il Polpo",
    description: "Burger composto da un succulento tentacolo di polpo alla piastra, pomodori confit, insalata, maionese delicata alla menta il tutto accompagnato da patatine fritte.",
    price: 14,
    category: "Hamburger",
    promo: true
  },
  {
    id: "pollo",
    name: "Il Pollo",
    description: "Burger composto da saporiti filetti di pollo fritti, colata di cheddar fuso, bacon affumicato croccante il tutto accompagnato da patatine fritte.",
    price: 10,
    category: "Hamburger",
    promo: true
  },
  {
    id: "birra-mese",
    name: "Corsendonk Grand Hops",
    description: "Birra dorata ad alta fermentazione, ben equilibrata. Retrogusto amarognolo raffinato dovuto a varietà extra di luppolo.",
    price: 7,
    category: "Birre",
    promo: true
  },
  {
    id: "menu-polpo",
    name: "Menu Polpo + Birra del Mese",
    description: "Burger Il Polpo + Birra Corsendonk Grand Hops + Gadget in omaggio!",
    price: 18,
    category: "Specialità",
    promo: true
  },
  {
    id: "menu-pollo",
    name: "Menu Pollo + Birra del Mese",
    description: "Burger Il Pollo + Birra Corsendonk Grand Hops + Gadget in omaggio!",
    price: 15,
    category: "Specialità",
    promo: true
  },
  // Aggiungo alcune pizze d'esempio come richiesto nel prompt precedente
  {
    id: "margherita",
    name: "Pizza Margherita",
    description: "Pomodoro, mozzarella fior di latte, basilico fresco.",
    price: 6,
    category: "Pizze"
  },
  {
    id: "diavola",
    name: "Pizza Diavola",
    description: "Pomodoro, mozzarella, salamino piccante.",
    price: 8,
    category: "Pizze"
  }
];
