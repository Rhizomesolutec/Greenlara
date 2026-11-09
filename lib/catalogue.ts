import type { Category, Product, StoreData, WeightOption } from "./types";
import { slugify } from "./site";

const photo = {
  rice: "/images/rice-unsplash.jpg",
  riceBowl: "/images/rice-1.jpg",
  brown: "/images/rice-3.jpg",
  red: "/images/red-rice.jpg",
  black: "/images/black-rice.jpg",
  wheat: "/images/wheat-unsplash.jpg",
  barley: "/images/barley.jpg",
  oats: "/images/oats-rolled.jpg",
  millet: "/images/millet-foxtail.jpg",
  lentils: "/images/lentils-1.jpg",
  mix: "/images/pulses.jpg",
  chana: "/images/chana.jpg",
  mung: "/images/mung.jpg",
  rajma: "/images/rajma.jpg",
  sesame: "/images/sesame.jpg",
  flax: "/images/flax.jpg",
  chia: "/images/chia.jpg",
  sunflower: "/images/sunflower.jpg",
  pumpkin: "/images/pumpkin.jpg",
  fenugreek: "/images/fenugreek.jpg",
  poppy: "/images/poppy.jpg",
  corn: "/images/corn-kernels.jpg",
  cornFresh: "/images/corn-unsplash.jpg",
  flour: "/images/flour.jpg",
  field: "/images/field.jpg",
};

export const categoryImage = photo;

