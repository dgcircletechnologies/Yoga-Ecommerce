import Link from "next/link";

import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="bg-brand-dark bg-cover bg-center bg-no-repeat text-white" style={{ backgroundImage: "linear-gradient(rgba(155, 89, 182, 0.8), rgba(155, 89, 182, 0.1)), url('/lotuslab/bg-footer.png')" }}>
      <div className="mx-auto grid max-w-[1400px] gap-12 px-5 pb-[70px] pt-[70px] sm:grid-cols-2 sm:px-8 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr] lg:gap-10 lg:px-12">
        <div><Logo inverted /><p className="mt-6 max-w-xs text-sm leading-7 text-white/60">Tools for moving slowly, breathing deeply, and finding your everyday balance.</p></div>
        <FooterLinks title="Explore" links={[["Shop all", "/products"], ["Categories", "/categories"], ["Our story", "/about"]]} />
        <FooterLinks title="Help" links={[["Shipping & returns", "/shipping"], ["Contact us", "/contact"], ["FAQs", "/faq"]]} />
        <div><h2 className="mb-5 font-serif text-lg">Stay in the flow</h2><p className="text-sm leading-6 text-white/60">Notes on practice, presence, and new arrivals.</p><div className="mt-5 flex border-b border-white/40 pb-2"><span className="flex-1 text-sm text-white/40">Your email address</span><button className="text-[10px] font-bold uppercase tracking-[0.15em]" type="button">Join</button></div></div>
      </div>
      <div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-3 border-t border-white/15 px-5 py-6 text-[10px] uppercase tracking-[0.15em] text-white/40 sm:flex-row sm:px-8 lg:px-12"><span>© 2026 Sattva. Made for your practice.</span><span>Yoga essentials, thoughtfully considered.</span></div>
    </footer>
  );
}

function FooterLinks({ title, links }: { title: string; links: string[][] }) {
  return <div><h2 className="mb-5 font-serif text-lg">{title}</h2><div className="flex flex-col gap-3 text-sm text-white/60">{links.map(([label, href]) => <Link className="hover:text-white" href={href} key={label}>{label}</Link>)}</div></div>;
}
