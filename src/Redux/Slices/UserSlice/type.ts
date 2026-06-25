export interface Root {
  user: User | null;
  isAuth: boolean;
  isOnBoarded: boolean;
  cartItems: number | null;
  newImages: any;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  note: any;
  verifiedEmail: boolean;
  validEmailAddress: boolean;
  tags: any[];
  lifetimeDuration: string;
  defaultAddress: DefaultAddress;
  addresses: Address[];
  image: Image;
}

export interface DefaultAddress {
  formattedArea: string;
  address1: string;
  country: string;
}

export interface Address {
  address1: string;
  address2: string;
  city: string;
  country: string;
  id: string;
  province: any;
  zip: any;
}

export interface Image {
  src: string;
}
