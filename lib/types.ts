export type WeightOption = {
  label: string;
  grams: number;
  price: number;
  compareAtPrice?: number;
  stock: number;
};

export type Spec = {
  label: string;
  value: string;
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  summary: string;
  description: string;
  images: string[];
  weights: WeightOption[];
  featured: boolean;
  bestseller: boolean;
  newArrival: boolean;
  origin: string;
  packaging: string;
  storage: string;
  specs: Spec[];
  createdAt: string;
};

export type OrderItem = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  weightLabel: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
};

export type PaymentMethod = "cod" | "upi" | "card" | "netbanking";

export type PaymentStatus =
  | "pay_on_delivery"
  | "awaiting_gateway"
  | "paid"
  | "failed"
  | "cancelled";

export type OrderStatus =
  | "placed"
  | "confirmed"
  | "packed"
  | "shipped"
  | "delivered"
  | "cancelled";

export type CustomerDetails = {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pin: string;
};

export type Order = {
  id: string;
  createdAt: string;
  customer: CustomerDetails;
  items: OrderItem[];
  subtotal: number;
  delivery: number;
  total: number;
  deliveryNote: string;
  pricingNote: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  paymentMessage: string;
  stockAdjusted: boolean;
};

export type Enquiry = {
  id: string;
  type: "wholesale" | "contact";
  createdAt: string;
  name: string;
  business: string;
  phone: string;
  email: string;
  product: string;
  quantity: string;
  message: string;
  status: "new" | "in_review" | "closed";
};

export type StoreData = {
  version: number;
  categories: Category[];
  products: Product[];
  orders: Order[];
  enquiries: Enquiry[];
  subscribers: string[];
};

export type CartLine = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  weightLabel: string;
  qty: number;
  weights: { label: string; grams: number }[];
};

export type WishlistLine = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  categoryName: string;
};
