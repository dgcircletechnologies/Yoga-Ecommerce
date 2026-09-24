"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getServiceBookings, type ServiceBooking } from "@/api/service-bookings.api";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/layout/page-hero";

const date = (value: string) => new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }).format(new Date(value));

export function ServiceBookingsPage() {
  const [bookings, setBookings] = useState<ServiceBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { getServiceBookings().then(setBookings).catch(() => setError("Unable to load your service bookings.")).finally(() => setLoading(false)); }, []);

  return <>
    <PageHero title="My Services" />
    <main><Container className="py-16 sm:py-20 lg:py-24">
      <div className="border-b border-black/10 pb-8"><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-purple">Your Sattva history</p><h1 className="mt-3 text-4xl sm:text-5xl">Service bookings</h1><p className="mt-3 text-sm text-brand-gray">Your offline home sessions, trainers, schedules, and booking status.</p></div>
      {loading ? <div className="py-20 text-center text-sm text-brand-gray">Loading service bookings…</div> : error ? <p className="py-20 text-center text-sm text-red-700">{error}</p> : !bookings.length ? <div className="py-20 text-center"><h2 className="text-3xl">No service bookings yet.</h2><Link className="mt-7 inline-flex min-h-12 items-center bg-brand-purple px-7 text-[11px] font-semibold uppercase tracking-[0.18em] text-white" href="/services">Explore services</Link></div> : <div className="mt-8 space-y-6">{bookings.map((booking) => <article className="border border-black/10 bg-white p-6 shadow-sm sm:p-8" key={booking.id}>
        <div className="flex flex-col justify-between gap-5 border-b border-black/10 pb-5 sm:flex-row"><div><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-purple">Offline home session</p><h2 className="mt-2 text-2xl">{booking.service.name}</h2><p className="mt-2 text-sm text-brand-gray">Trainer: {booking.trainer.name} · {booking.quantity} {booking.quantity === 1 ? "session" : "sessions"}</p></div><div className="text-left sm:text-right"><p className="text-lg font-semibold">USD {booking.totalAmount.toFixed(2)}</p><p className="mt-1 text-xs text-brand-gray">{booking.paymentStatus ?? "Payment pending"} · {booking.status}</p></div></div>
        {booking.otp && <div className="mt-6 border border-brand-purple/20 bg-brand-purple/5 p-5"><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-purple">Your service OTP</p><p className="mt-2 text-3xl font-bold tracking-[0.3em]">{booking.otp}</p><p className="mt-2 text-xs leading-5 text-brand-gray">Keep this code safe and provide it to your trainer when requested.</p></div>}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_280px]"><div><h3 className="text-sm font-semibold">Scheduled sessions</h3><div className="mt-3 space-y-2">{booking.sessions.map((session, index) => <p className="flex justify-between gap-4 border-b border-black/5 py-2 text-sm" key={session.id}><span>Session {index + 1}</span><span className="text-brand-gray">{date(session.scheduledAt)} · {session.status}</span></p>)}</div></div><div className="text-sm leading-6 text-brand-gray"><h3 className="font-semibold text-brand-dark">Service address</h3><p className="mt-2">{booking.address.address}<br />{booking.address.city}, {booking.address.state}<br />{booking.address.country} {booking.address.postalCode}</p></div></div>
      </article>)}</div>}
    </Container></main>
  </>;
}
