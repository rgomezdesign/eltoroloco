import type { StaticImageData } from "next/image";
import hero from "@/assets/food/hero.webp";
import ceviche from "@/assets/food/ceviche.webp";
import guacamole from "@/assets/food/guacamole.webp";
import nachos from "@/assets/food/nachos.webp";
import fries from "@/assets/food/fries.webp";
import quesadilla from "@/assets/food/quesadilla.webp";
import nuggets from "@/assets/food/nuggets.webp";

/* Concept redesign: a curated sample of the menu. Prices are samples. */

export type OptionGroup = {
  id: string;
  label: string;
  required: boolean;
  /** single = choose one, multi = choose any */
  kind: "single" | "multi";
  choices: { id: string; label: string; price?: number }[];
};

export type Item = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: CategoryId;
  photo?: StaticImageData;
  badge?: "Popular" | "Spicy";
  options?: OptionGroup[];
};

export type CategoryId = "appetizers" | "tacos" | "plates" | "mariscos" | "drinks";

export const CATEGORIES: { id: CategoryId; label: string; blurb?: string }[] = [
  { id: "appetizers", label: "Appetizers" },
  { id: "tacos", label: "Street Tacos", blurb: "Corn tortillas, fresh off the comal." },
  { id: "plates", label: "Plates", blurb: "Served with rice and beans." },
  { id: "mariscos", label: "Mariscos" },
  { id: "drinks", label: "Aguas Frescas" },
];

const MEAT: OptionGroup = {
  id: "meat",
  label: "Meat",
  required: true,
  kind: "single",
  choices: [
    { id: "asada", label: "Asada" },
    { id: "pollo", label: "Pollo" },
    { id: "pastor", label: "Al pastor" },
    { id: "carnitas", label: "Carnitas" },
  ],
};
const TORTILLA: OptionGroup = {
  id: "tortilla",
  label: "Tortilla",
  required: true,
  kind: "single",
  choices: [
    { id: "corn", label: "Corn" },
    { id: "flour", label: "Flour" },
  ],
};
const TACO_ADDONS: OptionGroup = {
  id: "addons",
  label: "Add-ons",
  required: false,
  kind: "multi",
  choices: [
    { id: "cheese", label: "Cheese", price: 0.5 },
    { id: "guac", label: "Guacamole", price: 1 },
    { id: "extra", label: "Extra meat", price: 1.5 },
  ],
};
const SIZE: OptionGroup = {
  id: "size",
  label: "Size",
  required: true,
  kind: "single",
  choices: [
    { id: "md", label: "Medium" },
    { id: "lg", label: "Large", price: 1.5 },
  ],
};

export const ITEMS: Item[] = [
  { id: "ceviche-tostada", name: "Ceviche Tostada", description: "Lime-cured shrimp, pico de gallo and avocado on a crisp tostada.", price: 6.99, category: "appetizers", photo: ceviche, badge: "Popular" },
  { id: "chips-guac", name: "Chips & Guacamole", description: "Fresh guacamole made to order with warm, salted chips.", price: 9.39, category: "appetizers", photo: guacamole },
  { id: "super-nachos", name: "Super Nachos", description: "Carne asada, beans, cheese, crema, pico and jalapeños.", price: 11.99, category: "appetizers", photo: nachos, badge: "Popular", options: [MEAT] },
  { id: "loco-fries", name: "Loco Fries", description: "Fries loaded with asada, melted cheese, crema and guac.", price: 11.59, category: "appetizers", photo: fries, options: [MEAT] },
  { id: "quesadilla", name: "Quesadilla", description: "Flour tortilla, melted cheese and your choice of meat.", price: 7.99, category: "appetizers", photo: quesadilla, options: [MEAT] },
  { id: "nuggets", name: "Chicken Nuggets", description: "Crispy, golden and a favorite with the kids.", price: 7.19, category: "appetizers", photo: nuggets },

  { id: "asada-taco", name: "Asada Taco", description: "Grilled steak, onion, cilantro and salsa verde.", price: 3.5, category: "tacos", badge: "Popular", options: [TORTILLA, TACO_ADDONS] },
  { id: "pastor-taco", name: "Al Pastor Taco", description: "Marinated pork, pineapple, onion and cilantro.", price: 3.5, category: "tacos", badge: "Popular", options: [TORTILLA, TACO_ADDONS] },
  { id: "carnitas-taco", name: "Carnitas Taco", description: "Slow-cooked pork, onion and cilantro.", price: 3.5, category: "tacos", options: [TORTILLA, TACO_ADDONS] },
  { id: "pollo-taco", name: "Pollo Taco", description: "Grilled chicken, onion, cilantro and salsa roja.", price: 3.25, category: "tacos", options: [TORTILLA, TACO_ADDONS] },
  { id: "birria-taco", name: "Birria Taco", description: "Braised beef, melted cheese and a cup of consomé.", price: 4.25, category: "tacos", badge: "Spicy", options: [TORTILLA, TACO_ADDONS] },

  { id: "carne-asada-plate", name: "Carne Asada Plate", description: "Grilled steak, guacamole, pico, tortillas, rice and beans.", price: 16.99, category: "plates", photo: hero, options: [TORTILLA] },
  { id: "enchiladas", name: "Enchiladas Rojas", description: "Three cheese enchiladas in red chile sauce, topped with crema.", price: 13.49, category: "plates", badge: "Spicy" },
  { id: "chile-relleno", name: "Chile Relleno Plate", description: "Roasted poblano filled with cheese, lightly battered.", price: 13.99, category: "plates" },

  { id: "camarones-diabla", name: "Camarones a la Diabla", description: "Shrimp in a spicy red diabla sauce with rice and salad.", price: 17.49, category: "mariscos", badge: "Spicy" },
  { id: "coctel", name: "Cóctel de Camarón", description: "Chilled shrimp cocktail with avocado, cucumber and lime.", price: 14.99, category: "mariscos" },
  { id: "fish-tacos", name: "Fish Tacos (2)", description: "Battered fish, cabbage, chipotle crema and pico.", price: 9.99, category: "mariscos", options: [TORTILLA] },

  { id: "horchata", name: "Horchata", description: "Sweet rice and cinnamon, made in house.", price: 3.99, category: "drinks", options: [SIZE] },
  { id: "jamaica", name: "Jamaica", description: "Hibiscus, lightly sweet and tart.", price: 3.99, category: "drinks", options: [SIZE] },
  { id: "pina", name: "Piña", description: "Fresh pineapple agua fresca.", price: 3.99, category: "drinks", options: [SIZE] },
];

export const FAVORITES = ["ceviche-tostada", "chips-guac", "super-nachos", "loco-fries", "quesadilla", "nuggets"];
export const getItem = (id: string) => ITEMS.find((i) => i.id === id);
export const HERO = hero;

export const TAX_RATE = 0.0775;
export const money = (n: number) => `$${n.toFixed(2)}`;
