import type { Category, Product, StoreData, WeightOption } from "./types";
import { slugify } from "./site";

export const CATALOGUE_VERSION = 4;

const photo = {
  // Editorial / Category hero photo
  wholeSpices: "/images/whole-spices.jpg",

  // Whole Spices (8 unique product images)
  blackPepper: "/images/black-pepper.jpg",
  cardamom: "/images/cardamom.jpg",
  cinnamonCloves: "/images/cinnamon-cloves.jpg",
  cloves: "/images/cloves.jpg",
  cumin: "/images/cumin.jpg",
  corianderSeeds: "/images/coriander-seeds.jpg",
  fenugreek: "/images/fenugreek.jpg",
  poppy: "/images/poppy.jpg",

  // Ground Spices (4 unique product images)
  turmeric: "/images/turmeric.jpg",
  redChilli: "/images/red-chilli.jpg",
  garamMasala: "/images/garam-masala.jpg",
  corianderPowder: "/images/coriander-powder.jpg",

  // Pulses & Lentils (4 unique product images)
  toorDal: "/images/toor-dal.jpg",
  chana: "/images/chana.jpg",
  lentils: "/images/lentils-1.jpg",
  mung: "/images/mung.jpg",

  // Beans & Legumes (3 unique product images)
  kabuliChana: "/images/kabuli-chana.jpg",
  rajma: "/images/rajma.jpg",
  mix: "/images/pulses.jpg",
};

export const categoryImage = photo;

const packs = {
  spice: [
    ["100g", 100],
    ["250g", 250],
    ["500g", 500],
    ["1kg", 1000],
  ],
  spiceBulk: [
    ["100g", 100],
    ["250g", 250],
    ["500g", 500],
    ["1kg", 1000],
    ["5kg", 5000],
  ],
  bulk: [
    ["500g", 500],
    ["1kg", 1000],
    ["5kg", 5000],
    ["10kg", 10000],
    ["25kg", 25000],
    ["50kg", 50000],
  ],
} as const;

function makeWeights(
  perKg: number,
  pack: keyof typeof packs,
  stock: number,
  discount: boolean,
): WeightOption[] {
  return packs[pack].map(([label, grams], index) => {
    const kilos = grams / 1000;
    const factor = kilos >= 25 ? 0.84 : kilos >= 10 ? 0.9 : kilos >= 5 ? 0.95 : 1;
    const price = Math.max(1, Math.round(perKg * kilos * factor));
    return {
      label,
      grams,
      price,
      compareAtPrice: discount && grams <= 1000 ? Math.round(price * 1.12) : undefined,
      stock: stock === 0 ? 0 : Math.max(0, stock - index * 4),
    };
  });
}

type Row = {
  name: string;
  categoryId: string;
  summary: string;
  perKg: number;
  images: string[];
  form: string;
  pack?: keyof typeof packs;
  stock?: number;
  bestseller?: boolean;
  featured?: boolean;
  newArrival?: boolean;
  discount?: boolean;
};

