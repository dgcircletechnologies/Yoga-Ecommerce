import type { AuthUser } from "@/api/auth.api";
import type { CheckoutDetails } from "@/components/checkout/checkout-page";

export const emptyCheckoutDetails: CheckoutDetails = {
  name: "",
  email: "",
  phone: "",
  phoneCountry: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
};

export function checkoutDetailsFromUser(user: AuthUser | null | undefined): CheckoutDetails {
  if (!user) return emptyCheckoutDetails;

  return {
    name: user.name ?? "",
    email: user.email ?? "",
    phone: user.phone ?? "",
    phoneCountry: "",
    address1: user.address1 ?? "",
    address2: user.address2 ?? "",
    city: user.city ?? "",
    state: user.state ?? "",
    postalCode: user.postalCode ?? "",
    country: user.country ?? "",
  };
}
