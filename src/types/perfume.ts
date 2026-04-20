export interface Perfume {
  id: number;
  brand: string;
  name: string;
  price: number;
  discountPrice?: number;
  imageUrl: string;
  description: string;
  ml: number;
  gender: 'MEN' | 'WOMEN' | 'UNISEX';
  isNew: boolean;
  isRecommended?: boolean;
}

export interface BrandGroup {
  name: string;
  count: number;
  mainImage: string;
  products: string[];
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  last: boolean;
}

// Səbətdəki məhsulun tipi
export interface CartItem {
  cartItemId: number;
  perfumeId: number;
  perfumeName: string;
  brand?: string;
  price: number;
  quantity: number;
  subTotal: number;
  imageUrl?: string; 
}

// Səbət API-nın ümumi cavabı
export interface CartResponse {
  items: CartItem[];
  totalAmount: number;
}

// Mutasiya üçün dəyişən tipi
export interface AddToCartArgs {
  perfumeId: number;
  quantity: number;
  perfume?: Perfume; // Optimistic update üçün bütün obyekt
  isNew?: boolean;   // Tosterin çıxıb-çıxmayacağını təyin edən bayraq
}

// Cart Optimistic Context
export interface CartMutationContext {
  previousCart: CartResponse | undefined;
}

// Wishlist Optimistic Context
export interface WishlistMutationContext {
  previousWishlist: Perfume[] | undefined;
  previousCount: number | undefined;
}

export interface ApiError {
  message: string;
}


export interface OrderItem {
  id: number;
  perfumeName: string;
  priceAtPurchase: number;
  quantity: number;
}

export interface OrderResponse {
  id: number;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  address: string;
  phoneNumber: string;
  orderNote: string;
  status: 'PENDING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  orderDate: string;
  preferredDeliveryTime: string;
  items: OrderItem[];
}


export type OrderStatus = "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export interface OrderItem {
  id: number;
  perfumeName: string;
  imageUrl: string;
  brand:string;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  orderDate: string;
  totalAmount: number;
  status: OrderStatus;
  items: OrderItem[];
  orderNote?: string;
  address:string;
  // YENİ SAHƏLƏR:
  courierName?: string;
  courierPhone?: string;
  estimatedDeliveryTime?: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  // digər lazım olan profil sahələri
}

export interface AddProductFormInput {
  name: string;
  brand: string;
  price: number;
  ml: number;
  gender: "MEN" | "WOMEN" | "UNISEX";
  description: string;
  discountPrice?: number;
  isNew?: boolean;
   isRecommended?: boolean;
}

export interface ShipOrderArgs {
  id: number;
  courierName: string;
  courierPhone: string;
  estimatedTime: string;
}


export interface User {
  id: number;
  fullName: string;
  email: string;
  role: "ADMIN" | "USER";
}

// Backend-dən gələn səhifələmə strukturu
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  last: boolean;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
}