export type PaymentRequest = {
  baseAmountUSD: number;
  displayAmount: number;
  currency: string;
  exchangeRate: number;
  customerEmail: string;
};

/** Adapter boundary for the eventual payment provider (Stripe, Adyen, etc.). */
export async function beginPayment(request: PaymentRequest) {
  return {
    provider: "placeholder",
    redirectUrl: `/checkout/payment?amount=${request.displayAmount.toFixed(2)}&currency=${request.currency}`,
  };
}