const rows: Row[] = [
  // Whole Spices (8 — each with its own unique image)
  { name: "Tellicherry Black Pepper", categoryId: "whole-spices", summary: "Bold, aromatic whole black peppercorns with warm heat and citrusy depth.", perKg: 880, images: [photo.blackPepper], form: "Whole spice", pack: "spiceBulk", bestseller: true, featured: true, discount: true },
  { name: "Green Cardamom (Elaichi)", categoryId: "whole-spices", summary: "Fragrant whole green cardamom pods for chai, biryanis, curries, and sweets.", perKg: 2600, images: [photo.cardamom], form: "Whole pod", pack: "spice", bestseller: true, featured: true },
  { name: "Ceylon Cinnamon Sticks", categoryId: "whole-spices", summary: "Delicate, sweet-scented rolled cinnamon quills for infusions and slow-simmered dishes.", perKg: 1120, images: [photo.cinnamonCloves], form: "Whole quill", pack: "spice", featured: true },
  { name: "Whole Cloves", categoryId: "whole-spices", summary: "Hand-selected dark cloves rich in essential oils for tempering and spice blends.", perKg: 1240, images: [photo.cloves], form: "Whole bud", pack: "spice", newArrival: true },
  { name: "Cumin Seeds (Jeera)", categoryId: "whole-spices", summary: "Earthy, warm cumin seeds for everyday tadka, rice dishes, and roasted masalas.", perKg: 460, images: [photo.cumin], form: "Whole seed", pack: "spiceBulk", bestseller: true },
  { name: "Coriander Seeds (Dhania)", categoryId: "whole-spices", summary: "Crisp, lightly citrusy coriander seeds for dry-roasting, pickles, and curries.", perKg: 260, images: [photo.corianderSeeds], form: "Whole seed", pack: "spiceBulk" },
  { name: "Fenugreek Seeds (Methi)", categoryId: "whole-spices", summary: "Golden fenugreek seeds with toasted bitterness for pickles, sambar, and tadka.", perKg: 180, images: [photo.fenugreek], form: "Whole seed", pack: "spiceBulk" },
  { name: "Poppy Seeds (Khus Khus)", categoryId: "whole-spices", summary: "Fine creamy poppy seeds used as a nutty thickener for kormas and traditional sweets.", perKg: 1450, images: [photo.poppy], form: "Whole seed", pack: "spice", stock: 12 },

  // Ground Spices (4 — each with its own unique image)
  { name: "Turmeric Powder (Haldi)", categoryId: "ground-spices", summary: "Deep golden ground turmeric with warm earthy aroma for daily cooking and infusions.", perKg: 340, images: [photo.turmeric], form: "Ground spice", pack: "spiceBulk", bestseller: true, featured: true, discount: true },
  { name: "Kashmiri Red Chilli Powder", categoryId: "ground-spices", summary: "Naturally vibrant red chilli powder with gentle heat and rich colour for gravies.", perKg: 620, images: [photo.redChilli], form: "Ground spice", pack: "spiceBulk", bestseller: true, featured: true },
  { name: "Garam Masala", categoryId: "ground-spices", summary: "Small-batch aromatic blend of roasted whole spices for finishing curries and dals.", perKg: 760, images: [photo.garamMasala], form: "Spice blend", pack: "spice", bestseller: true, newArrival: true },
  { name: "Coriander Powder (Dhania)", categoryId: "ground-spices", summary: "Freshly milled coriander seed powder that builds body and gentle sweetness in curries.", perKg: 300, images: [photo.corianderPowder], form: "Ground spice", pack: "spiceBulk" },

  // Pulses & Lentils (4 — each with its own unique image)
  { name: "Toor Dal", categoryId: "pulses", summary: "Split pigeon peas for sambar and everyday comforting dal.", perKg: 140, images: [photo.toorDal], form: "Split pulse", bestseller: true, featured: true, discount: true },
  { name: "Chana Dal", categoryId: "pulses", summary: "Split desi chickpeas with a sweet, nutty note when simmered or roasted.", perKg: 108, images: [photo.chana], form: "Split pulse", bestseller: true },
  { name: "Masoor Dal (Red Lentils)", categoryId: "pulses", summary: "Split red lentils that simmer down smoothly in minutes for soups and dals.", perKg: 114, images: [photo.lentils], form: "Split lentil", featured: true },
  { name: "Green Gram (Whole Moong)", categoryId: "pulses", summary: "Whole green mung beans for sprouting, curries, and sundal.", perKg: 126, images: [photo.mung], form: "Whole pulse", bestseller: true },

  // Beans & Legumes (3 — each with its own unique image)
  { name: "Kabuli Chana (Chickpeas)", categoryId: "beans", summary: "Plump, pale chickpeas prized for classic chole, curries, and hummus.", perKg: 118, images: [photo.kabuliChana], form: "Whole legume", bestseller: true, featured: true },
  { name: "Kidney Beans (Rajma)", categoryId: "beans", summary: "Deep red kidney beans that turn velvety in slow-simmered rajma.", perKg: 150, images: [photo.rajma], form: "Whole bean", bestseller: true, discount: true },
  { name: "Mixed Pulses & Beans", categoryId: "beans", summary: "A hearty assortment of whole beans, peas, and legumes for stews and protein-rich curries.", perKg: 124, images: [photo.mix], form: "Whole blend", newArrival: true },
];

export const categories: Category[] = [
  { id: "whole-spices", slug: "whole-spices", name: "Whole Spices", description: "Cardamom, pepper, cloves, cinnamon, cumin, and aromatic seeds.", image: photo.wholeSpices },
  { id: "ground-spices", slug: "ground-spices", name: "Ground Spices", description: "Turmeric, Kashmiri chilli, garam masala, and freshly milled powders.", image: photo.turmeric },
  { id: "pulses", slug: "pulses-lentils", name: "Pulses & Lentils", description: "Toor, chana, masoor, and whole green gram for the everyday pot.", image: photo.toorDal },
  { id: "beans", slug: "beans-legumes", name: "Beans & Legumes", description: "Kabuli chana, rajma, and hearty mixed beans and legumes.", image: photo.rajma },
];

export const products: Product[] = rows.map((row, index) => {
  const slug = slugify(row.name);
  return {
    id: slug,
    slug,
    name: row.name,
    categoryId: row.categoryId,
    summary: row.summary,
    description: `${row.summary} This is a sample catalogue listing. Package sizes, prices, and stock are demonstration values, not Green Lara retail prices. Replace the photograph with your own pack shot when you have one.`,
    images: row.images,
    weights: makeWeights(row.perKg, row.pack ?? "bulk", row.stock ?? 48, Boolean(row.discount)),
    featured: Boolean(row.featured),
    bestseller: Boolean(row.bestseller),
    newArrival: Boolean(row.newArrival),
    origin: "",
    packaging:
      "Packed in airtight food-grade pouches to preserve natural aroma and freshness. Update exact pack format and shelf life for each product.",
    storage: "Store in a cool, dry place in an airtight container, away from moisture and direct sunlight.",
    specs: [
      { label: "Form", value: row.form },
      { label: "Catalogue", value: "Sample listing" },
    ],
    createdAt: new Date(Date.UTC(2026, row.newArrival ? 2 : 0, (index % 27) + 1, 8, 0, 0)).toISOString(),
  };
});

export function createSeedStore(): StoreData {
  return {
    version: CATALOGUE_VERSION,
    categories,
    products,
    orders: [],
    enquiries: [],
    subscribers: [],
  };
}
