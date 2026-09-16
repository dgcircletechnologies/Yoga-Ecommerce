import Link from "next/link";

export default function PaymentRedirectPage() {
  return <main className="flex min-h-[70vh] items-center justify-center px-5 py-20 text-center"><div className="max-w-md"><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-purple">Payment provider handoff</p><h1 className="mt-3 text-4xl sm:text-5xl">Ready for payment</h1><p className="mt-5 text-sm leading-6 text-brand-gray">This is the placeholder destination for the future payment provider integration. Your order has not been charged.</p><Link className="mt-8 inline-flex min-h-12 items-center bg-brand-purple px-7 text-[11px] font-semibold uppercase tracking-[0.18em] text-white hover:bg-brand-dark" href="/checkout">Return to checkout</Link></div></main>;
}
