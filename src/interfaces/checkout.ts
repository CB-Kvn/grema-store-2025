import { CartItem } from "./cart";

export interface CheckoutPageProps {
  cartItems: CartItem[];
}

export interface AddressInfo {
  buyerId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  provincia: string;
  canton: string;
}

export interface PaymentInfo {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}
