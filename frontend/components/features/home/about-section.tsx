import Image from "next/image";

import { Container } from "@/components/ui/container";

const principles = [
  ["Thoughtful essentials", "Well-made pieces chosen to support the way you practice."],
  ["Everyday rituals", "Simple tools that help create more room to breathe and move."],
  ["A gentler pace", "A considered approach to shopping, practice, and daily life."],
];

export function AboutSection() {
  return (
    <section className="bg-gradient-to-r from-brand-purple/10 to-transparent py-20 sm:py-24 lg:py-28">
      <Container className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[2fr_3fr] lg:gap-20">
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="absolute -left-3 -top-3 h-full w-full border border-brand-lavender sm:-left-5 sm:-top-5" />
          <Image alt="A peaceful yoga practice" className="relative h-auto w-full" height={690} src="/lotuslab/aboutus.png" width={570} />
        </div>
        <div>
          <span className="mb-5 inline-block text-sm uppercase tracking-[0.14em] text-brand-purple">About Us</span>
          <h2 className="text-4xl sm:text-5xl">The journey and principles behind Sattva</h2>
          <p className="mt-6 text-base leading-7 text-brand-gray">We believe the right essentials do more than support a practice. They invite you to return to yourself, one considered breath and one gentle movement at a time.</p>
          <ol className="mt-9 space-y-7">
            {principles.map(([title, description], index) => <li className="relative pl-14" key={title}><span className="absolute left-0 top-0 font-serif text-3xl text-brand-purple">0{index + 1}</span><h3 className="mb-2 text-xl">{title}</h3><p className="text-sm leading-6 text-brand-gray">{description}</p></li>)}
          </ol>
        </div>
      </Container>
    </section>
  );
}