const packs = {
  bulk: [
    ["500g", 500],
    ["1kg", 1000],
    ["5kg", 5000],
    ["10kg", 10000],
    ["25kg", 25000],
    ["50kg", 50000],
  ],
  pantry: [
    ["500g", 500],
    ["1kg", 1000],
    ["5kg", 5000],
    ["10kg", 10000],
    ["25kg", 25000],
  ],
  seed: [
    ["250g", 250],
    ["500g", 500],
    ["1kg", 1000],
    ["5kg", 5000],
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
  { name: "Basmati Rice", categoryId: "rice", summary: "Long-grain rice for pulao, biryani, and meals where separate grains matter.", perKg: 186, images: [photo.rice, photo.riceBowl], form: "Whole grain", bestseller: true, featured: true, discount: true },
  { name: "Sona Masoori", categoryId: "rice", summary: "A light everyday rice used for regular meals.", perKg: 92, images: [photo.riceBowl, photo.rice], form: "Whole grain", bestseller: true },
  { name: "Ponni Rice", categoryId: "rice", summary: "A south Indian table rice for steaming and simple lunches.", perKg: 84, images: [photo.rice, photo.riceBowl], form: "Whole grain" },
  { name: "Matta Rice", categoryId: "rice", summary: "A plump Kerala rice with a rosy bran and a fuller bite.", perKg: 112, images: [photo.red, photo.brown], form: "Whole grain" },
  { name: "Brown Rice", categoryId: "rice", summary: "Rice with the bran left on, for a nuttier bowl.", perKg: 128, images: [photo.brown, photo.red], form: "Whole grain", featured: true },
  { name: "Red Rice", categoryId: "rice", summary: "Whole rice with a red bran layer.", perKg: 136, images: [photo.red, photo.brown], form: "Whole grain" },
  { name: "White Rice", categoryId: "rice", summary: "Polished rice for everyday cooking.", perKg: 72, images: [photo.riceBowl, photo.rice], form: "Whole grain" },
  { name: "Black Rice", categoryId: "rice", summary: "A dark whole rice kept for special meals. Colour varies by lot.", perKg: 240, images: [photo.black], form: "Whole grain", newArrival: true },
  { name: "Idli Rice", categoryId: "rice", summary: "Short-grain rice traditionally soaked and ground for idli and dosa batter.", perKg: 88, images: [photo.rice, photo.riceBowl], form: "Whole grain", bestseller: true },
  { name: "Raw Rice", categoryId: "rice", summary: "Unboiled rice for kitchens that prefer it to parboiled grain.", perKg: 76, images: [photo.riceBowl, photo.rice], form: "Whole grain" },
  { name: "Steam Rice", categoryId: "rice", summary: "Parboiled rice that tends to cook into separate grains.", perKg: 80, images: [photo.rice, photo.brown], form: "Whole grain" },
  { name: "Jeera Rice", categoryId: "rice", summary: "A slender aromatic rice often cooked with cumin.", perKg: 168, images: [photo.rice, photo.riceBowl], form: "Whole grain" },

  { name: "Whole Wheat", categoryId: "wheat", summary: "Wheat berries for home grinding, porridge, or milling.", perKg: 54, images: [photo.wheat], form: "Whole grain", bestseller: true, featured: true },
  { name: "Wheat Grain", categoryId: "wheat", summary: "Cleaned wheat grain for household stores and bulk kitchens.", perKg: 50, images: [photo.wheat], form: "Whole grain" },
  { name: "Barley", categoryId: "wheat", summary: "Whole barley for soups, khichdi-style meals, and cooling drinks.", perKg: 78, images: [photo.barley], form: "Whole grain" },
  { name: "Oats", categoryId: "wheat", summary: "Rolled oats for porridge and baking. Edit this listing if you stock a different cut.", perKg: 146, images: [photo.oats], form: "Rolled grain", featured: true, newArrival: true },
  { name: "Rye", categoryId: "wheat", summary: "A darker cereal grain for bread blends and hearty cooking.", perKg: 96, images: [photo.wheat], form: "Whole grain" },
  { name: "Sorghum", categoryId: "wheat", summary: "Whole sorghum, or jowar, for flour, porridge, and traditional meals.", perKg: 62, images: [photo.millet], form: "Whole grain" },
  { name: "Broken Wheat", categoryId: "wheat", summary: "Cracked wheat for upma, porridge, and quick breakfasts.", perKg: 58, images: [photo.wheat], form: "Broken grain", bestseller: true },
  { name: "Semolina", categoryId: "wheat", summary: "Coarse wheat semolina for upma, halwa, and batters.", perKg: 66, images: [photo.flour, photo.wheat], form: "Granular", pack: "pantry" },

  { name: "Maize", categoryId: "corn", summary: "Dried maize grain for milling and bulk cooking.", perKg: 46, images: [photo.corn], form: "Whole grain" },
  { name: "Corn", categoryId: "corn", summary: "Dried corn kernels kept with the other everyday grains.", perKg: 48, images: [photo.corn, photo.cornFresh], form: "Whole grain" },

  { name: "Ragi", categoryId: "millets", summary: "Finger millet, widely sold as ragi, for porridge, mudde, and flour.", perKg: 96, images: [photo.millet], form: "Whole grain", bestseller: true, featured: true },
  { name: "Pearl Millet (Bajra)", categoryId: "millets", summary: "Whole bajra for rotis, khichdi, and winter porridge.", perKg: 68, images: [photo.millet], form: "Whole grain", bestseller: true },
  { name: "Foxtail Millet", categoryId: "millets", summary: "A small yellow millet used for rice-style meals and upma.", perKg: 118, images: [photo.millet], form: "Whole grain" },
  { name: "Little Millet", categoryId: "millets", summary: "A fine millet suited to light pulao and porridge.", perKg: 124, images: [photo.millet], form: "Whole grain" },
  { name: "Kodo Millet", categoryId: "millets", summary: "A traditional millet with a firm bite when cooked.", perKg: 116, images: [photo.millet], form: "Whole grain" },
  { name: "Barnyard Millet", categoryId: "millets", summary: "A quick-cooking millet often used for fasting meals and everyday pots.", perKg: 128, images: [photo.millet], form: "Whole grain" },
  { name: "Proso Millet", categoryId: "millets", summary: "A mild millet that can stand in for rice in simple preparations.", perKg: 120, images: [photo.millet], form: "Whole grain" },
  { name: "Browntop Millet", categoryId: "millets", summary: "A less common millet for customers looking beyond the usual staples.", perKg: 142, images: [photo.millet], form: "Whole grain", newArrival: true },
  { name: "Finger Millet", categoryId: "millets", summary: "Finger millet is widely sold as ragi. Keep this listing only if you pack it separately.", perKg: 98, images: [photo.millet], form: "Whole grain" },

  { name: "Toor Dal", categoryId: "pulses", summary: "Split pigeon peas for sambar and everyday dal.", perKg: 140, images: [photo.chana, photo.mix], form: "Split", bestseller: true, featured: true, discount: true },
  { name: "Moong Dal", categoryId: "pulses", summary: "Split mung. Describe whether your pack is washed or with the skin on.", perKg: 132, images: [photo.mung, photo.mix], form: "Split", bestseller: true },
  { name: "Urad Dal", categoryId: "pulses", summary: "Split black gram for dal, idli batter, and vadas.", perKg: 138, images: [photo.lentils, photo.mix], form: "Split" },
  { name: "Chana Dal", categoryId: "pulses", summary: "Split desi chickpeas with a sweet, nutty note when simmered or roasted.", perKg: 108, images: [photo.chana], form: "Split", bestseller: true },
  { name: "Masoor Dal", categoryId: "pulses", summary: "Split red lentils that cook down quickly.", perKg: 114, images: [photo.lentils, photo.mix], form: "Split" },
  { name: "Red Lentils", categoryId: "pulses", summary: "Red lentils for soups and quick dals. State whole or split in this description.", perKg: 120, images: [photo.lentils], form: "Lentil" },
  { name: "Green Gram", categoryId: "pulses", summary: "Whole mung beans for sprouts, dal, and sundal.", perKg: 126, images: [photo.mung], form: "Whole", bestseller: true },
  { name: "Black Gram", categoryId: "pulses", summary: "Whole urad with the skin on, for soaking and batter.", perKg: 130, images: [photo.mix, photo.lentils], form: "Whole" },
  { name: "Yellow Peas", categoryId: "pulses", summary: "Dried yellow peas for soups, stews, and bulk kitchens.", perKg: 84, images: [photo.mix, photo.chana], form: "Whole" },
  { name: "Split Peas", categoryId: "pulses", summary: "Dried peas sold split, for faster cooking.", perKg: 88, images: [photo.chana, photo.mix], form: "Split" },

  { name: "Chickpeas", categoryId: "beans", summary: "Whole chickpeas for curries, salads, and roasting.", perKg: 102, images: [photo.mix, photo.chana], form: "Whole", bestseller: true, featured: true },
  { name: "Kabuli Chana", categoryId: "beans", summary: "Larger, pale chickpeas often used for chole.", perKg: 118, images: [photo.mix], form: "Whole", bestseller: true },
  { name: "Black Chickpeas", categoryId: "beans", summary: "Small dark chickpeas with a firmer bite.", perKg: 110, images: [photo.mix, photo.rajma], form: "Whole" },
  { name: "Kidney Beans (Rajma)", categoryId: "beans", summary: "Red kidney beans for rajma and other slow-cooked dishes.", perKg: 150, images: [photo.rajma], form: "Whole", bestseller: true, discount: true },
  { name: "Black-Eyed Peas", categoryId: "beans", summary: "Cream peas with a dark eye, for stews and dry curries.", perKg: 96, images: [photo.mix], form: "Whole" },
  { name: "Cowpeas", categoryId: "beans", summary: "Cowpeas, or lobia, for sundal and dry curries.", perKg: 94, images: [photo.mix, photo.mung], form: "Whole" },
  { name: "Soybeans", categoryId: "beans", summary: "Whole soybeans for boiling, milling, or bulk supply.", perKg: 90, images: [photo.mix], form: "Whole" },
  { name: "Green Peas", categoryId: "beans", summary: "Dried green peas. This listing is not for fresh produce.", perKg: 100, images: [photo.mix, photo.mung], form: "Dried" },
  { name: "White Beans", categoryId: "beans", summary: "Pale beans for soups and casseroles.", perKg: 108, images: [photo.mix], form: "Whole" },
  { name: "Horse Gram", categoryId: "beans", summary: "A dense, small legume used in south Indian rasam and pitla. Sample stock is set to zero.", perKg: 86, images: [photo.mix, photo.lentils], form: "Whole", stock: 0 },

  { name: "Sesame Seeds", categoryId: "seeds", summary: "Sesame seeds for tempering, sweets, and grinding. Note hulled or natural in the description.", perKg: 180, images: [photo.sesame], form: "Seed", pack: "seed", bestseller: true },
  { name: "Flax Seeds", categoryId: "seeds", summary: "Flax seeds for roasting, baking, and grinding.", perKg: 220, images: [photo.flax], form: "Seed", pack: "seed", featured: true },
  { name: "Chia Seeds", categoryId: "seeds", summary: "Tiny chia seeds that swell when soaked.", perKg: 420, images: [photo.chia], form: "Seed", pack: "seed", newArrival: true },
  { name: "Pumpkin Seeds", categoryId: "seeds", summary: "Green pumpkin seeds, often eaten roasted.", perKg: 360, images: [photo.pumpkin], form: "Seed", pack: "seed" },
  { name: "Sunflower Seeds", categoryId: "seeds", summary: "Sunflower kernels for snacking and baking.", perKg: 200, images: [photo.sunflower], form: "Seed", pack: "seed" },
  { name: "Mustard Seeds", categoryId: "seeds", summary: "Small seeds for tempering. Replace the sample photo with the colour you actually stock.", perKg: 90, images: [photo.fenugreek], form: "Seed", pack: "seed" },
  { name: "Fenugreek Seeds", categoryId: "seeds", summary: "Bitter fenugreek seeds for pickles, tempering, and sprouts.", perKg: 110, images: [photo.fenugreek], form: "Seed", pack: "seed" },
  { name: "Poppy Seeds", categoryId: "seeds", summary: "Tiny poppy seeds used as a thickener and garnish. Sample stock is intentionally low.", perKg: 480, images: [photo.poppy], form: "Seed", pack: "seed", stock: 10 },

  { name: "Organic Range Basmati", categoryId: "organic", summary: "A sample listing for an organic basmati range. Add certification only when you have it. This demo claims none.", perKg: 240, images: [photo.rice, photo.brown], form: "Whole grain", featured: true },
  { name: "Organic Range Whole Wheat", categoryId: "organic", summary: "A sample listing for an organic wheat range. Certification details are left for you to add.", perKg: 80, images: [photo.wheat], form: "Whole grain" },
  { name: "Organic Range Toor Dal", categoryId: "organic", summary: "A sample listing for an organic toor range. Do not publish a certification you have not added.", perKg: 180, images: [photo.chana, photo.mix], form: "Split" },
  { name: "Organic Range Ragi", categoryId: "organic", summary: "A sample listing for an organic finger-millet range.", perKg: 140, images: [photo.millet], form: "Whole grain" },
  { name: "Organic Range Millet Mix", categoryId: "organic", summary: "A sample mix of millets. List the grains in the blend before sale.", perKg: 160, images: [photo.millet, photo.mix], form: "Mix", pack: "pantry" },

  { name: "Traditional Grain Mix", categoryId: "specialty", summary: "A blend of everyday grains. Edit the mix contents before sale.", perKg: 150, images: [photo.mix, photo.millet], form: "Mix", pack: "pantry" },
  { name: "Whole Grain Mix", categoryId: "specialty", summary: "A sample mix of whole grains for porridge and milling.", perKg: 155, images: [photo.wheat, photo.millet], form: "Mix", pack: "pantry" },
  { name: "Broken Grain Mix", categoryId: "specialty", summary: "Broken grains for porridge and economical cooking. Describe the blend.", perKg: 70, images: [photo.wheat, photo.rice], form: "Broken", pack: "pantry" },
  { name: "Navara Rice", categoryId: "specialty", summary: "A traditional Kerala rice name. Confirm the variety you stock before publishing.", perKg: 320, images: [photo.red, photo.brown], form: "Whole grain", featured: true, newArrival: true },
  { name: "Specialty Rice Assortment", categoryId: "specialty", summary: "A place for limited rice varieties you want beside the main rice list.", perKg: 210, images: [photo.black, photo.red], form: "Whole grain" },

  { name: "Whole Wheat Flour", categoryId: "flour", summary: "Atta-style whole wheat flour. Add extraction and freshness notes when you know them.", perKg: 62, images: [photo.flour], form: "Flour", pack: "pantry", bestseller: true },
  { name: "Rice Flour", categoryId: "flour", summary: "Fine rice flour for batters, sweets, and gluten-free cooking.", perKg: 74, images: [photo.flour, photo.rice], form: "Flour", pack: "pantry" },
  { name: "Ragi Flour", categoryId: "flour", summary: "Finger-millet flour for porridge, dosa, and baking.", perKg: 110, images: [photo.flour, photo.millet], form: "Flour", pack: "pantry", bestseller: true },
  { name: "Gram Flour", categoryId: "flour", summary: "Besan milled from chana dal, for pakoras and batters.", perKg: 96, images: [photo.flour, photo.chana], form: "Flour", pack: "pantry" },
  { name: "Millet Flour", categoryId: "flour", summary: "A millet flour listing. Name the millet when you know the mill run.", perKg: 120, images: [photo.flour, photo.millet], form: "Flour", pack: "pantry" },
  { name: "Multigrain Flour", categoryId: "flour", summary: "A sample blended flour. List the grains in the blend before sale.", perKg: 130, images: [photo.flour, photo.wheat], form: "Flour", pack: "pantry", featured: true },
];

export const categories: Category[] = [
  { id: "rice", slug: "rice", name: "Rice", description: "Basmati, table rice, and whole rice varieties.", image: photo.rice },
  { id: "wheat", slug: "wheat-cereals", name: "Wheat & Cereals", description: "Wheat, barley, oats, and other cereals.", image: photo.wheat },
  { id: "millets", slug: "millets", name: "Millets", description: "Ragi, bajra, and the smaller millets.", image: photo.millet },
  { id: "pulses", slug: "pulses-lentils", name: "Pulses & Lentils", description: "Dals and lentils for the everyday pot.", image: photo.chana },
  { id: "beans", slug: "beans-legumes", name: "Beans & Legumes", description: "Chickpeas, rajma, and other beans.", image: photo.rajma },
  { id: "seeds", slug: "seeds", name: "Seeds", description: "Sesame, flax, chia, and spice seeds.", image: photo.flax },
  { id: "corn", slug: "corn-maize", name: "Corn & Maize", description: "Dried maize and corn grain.", image: photo.cornFresh },
  { id: "organic", slug: "organic-grains", name: "Organic Grains", description: "A section for ranges you choose to document.", image: photo.brown },
  { id: "flour", slug: "flour-grain-products", name: "Flour & Grain Products", description: "Flours milled from grains and dals.", image: photo.flour },
  { id: "specialty", slug: "specialty-grains", name: "Specialty Grains", description: "Mixes and less common rice varieties.", image: photo.red },
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
      "Packed for the selected weight. Update the exact pack format, bag type, and shelf life for each product.",
    storage: "Store in a cool, dry place in a sealed container, away from moisture and direct sunlight.",
    specs: [
      { label: "Form", value: row.form },
      { label: "Catalogue", value: "Sample listing" },
    ],
    createdAt: new Date(Date.UTC(2026, row.newArrival ? 2 : 0, (index % 27) + 1, 8, 0, 0)).toISOString(),
  };
});

export function createSeedStore(): StoreData {
  return {
    version: 1,
    categories,
    products,
    orders: [],
    enquiries: [],
    subscribers: [],
  };
}
