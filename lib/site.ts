export const brand = {
  name: "Green Lara",
  announcement: "Naturally Selected. Quality Delivered.",
  email: "hello@greenlara.example",
  phone: "+91 00000 00000",
  address: "Address to be confirmed",
  hours: "Hours to be confirmed",
  pricingNote:
    "Prices in this catalogue are sample figures for demonstration. They are not Green Lara selling prices.",
  deliveryNote:
    "Delivery charges are a sample estimate until your own rates are added.",
};

export const delivery = {
  fee: 89,
  freeOver: 1499,
};

export const nav = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About Us" },
  { href: "/quality", label: "Our Quality" },
  { href: "/contact", label: "Contact" },
];

export const socials = [
  { name: "Instagram", href: "https://instagram.com" },
  { name: "Facebook", href: "https://facebook.com" },
  { name: "YouTube", href: "https://youtube.com" },
];

export const states = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

export function deliveryCharge(subtotal: number) {
  if (subtotal <= 0) return 0;
  if (subtotal >= delivery.freeOver) return 0;
  return delivery.fee;
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
