"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getTrainerBooking, type TrainerBooking, verifyTrainerBookingOtp } from "@/api/trainer-bookings.api";
import { Button } from "@/components/ui/button";
import { dateTime, money, statusClass, statusLabel } from "./trainer-booking-utils";
import { TrainerBookingSkeleton, TrainerErrorState } from "./trainer-states";
import { TrainerOtpInput } from "./trainer-otp-input";

function isConfirmed(status: string) { return ["PAID", "CONFIRMED", "SCHEDULED"].includes(status); }

export function TrainerBookingDetailPage({ id }: { id: string }) {
  const [booking, setBooking] = useState<TrainerBooking>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");
  const [verifyError, setVerifyError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [otpResetKey, setOtpResetKey] = useState(0);

  useEffect(() => { getTrainerBooking(id).then(setBooking).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Unable to load this booking.")).finally(() => setLoading(false)); }, [id]);

  async function verify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (otp.length !== 6) { setVerifyError("Enter the six-digit code provided by the customer."); return; }
    setVerifying(true); setVerifyError("");
    try {
      const result = await verifyTrainerBookingOtp(id, otp);
      setBooking((current) => current ? { ...current, status: result.status, otpVerified: true, verifiedAt: result.verifiedAt } : current);
      setOtp("");
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "Unable to verify this booking.";
      setVerifyError(message.toLowerCase().includes("invalid verification") ? "Invalid verification code. Please check the code with the customer and try again." : message);
      setOtp(""); setOtpResetKey((current) => current + 1);
    } finally { setVerifying(false); }
  }

  if (loading) return <TrainerBookingSkeleton />;
  if (error || !booking) return <TrainerErrorState message={error || "Booking not found."} onRetry={() => window.location.reload()} />;
  const confirmed = isConfirmed(booking.status) || booking.otpVerified;
  const pending = booking.status === "PENDING" && !booking.otpVerified;

  return <div>
    <Link className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-purple" href="/trainer/bookings">← Back to bookings</Link>
    <header className="mt-6 flex flex-col justify-between gap-5 border-b border-black/10 pb-8 sm:flex-row sm:items-start"><div><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-purple">Booking details</p><h1 className="mt-3 font-serif text-4xl sm:text-5xl">{booking.service.name}</h1><p className="mt-3 text-sm text-brand-gray">Booking {booking.id.slice(0, 12)} · Created {dateTime(booking.createdAt)}</p></div><span className={`w-fit rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] ${statusClass(booking.status)}`}>{statusLabel(booking.status)}</span></header>
    <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_360px]"><div className="space-y-6">
      <section className="rounded-xl border border-black/10 bg-white p-6 shadow-sm sm:p-7"><h2 className="font-serif text-2xl">Customer</h2><div className="mt-5 grid gap-4 text-sm sm:grid-cols-2"><div><p className="text-[10px] uppercase tracking-[0.12em] text-brand-gray">Name</p><p className="mt-1 font-semibold">{booking.customer.name}</p></div><div><p className="text-[10px] uppercase tracking-[0.12em] text-brand-gray">Phone</p><p className="mt-1 font-semibold">{booking.customer.phone || "Not provided"}</p></div><div className="sm:col-span-2"><p className="text-[10px] uppercase tracking-[0.12em] text-brand-gray">Email</p><p className="mt-1 break-all font-semibold">{booking.customer.email}</p></div></div></section>
      <section className="rounded-xl border border-black/10 bg-white p-6 shadow-sm sm:p-7"><h2 className="font-serif text-2xl">Session</h2><div className="mt-5 grid gap-4 text-sm sm:grid-cols-2"><div><p className="text-[10px] uppercase tracking-[0.12em] text-brand-gray">Service</p><p className="mt-1 font-semibold">{booking.service.name}</p></div><div><p className="text-[10px] uppercase tracking-[0.12em] text-brand-gray">Sessions</p><p className="mt-1 font-semibold">{booking.quantity}</p></div>{booking.sessions.map((session, index) => <div key={session.id}><p className="text-[10px] uppercase tracking-[0.12em] text-brand-gray">Session {index + 1}</p><p className="mt-1 font-semibold">{dateTime(session.scheduledAt)}</p></div>)}<div><p className="text-[10px] uppercase tracking-[0.12em] text-brand-gray">Booking ID</p><p className="mt-1 break-all font-semibold">{booking.id}</p></div></div></section>
      <section className="rounded-xl border border-black/10 bg-white p-6 shadow-sm sm:p-7"><h2 className="font-serif text-2xl">Service address</h2><p className="mt-4 text-sm leading-7 text-brand-gray">{booking.address.address}<br />{booking.address.city}, {booking.address.state}<br />{booking.address.country} {booking.address.postalCode}</p></section>
    </div><aside className="space-y-6">
      <section className={`rounded-xl p-6 shadow-sm ${pending ? "border border-amber-200 bg-amber-50" : confirmed ? "border border-green-200 bg-green-50" : "border border-black/10 bg-white"}`} aria-live="polite">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em]">Customer verification</p>
        {pending ? <><h2 className="mt-3 font-serif text-2xl">Verify customer</h2><p className="mt-3 text-sm leading-6">Ask the customer for the verification code provided in their booking and enter it below to confirm the session.</p><form className="mt-5" onSubmit={verify}><label className="sr-only" htmlFor="trainer-otp-0">Customer verification code</label><TrainerOtpInput onChange={(value) => { setOtp(value); setVerifyError(""); }} resetKey={otpResetKey} value={otp} />{verifyError && <p className="mt-3 text-sm text-red-700" role="alert">{verifyError}</p>}<Button className="mt-5 w-full" disabled={verifying || otp.length !== 6} type="submit">{verifying ? "Verifying…" : "Confirm booking"}</Button></form></> : confirmed ? <><h2 className="mt-3 font-serif text-2xl">Booking confirmed</h2><p className="mt-3 text-sm leading-6">This customer’s verification code was accepted and the session is confirmed.</p><dl className="mt-5 space-y-2 border-t border-green-900/10 pt-4 text-sm"><div className="flex justify-between gap-4"><dt className="text-brand-gray">Confirmed at</dt><dd className="font-semibold">{booking.verifiedAt ? dateTime(booking.verifiedAt) : "Previously confirmed"}</dd></div><div className="flex justify-between gap-4"><dt className="text-brand-gray">Status</dt><dd className="font-semibold">{statusLabel(booking.status)}</dd></div></dl></> : <><h2 className="mt-3 font-serif text-2xl">{statusLabel(booking.status)}</h2><p className="mt-3 text-sm leading-6">This booking is read-only because it is {booking.status.toLowerCase()}. OTP verification is unavailable for this status.</p></>}
      </section>
      <section className="rounded-xl border border-black/10 bg-white p-6 shadow-sm"><h2 className="font-serif text-2xl">Payment</h2><dl className="mt-5 space-y-3 text-sm"><div className="flex justify-between gap-4"><dt className="text-brand-gray">Amount</dt><dd className="font-semibold">{money(booking.totalAmount)}</dd></div><div className="flex justify-between gap-4"><dt className="text-brand-gray">Payment status</dt><dd className="font-semibold">{booking.paymentStatus ?? "Pending"}</dd></div></dl></section>
      <div className="flex flex-col gap-3 sm:flex-row xl:flex-col"><Link className="inline-flex min-h-12 items-center justify-center rounded-md border border-brand-purple px-5 text-[10px] font-semibold uppercase tracking-[0.15em] text-brand-purple hover:bg-brand-purple hover:text-white" href="/trainer/history">View booking history</Link><Link className="inline-flex min-h-12 items-center justify-center rounded-md bg-brand-purple px-5 text-[10px] font-semibold uppercase tracking-[0.15em] text-white hover:bg-brand-dark" href="/trainer/dashboard">Back to dashboard</Link></div>
    </aside></div>
  </div>;
}
