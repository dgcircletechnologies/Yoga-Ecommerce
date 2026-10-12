"use client";

import { useEffect, useRef, useState } from "react";
import {
  getAdminServiceBooking,
  getAdminServiceBookingHistory,
  type AdminServiceBooking,
} from "@/api/service-bookings.api";
import { siteInfo } from "@/lib/site-info";
import { StatusIcon } from "@/components/orders/status-icon";
import { Mail, Phone } from "@deemlol/next-icons";

type BookingHistory = Array<{
  id: string;
  action: string;
  description: string;
  performedAt: string;
  actorType?: string;
}>;

const date = (value: string, withTime = true) =>
  new Intl.DateTimeFormat("en-US", withTime ? { dateStyle: "medium", timeStyle: "short" } : { dateStyle: "medium" }).format(
    new Date(value)
  );

const statusDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));

const money = (value?: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value ?? 0);

const statusLabel = (value: string) =>
  value.replaceAll("_", " ").toLowerCase().replace(/(^| )\w/g, (letter) => letter.toUpperCase());

export function ServiceBookingPrintDocument({
  id,
  booking: initialBooking,
  history: initialHistory,
  className = "",
}: {
  id?: string;
  booking?: AdminServiceBooking;
  history?: BookingHistory;
  className?: string;
}) {
  const [booking, setBooking] = useState<AdminServiceBooking | undefined>(initialBooking);
  const [history, setHistory] = useState<BookingHistory>(initialHistory ?? []);
  const [error, setError] = useState("");
  const printed = useRef(false);
  const originalTitle = useRef<string>("");

  // Suppress browser default print headers (which print document.title)
  useEffect(() => {
    const handleBeforePrint = () => {
      originalTitle.current = document.title;
      document.title = " ";
    };
    const handleAfterPrint = () => {
      if (originalTitle.current) {
        document.title = originalTitle.current;
      }
    };
    window.addEventListener("beforeprint", handleBeforePrint);
    window.addEventListener("afterprint", handleAfterPrint);
    return () => {
      window.removeEventListener("beforeprint", handleBeforePrint);
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, []);

  useEffect(() => {
    if (initialBooking) {
      setBooking(initialBooking);
      setHistory(initialHistory ?? []);
      return;
    }
    if (!id) return;
    let cancelled = false;
    Promise.all([getAdminServiceBooking(id), getAdminServiceBookingHistory(id)])
      .then(([nextBooking, nextHistory]) => {
        if (cancelled) return;
        setBooking(nextBooking);
        setHistory(nextHistory);
        if (!printed.current) {
          printed.current = true;
          window.setTimeout(() => {
            const prev = document.title;
            document.title = " ";
            window.print();
            window.setTimeout(() => {
              document.title = prev;
            }, 1000);
          }, 350);
        }
      })
      .catch((reason) => {
        if (!cancelled) setError(reason instanceof Error ? reason.message : "Unable to load service booking.");
      });
    return () => {
      cancelled = true;
    };
  }, [id, initialBooking, initialHistory]);

  if (error) {
    return (
      <main className={`print-document ${className}`}>
        <p className="p-6 text-red-600">{error}</p>
      </main>
    );
  }

  if (!booking) {
    return (
      <main className={`print-document ${className}`}>
        <p className="p-6 text-slate-500">Loading service booking…</p>
      </main>
    );
  }

  const customerPhone = booking.customer.phone || "Phone not provided";
  const addressLines = booking.customer.address
    ? [
        booking.customer.address.address,
        booking.customer.address.city,
        booking.customer.address.state,
        booking.customer.address.postalCode,
        booking.customer.address.country || "United States",
      ].filter(Boolean)
    : ["Not provided"];

  const findHistoryTime = (...actions: string[]) =>
    history.find((item) => actions.includes(item.action))?.performedAt;

  const isTrainerConfirmed =
    booking.trainerConfirmationStatus === "CONFIRMED" ||
    Boolean(booking.trainerConfirmedAt) ||
    history.some((item) =>
      ["TRAINER_CONFIRMED", "TRAINER_REACHED", "OTP_CONFIRMED"].includes(item.action)
    );

  const trainerReachedTime =
    findHistoryTime("TRAINER_REACHED", "TRAINER_CONFIRMED") ||
    booking.trainerConfirmedAt ||
    booking.updatedAt ||
    booking.createdAt;

  const otpConfirmedTime =
    findHistoryTime("OTP_CONFIRMED", "TRAINER_CONFIRMED") ||
    booking.trainerConfirmedAt ||
    trainerReachedTime;

  const hasUploadedImages =
    (booking.sceneImages?.length ?? 0) > 0 ||
    history.some((item) => item.action === "IMAGES_UPLOADED");

  const imagesUploadedTime =
    booking.sceneImages?.[0]?.uploadedAt ||
    findHistoryTime("IMAGES_UPLOADED", "TRAINER_CONFIRMED") ||
    otpConfirmedTime;

  const hasAdminReviewedImages =
    booking.imageReviewStatus === "REVIEWED" ||
    booking.imageReviewStatus === "REJECTED" ||
    history.some((item) => ["IMAGES_REVIEWED", "IMAGES_REJECTED"].includes(item.action)) ||
    (booking.adminReviewStatus === "APPROVED" && hasUploadedImages);

  const imagesReviewedTime =
    booking.imageReviewedAt ||
    findHistoryTime("IMAGES_REVIEWED", "IMAGES_REJECTED") ||
    booking.adminReviewedAt ||
    booking.updatedAt;

  const hasAdminReviewedBooking =
    booking.adminReviewStatus === "APPROVED" ||
    booking.adminReviewStatus === "REJECTED" ||
    history.some((item) => ["ADMIN_APPROVED", "ADMIN_REJECTED"].includes(item.action));

  const adminReviewedTime =
    booking.adminReviewedAt ||
    findHistoryTime("ADMIN_APPROVED", "ADMIN_REJECTED") ||
    booking.updatedAt;

  const timeline: Array<{
    id: string;
    title: string;
    iconStatus: string;
    description: string;
    performedAt: string;
    actorType: string;
  }> = [
    {
      id: `booked-${booking.id}`,
      title: "Service Booked",
      iconStatus: "created",
      description: `Customer (${booking.customer.name}) booked ${booking.service?.name ?? "the wellness service"} (${booking.quantity} ${booking.quantity === 1 ? "session" : "sessions"}) and payment was confirmed.`,
      performedAt: findHistoryTime("BOOKING_CREATED") || booking.createdAt,
      actorType: "CUSTOMER",
    },
  ];

  if (isTrainerConfirmed) {
    timeline.push({
      id: `trainer-reached-${booking.id}`,
      title: "Trainer Reached",
      iconStatus: "out_for_delivery",
      description: `Assigned trainer (${booking.trainer.name}) reached the customer's service location and initiated OTP verification.`,
      performedAt: trainerReachedTime,
      actorType: "TRAINER",
    });

    timeline.push({
      id: `otp-confirmed-${booking.id}`,
      title: "OTP Confirmed",
      iconStatus: "confirmed",
      description: `Customer service OTP was entered by ${booking.trainer.name} and verified to confirm session delivery.`,
      performedAt: otpConfirmedTime,
      actorType: "TRAINER",
    });
  }

  if (hasUploadedImages) {
    const count = booking.sceneImages?.length || 1;
    timeline.push({
      id: `images-uploaded-${booking.id}`,
      title: "Images Uploaded",
      iconStatus: "processing",
      description: `Trainer uploaded ${count} session scene ${count === 1 ? "photo" : "photos"} for verification.`,
      performedAt: imagesUploadedTime,
      actorType: "TRAINER",
    });
  }

  if (hasAdminReviewedImages) {
    const isRejected = booking.imageReviewStatus === "REJECTED";
    const count = booking.sceneImages?.length || 0;
    timeline.push({
      id: `images-reviewed-${booking.id}`,
      title: isRejected ? "Images Rejected by Admin" : "Admin Reviewed Images",
      iconStatus: isRejected ? "cancelled" : "confirmed",
      description: isRejected
        ? `Admin reviewed and rejected the uploaded session photos${booking.imageRejectionReason ? `: ${booking.imageRejectionReason}` : "."}`
        : `Admin reviewed ${count > 1 ? `all ${count} uploaded session photos` : "the uploaded session photos"} and verified the visual evidence.`,
      performedAt: imagesReviewedTime,
      actorType: "ADMIN",
    });
  }

  if (hasAdminReviewedBooking) {
    const isRejected = booking.adminReviewStatus === "REJECTED";
    timeline.push({
      id: `admin-approved-${booking.id}`,
      title: isRejected ? "Booking Rejected by Admin" : "Admin Approved",
      iconStatus: isRejected ? "cancelled" : "approved",
      description: isRejected
        ? `Booking rejected by admin${booking.adminRejectionReason ? `: ${booking.adminRejectionReason}` : "."}`
        : "Admin verified the OTP confirmation and reviewed session images, approving the service booking.",
      performedAt: adminReviewedTime,
      actorType: "ADMIN",
    });
  }

  if (booking.status === "COMPLETED" || booking.status === "CANCELLED") {
    const isCancelled = booking.status === "CANCELLED";
    timeline.push({
      id: `final-status-${booking.id}`,
      title: isCancelled ? "Booking Cancelled" : "Service Completed",
      iconStatus: isCancelled ? "cancelled" : "completed",
      description: isCancelled
        ? "Service booking was cancelled."
        : "All scheduled sessions, verifications, and reviews have been completed.",
      performedAt: findHistoryTime("STATUS_CHANGED") || booking.updatedAt || booking.createdAt,
      actorType: "ADMIN",
    });
  }

  const currentStatus = booking.status;
  const currentTimestamp = booking.updatedAt || booking.createdAt;

  return (
    <main className={`print-document ${className}`}>
      {/* Top Header Banner with Highlighted Logo Badge & Company Name */}
      <header className="ref-header">
        <div className="ref-header-brand">
          <div className="ref-header-logo-badge">
            <img
              alt={siteInfo.name}
              className="ref-header-logo"
              src="/logo.jpeg"
            />
          </div>
          <div className="ref-header-company-group">
            <div className="ref-header-company">{siteInfo.name}</div>
            <div className="ref-header-subtitle">Official Booking Receipt</div>
            <div className="ref-header-contact-row">
              <span className="ref-header-contact-item">
                <Phone aria-hidden size={11} className="ref-header-contact-icon" />
                {siteInfo.phone}
              </span>
              <span>·</span>
              <span className="ref-header-contact-item">
                <Mail aria-hidden size={11} className="ref-header-contact-icon" />
                {siteInfo.email}
              </span>
            </div>
          </div>
        </div>
        <div className="ref-header-detail">
          <div className="ref-header-receipt-title">Service Booking</div>
          <div className="ref-header-id">Booking #{booking.id.slice(0, 8).toUpperCase()}</div>
          <div className="ref-header-meta">
            <span>Created: {date(booking.createdAt, false)}</span>
          </div>
        </div>
      </header>

      {/* Main Two-Column Layout */}
      <div className="ref-order-grid">
        {/* LEFT COLUMN: Current Status & Action History */}
        <div className="ref-left-column">
          {/* 1. Prominent Current Status Banner */}
          <div className="ref-current-status-banner">
            <div className="ref-current-status-icon">
              <StatusIcon service size={26} status={currentStatus} />
            </div>
            <div>
              <div className="ref-current-status-label">Current Status</div>
              <div className="ref-current-status-title">{statusLabel(currentStatus)}</div>
              <div className="mt-1 text-xs text-emerald-800">
                Updated {statusDate(currentTimestamp)}
              </div>
            </div>
          </div>

          {/* 2. Booking Action History Timeline */}
          <section className="ref-card ref-card-history">
            <div className="ref-card-header">
              <span>Booking Action History</span>
              <span className="text-[10px] font-normal lowercase tracking-normal text-slate-500">
                {timeline.length} {timeline.length === 1 ? "event" : "events"}
              </span>
            </div>
            <div className="ref-card-body">
              <div className="ref-timeline">
                {timeline.map((event, index) => {
                  const isLast = index === timeline.length - 1;
                  const isLatest = isLast;
                  return (
                    <div
                      className={`ref-timeline-step ${isLatest ? "is-latest" : ""}`}
                      key={event.id}
                    >
                      <div className="ref-timeline-indicator">
                        <div className="ref-timeline-dot">
                          <StatusIcon service size={14} status={event.iconStatus} />
                        </div>
                        {!isLast && <div className="ref-timeline-line" />}
                      </div>
                      <div className="ref-timeline-info">
                        <div className="ref-timeline-status">{event.title}</div>
                        <div className="ref-timeline-desc">{event.description}</div>
                        <div className="ref-timeline-date">
                          {statusDate(event.performedAt)}
                          {event.actorType && (
                            <span className="ml-1.5 font-semibold text-slate-400">
                              · {event.actorType}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Service Details, Sessions, Trainer, Customer, Location, Policy, Terms */}
        <div className="ref-right-column">
          {/* 1. Service Details */}
          <section className="ref-card ref-card-items">
            <div className="ref-card-header">
              <span>Service Details</span>
              <span className="text-[10px] font-normal lowercase tracking-normal text-slate-500">
                {booking.quantity} {booking.quantity === 1 ? "session" : "sessions"}
              </span>
            </div>
            <div className="ref-card-body">
              <article className="ref-item-row">
                <div className="ref-item-image-box">
                  {booking.service?.imageUrl ? (
                    <img
                      alt={booking.service.name}
                      className="ref-item-image"
                      src={booking.service.imageUrl}
                    />
                  ) : (
                    <span className="text-xs font-semibold text-slate-400">Service</span>
                  )}
                </div>
                <div className="ref-item-details">
                  <div>
                    <div className="ref-item-header">
                      <div>
                        <div className="ref-item-name">
                          {booking.service?.name ?? "Yoga & Wellness Session"}
                        </div>
                        <div className="text-xs text-slate-500">
                          {booking.service?.description || "Personalized Sattva yoga and mindfulness session"}
                        </div>
                      </div>
                      <div className="ref-item-price">{money(booking.totalAmount)}</div>
                    </div>

                    <div className="ref-item-specs">
                      <span className="ref-item-spec-tag">
                        <strong>Sessions:</strong> {booking.quantity}
                      </span>
                      <span className="ref-item-spec-tag">
                        <strong>Rate:</strong> {money(booking.pricePerSession)} / session
                      </span>
                      <span className="ref-item-spec-tag">
                        <strong>Order ID:</strong> #{booking.orderId.slice(0, 8).toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 text-[11px] text-slate-500">
                    {booking.quantity} {booking.quantity === 1 ? "session" : "sessions"} ×{" "}
                    {money(booking.pricePerSession)} per session
                  </div>
                </div>
              </article>

              {/* Totals Box */}
              <div className="ref-totals-box">
                <div className="ref-totals-row">
                  <span className="text-slate-600">Total Booked Sessions</span>
                  <span className="font-semibold text-slate-900">{booking.quantity} sessions</span>
                </div>
                <div className="ref-totals-row">
                  <span className="text-slate-600">Rate Per Session</span>
                  <span className="font-semibold text-slate-900">{money(booking.pricePerSession)}</span>
                </div>
                <div className="ref-totals-grand">
                  <span>Total Amount</span>
                  <span>{money(booking.totalAmount)}</span>
                </div>
                <div className="mt-2.5 flex items-center justify-between border-t border-blue-200/60 pt-2 text-[11px] text-slate-600">
                  <span>
                    Payment Status:{" "}
                    <strong className="text-slate-900">{booking.payment?.status || "Paid"}</strong>
                  </span>
                  <span>
                    Currency:{" "}
                    <strong className="text-slate-900">{booking.payment?.currency || "USD"}</strong>
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Scheduled Sessions */}
          <section className="ref-card ref-card-shipment">
            <div className="ref-card-header">
              <span>Scheduled Sessions ({booking.sessions.length})</span>
            </div>
            <div className="ref-card-body">
              {booking.sessions.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {booking.sessions.map((session, index) => (
                    <div
                      className="flex items-center justify-between py-2 text-xs"
                      key={session.id}
                    >
                      <div>
                        <span className="font-semibold text-slate-900">Session {index + 1}</span>
                        <span className="ml-2 text-slate-600">{date(session.scheduledAt, true)}</span>
                      </div>
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-700">
                        {session.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs italic text-slate-500">No scheduled sessions recorded.</p>
              )}
            </div>
          </section>

          {/* 3. Assigned Trainer */}
          <section className="ref-card ref-card-trainer">
            <div className="ref-card-header">Assigned Trainer & Verification</div>
            <div className="ref-card-body">
              <div className="ref-info-grid">
                <div className="ref-info-item">
                  <span className="ref-info-label">Trainer Name</span>
                  <span className="ref-info-value">{booking.trainer.name}</span>
                </div>
                <div className="ref-info-item">
                  <span className="ref-info-label">Specialty</span>
                  <span className="ref-info-value font-normal text-slate-700">
                    {booking.trainer.specialty || "Certified Yoga Instructor"}
                  </span>
                </div>
                <div className="ref-info-item">
                  <span className="ref-info-label">Contact Email</span>
                  <span className="ref-info-value font-normal text-slate-700">
                    {booking.trainer.email || "—"}
                  </span>
                </div>
                <div className="ref-info-item">
                  <span className="ref-info-label">Contact Phone</span>
                  <span className="ref-info-value font-normal text-slate-700">
                    {booking.trainer.phone || "—"}
                  </span>
                </div>
                <div className="ref-info-item">
                  <span className="ref-info-label">Trainer Confirmation</span>
                  <span className="ref-info-value text-blue-700">
                    {booking.trainerConfirmationStatus}
                  </span>
                </div>
                <div className="ref-info-item">
                  <span className="ref-info-label">OTP Verification</span>
                  <span className="ref-info-value text-emerald-700">
                    {booking.trainerConfirmedAt ? "Verified" : "Pending"}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Trainer Evidence / Session Photos */}
          <section className="ref-card ref-card-evidence">
            <div className="ref-card-header">
              <span>Trainer Session Photos ({booking.sceneImages?.length ?? 0})</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                Review: {statusLabel(booking.imageReviewStatus || "NOT_UPLOADED")}
              </span>
            </div>
            <div className="ref-card-body">
              {booking.sceneImages && booking.sceneImages.length > 0 ? (
                <div className="ref-evidence-grid">
                  {booking.sceneImages.map((img, idx) => (
                    <div className="ref-evidence-item" key={img.imagePublicId || idx}>
                      <div className="ref-evidence-img-box">
                        <img
                          alt={`Trainer session photo ${idx + 1}`}
                          className="ref-evidence-img"
                          src={img.imageUrl}
                        />
                      </div>
                      <div className="ref-evidence-caption">
                        <span className="font-semibold text-slate-700">Photo {idx + 1}</span>
                        {img.uploadedAt && <span>{statusDate(img.uploadedAt)}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs italic text-slate-500">
                  No session photos have been uploaded by the trainer yet.
                </p>
              )}
            </div>
          </section>

          {/* 5. Customer Details */}
          <section className="ref-card ref-card-customer">
            <div className="ref-card-header">Customer Details</div>
            <div className="ref-card-body">
              <div className="ref-info-grid">
                <div className="ref-info-item">
                  <span className="ref-info-label">Full Name</span>
                  <span className="ref-info-value">{booking.customer.name}</span>
                </div>
                <div className="ref-info-item">
                  <span className="ref-info-label">Email Address</span>
                  <span className="ref-info-value flex items-center gap-1.5 font-normal">
                    <Mail aria-hidden size={13} />
                    {booking.customer.email}
                  </span>
                </div>
                <div className="ref-info-item col-span-2">
                  <span className="ref-info-label">Phone Number</span>
                  <span className="ref-info-value flex items-center gap-1.5 font-normal">
                    <Phone aria-hidden size={13} />
                    {customerPhone}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* 5. Service Location */}
          <section className="ref-card ref-card-shipping">
            <div className="ref-card-header">Service Location</div>
            <div className="ref-card-body">
              <div className="ref-address-block">
                <div className="font-semibold text-slate-900">{booking.customer.name}</div>
                {addressLines.map((line, idx) => (
                  <div key={idx}>{line}</div>
                ))}
                <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                  <Phone aria-hidden size={12} /> {customerPhone}
                </div>
              </div>
            </div>
          </section>

          {/* 6. Rescheduling & Cancellation Policy */}
          <section className="ref-card ref-card-return">
            <div className="ref-card-header">Rescheduling & Cancellation Policy</div>
            <div className="ref-card-body">
              <p className="ref-policy-text">
                Sessions may be rescheduled with at least 24 hours prior notice through your dashboard or customer support. Cancellations made within 24 hours of scheduled session time are non-refundable. Expired sessions cannot be credited or transferred.
              </p>
            </div>
          </section>

          {/* 7. Terms & Conditions */}
          <section className="ref-card ref-card-terms">
            <div className="ref-card-header">Terms & Conditions</div>
            <div className="ref-card-body">
              <p className="ref-policy-text">
                All wellness and yoga sessions are conducted by certified Sattva instructors. Clients must disclose any relevant physical conditions, injuries, or limitations prior to practice. Sattva Yoga and its instructors are not liable for pre-existing medical conditions. By booking, you agree to our standard service terms.
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="ref-footer">
        <div>Thank you for choosing {siteInfo.name}. We appreciate your dedication to wellness and mindful living.</div>
        <div>{siteInfo.email} · {siteInfo.phone}</div>
      </footer>
    </main>
  );
}
