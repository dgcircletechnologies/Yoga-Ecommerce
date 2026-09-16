export type PaymentRequest = {
  amount: number;
  currency: string;
  customerEmail: string;
};

/** Adapter boundary for the eventual payment provider (Stripe, Adyen, etc.). */
export async function beginPayment(request: PaymentRequest) {
  return {
    provider: "placeholder",
    redirectUrl: `/checkout/payment?amount=${request.amount.toFixed(2)}&currency=${request.currency}`,
  };
}
