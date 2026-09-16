import type { Metadata } from "next";
import type { ReactNode } from "react";

import { PageHero } from "@/components/layout/page-hero";
import { ClockIcon, LocationIcon, PhoneIcon } from "@/components/ui/icons";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Contact | Sattva",
  description: "Get in touch with Sattva about yoga and meditation essentials.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero title="Contact" />
      <main>
        <Container className="grid gap-12 py-20 sm:py-24 lg:grid-cols-2 lg:gap-20 lg:py-[100px]">
          <section>
            <h2>Get in touch</h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-brand-gray">Have a question about your practice, an order, or finding the right essentials? We would love to hear from you.</p>
            <div className="mt-10 space-y-4 text-sm text-brand-dark">
              <ContactDetail icon={<LocationIcon />} text="2900 Lapeer Rd, Port Hurons, MI 49070" />
              <ContactDetail icon={<PhoneIcon />} text="+1 (800) 478-42-51" href="tel:+18004784251" />
              <ContactDetail icon={<PhoneIcon />} text="+1 (800) 478-24-15" href="tel:+18004782415" />
              <ContactDetail icon={<ClockIcon />} text="Office Hours: 8AM - 11PM" />
              <ContactDetail icon={<ClockIcon />} text="Sunday - Weekend Day" />
            </div>
          </section>

          <section>
            <h2>Contact Form</h2>
            <form action="/contact" className="mt-8 space-y-5" method="get">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="sr-only" htmlFor="name">Name</label>
                <input className="w-full border-0 bg-brand-light-gray px-5 py-5 text-brand-dark outline-none transition-colors placeholder:font-serif placeholder:text-brand-dark hover:bg-brand-lavender focus:bg-brand-lavender" id="name" name="name" placeholder="Name" type="text" />
                <label className="sr-only" htmlFor="email">Email</label>
                <input className="w-full border-0 bg-brand-light-gray px-5 py-5 text-brand-dark outline-none transition-colors placeholder:font-serif placeholder:text-brand-dark hover:bg-brand-lavender focus:bg-brand-lavender" id="email" name="email" placeholder="Email" type="email" />
              </div>
              <label className="sr-only" htmlFor="subject">Subject</label>
              <input className="w-full border-0 bg-brand-light-gray px-5 py-5 text-brand-dark outline-none transition-colors placeholder:font-serif placeholder:text-brand-dark hover:bg-brand-lavender focus:bg-brand-lavender" id="subject" name="subject" placeholder="Subject" type="text" />
              <label className="sr-only" htmlFor="message">Message</label>
              <textarea className="min-h-[150px] w-full resize-y border-0 bg-brand-light-gray px-5 py-5 text-brand-dark outline-none transition-colors placeholder:font-serif placeholder:text-brand-dark hover:bg-brand-lavender focus:bg-brand-lavender" id="message" name="message" placeholder="Message" />
              <button className="min-h-12 bg-brand-purple px-7 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-brand-dark" type="submit">Submit</button>
            </form>
          </section>
        </Container>
        <div className="h-[350px] w-full">
          <iframe className="h-full w-full border-0 grayscale" loading="lazy" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2918.8840785320544!2d-82.49493468465671!3d42.980715479150156!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88259e93ea837f03%3A0x9eaf24e841d574ed!2zNDIzOSBMYXBlZXIgUmQsIFBvcnQgSHVyb24sIE1JIDQ4MDYwLCDQodCo0JA!5e0!3m2!1sru!2sua!4v1640107647193!5m2!1sru!2sua" title="Sattva location map" />
        </div>
      </main>
    </>
  );
}

function ContactDetail({ icon, text, href }: { icon: ReactNode; text: string; href?: string }) {
  const content = <><span className="text-brand-purple">{icon}</span><span>{text}</span></>;
  return href ? <a className="flex items-center gap-3 transition-colors hover:text-brand-purple" href={href}>{content}</a> : <p className="flex items-center gap-3">{content}</p>;
}
