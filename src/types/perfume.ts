// --- 1. PERFUME & VARIANTS ---
export interface PerfumeVariant {
  id: number;
  ml: number;
  price: number;
  discountPrice: number | null;
  stock: number;
  lowStock?: boolean;
  stockMessage?: string;
}

export interface Perfume {
  id: number;
  brand: string;
  name: string;
  description: string;
  imageUrl: string;
  gender: "MEN" | "WOMEN" | "UNISEX";
  isNew: boolean;
  isRecommended: boolean;
  // Backend convertToDto-dan gələn ana qiymətlər
  price: number;           // Ən ucuz variantın orijinal qiyməti
  discountPrice: number | null; // Ən ucuz variantın endirimli qiyməti
  minPrice: number;        // Son görünən qiymət
  defaultMl: number;       // Avtomatik seçilən ölçü
  variants: PerfumeVariant[];
}

// --- 2. WISHLIST ---
export interface WishlistItemDTO {
  id?: number; // Wishlist rekordunun ID-si
  perfumeId: number;
  variantId: number;
  perfumeName: string;
  brand: string;
  imageUrl: string;
  ml: number;
  price: number;
  discountPrice: number | null;
  name?:string;
}

export interface WishlistMutationContext {
  previousWishlist: WishlistItemDTO[] | undefined;
  previousCount: number | undefined;
}

// --- 3. CART (SƏBƏT) ---
export interface CartItem {
  cartItemId: number;
  perfumeId: number;
  variantId: number;
  perfumeName: string;
  brand: string;
  ml: number;
  price: number;
  discountPrice: number | null;
  quantity: number;
  subTotal: number;
  imageUrl: string;
  
}

export interface CartResponse {
  items: CartItem[];
  totalAmount: number;
}

export interface AddToCartArgs {
  variantId: number;
  quantity: number;
  perfumeId?: number;
   perfume?: Perfume | WishlistItemDTO;
  variant?: PerfumeVariant;
  isNew?: boolean;
}

export interface CartMutationContext {
  previousCart: CartResponse | undefined;
}

// --- 4. ORDER (SİFARİŞ) SİSTEMİ ---
export type OrderStatus = "AWAITING_PAYMENT" | "PAID" | "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export interface OrderItem {
  id: number;
  perfumeId: number;
  perfumeName: string;
  brand: string;
  imageUrl: string;
  price: number; // Alış anındakı qiymət
  quantity: number;
  subTotal: number;
}

export interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  address: string;
  phoneNumber: string;
  orderNote?: string;
  status: OrderStatus;
  orderDate: string;
  preferredDeliveryTime?: string;
  estimatedDeliveryTime?: string;
  courierName?: string;
  courierPhone?: string;
  items: OrderItem[];
}

export interface OrderFilterParams {
  customerName?: string;
  minPrice?: number;
  maxPrice?: number;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
}

export interface ShipOrderArgs {
  id: number;
  courierName: string;
  courierPhone: string;
  estimatedTime: string;
}

// --- 5. USER & AUTH ---
export interface User {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
}

export interface UserProfile {
  id?: number;
  name: string;
  email: string;
}

export interface PasswordUpdateData {
  oldPassword: string;
  newPassword: string;
}

// --- 6. COMMON & UTILITY ---
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  last: boolean;
}

export interface ApiError {
  message: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
}

export interface BrandGroup {
  name: string;
  count: number;
  mainImage: string;
  products: string[];
}