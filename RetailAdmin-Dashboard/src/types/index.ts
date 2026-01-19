export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export interface Product {
  id: number;
  albumId: number;
  title: string;
  url: string;
  thumbnailUrl: string;
  price: number;
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: number;
  customerId: number;
  customerName: string;
  items: CartItem[];
  total: number;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface CustomerState {
  customers: User[];
  selectedCustomer: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
}

export interface CartState {
  items: CartItem[];
  selectedCustomer: User | null;
  orders: Order[];
}
