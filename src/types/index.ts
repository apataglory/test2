// Authentication types
export interface User {
  id: string;
  email: string;
  phone: string;
  name: string;
  profileImage?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  role: 'CUSTOMER' | 'STORE_OWNER' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  phone: string;
  name: string;
  password: string;
  passwordConfirm: string;
}

// Product types
export interface Product {
  id: string;
  name: string;
  description?: string;
  image?: string;
  sector: ProductSector;
  storeId: string;
  store?: Store;
  basePrice: number;
  deliveryFee: number;
  availability: boolean;
  quantity?: number;
  createdAt: Date;
  updatedAt: Date;
}

export type ProductSector =
  | 'EATABLES'
  | 'CLOTHING'
  | 'ELECTRONICS'
  | 'HOUSEHOLD'
  | 'HEALTH_BEAUTY'
  | 'MARKET_PRODUCE'
  | 'OTHERS';

// Store types
export interface Store {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  latitude: number;
  longitude: number;
  category: StoreCategory;
  isRegistered: boolean;
  ownerId?: string;
  products?: Product[];
  createdAt: Date;
  updatedAt: Date;
}

export type StoreCategory = ProductSector;

// Order types
export interface Order {
  id: string;
  customerId: string;
  customer?: User;
  riderId?: string;
  rider?: Rider;
  items: OrderItem[];
  deliveryAddress: string;
  deliveryLat: number;
  deliveryLng: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentRef?: string;
  trackingUpdates?: TrackingUpdate[];
  notifications?: Notification[];
  createdAt: Date;
  updatedAt: Date;
  estimatedDelivery?: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product?: Product;
  storeId: string;
  store?: Store;
  quantity: number;
  pricePerUnit: number;
  total: number;
  createdAt: Date;
}

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'RIDER_ASSIGNED'
  | 'RIDER_AT_STORE'
  | 'ITEM_PURCHASED'
  | 'RIDER_DELIVERING'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'FAILED';

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export type PaymentMethod = 'FLUTTERWAVE' | 'BANK_TRANSFER' | 'WALLET';

// Rider types
export interface Rider {
  id: string;
  phone: string;
  name: string;
  email: string;
  profileImage?: string;
  latitude?: number;
  longitude?: number;
  isAvailable: boolean;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

// Tracking types
export interface TrackingUpdate {
  id: string;
  orderId: string;
  status: OrderStatus;
  latitude: number;
  longitude: number;
  message?: string;
  createdAt: Date;
}

// Address types
export interface Address {
  id: string;
  userId: string;
  label: string;
  address: string;
  latitude: number;
  longitude: number;
  isDefault: boolean;
  createdAt: Date;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  orderId?: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: Date;
}

export type NotificationType =
  | 'ORDER_CREATED'
  | 'RIDER_ASSIGNED'
  | 'RIDER_AT_STORE'
  | 'RIDER_EN_ROUTE'
  | 'DELIVERY_COMPLETED'
  | 'PAYMENT_RECEIVED'
  | 'CANCELLATION'
  | 'WARNING'
  | 'INFO';

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Search types
export interface SearchFilters {
  query?: string;
  sector?: ProductSector;
  priceMin?: number;
  priceMax?: number;
  distance?: number;
  storeId?: string;
  latitude?: number;
  longitude?: number;
  page?: number;
  limit?: number;
}

export interface SearchResult {
  products: (Product & { distance?: number })[];
  total: number;
  page: number;
  limit: number;
}
