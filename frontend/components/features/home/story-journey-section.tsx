import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/container";

export type StoryPillar = {
  id: string;
  badge: string;
  title: string;
  description: string;
  metric: string;
};

export type StoryMilestone = {
  year: string;
  title: string;
  description: string;
};

// Dummy data — structured for easy updates later
const STORY_PILLARS: StoryPillar[] = [
  {
    id: "materials",
    badge: "01 · Conscious Sourcing",
    title: "Earth-first materials",
    description:
      "Every mat, block, and prop is crafted from natural rubber, organic cotton, and sustainably harvested cork that feels grounded underfoot.",
    metric: "100% toxin-free essentials",
  },
  {
    id: "guidance",
    badge: "02 · Personal Guidance",
    title: "Certified home sessions",
    description:
      "Our vetted teachers bring personalized breathwork, restorative flows, and alignment support directly to the calm of your living space.",
    metric: "1-on-1 tailored practice",
  },
  {
    id: "craft",
    badge: "03 · Enduring Craft",
    title: "Built for daily rituals",
    description:
      "We test every piece alongside seasoned practitioners to ensure lasting grip, comforting texture, and timeless quiet beauty.",
    metric: "Tested over 1,000+ hours",
  },
  {
    id: "community",
    badge: "04 · Shared Stillness",
    title: "A mindful sanctuary",
    description:
      "Beyond products and sessions, Sattva is a welcoming rhythm for beginners and lifelong practitioners seeking balance in modern life.",
    metric: "Growing global sangha",
  },
];

const STORY_MILESTONES: StoryMilestone[] = [
  {
    year: "2021",
    title: "The first quiet breath",
    description:
      "Born from a small home studio with a simple vision: to strip away noise and create honest, tactile tools for daily stillness.",
  },
  {
    year: "2022",
    title: "Thoughtful studio essentials",
    description:
      "Partnered with small-batch artisans to launch our signature collection of natural mats, bolsters, and grounding props.",
  },
  {
    year: "2024",
    title: "Bringing teachers home",
    description:
      "Introduced verified in-home wellness sessions so practitioners can experience dedicated guidance in their own space.",
  },
  {
    year: "Today",
    title: "A complete wellness ritual",
    description:
      "Uniting mindful gear, curated practice bundles, and personal instruction for thousands of intentional mornings and evenings.",
  },
];

const STORY_HIGHLIGHTS = [
  { value: "4.9 / 5", label: "Practitioner satisfaction" },
  { value: "5,200+", label: "Mindful sessions guided" },
  { value: "100%", label: "Sustainably crafted gear" },
];

export function StoryJourneySection() {
  return (
    <section className="bg-white py-20 sm:py-24 lg:py-28">
      <Container>
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-4 inline-block text-sm uppercase tracking-[0.14em] text-brand-purple">
            Our Philosophy &amp; Craft
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl">
            Designed for stillness, built for everyday practice
          </h2>
          <p className="mt-5 text-base leading-7 text-brand-gray">
            From the textures beneath your palms to the teacher guiding your breath at home, every detail at Sattva is shaped with care, simplicity, and respect for your rhythm.
          </p>
        </div>

        {/* Four Core Pillars Grid */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STORY_PILLARS.map((pillar) => (
            <article
              key={pillar.id}
              className="group flex flex-col justify-between border border-black/10 bg-brand-light-gray/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-lavender hover:bg-white hover:shadow-brand sm:p-7"
            >
              <div>
                <span className="inline-block bg-brand-purple/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-purple">
                  {pillar.badge}
                </span>
                <h3 className="mt-5 text-xl text-brand-dark transition-colors group-hover:text-brand-purple">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-brand-gray">
                  {pillar.description}
                </p>
              </div>
              <div className="mt-6 border-t border-black/10 pt-4">
                <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.12em] text-brand-dark">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-purple" />
                  {pillar.metric}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Editorial Split: Visual Showcase + Journey Timeline */}
        <div className="mt-20 grid grid-cols-1 items-center gap-12 lg:mt-24 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Layered Visual & Stats Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="absolute -right-3 -top-3 h-full w-full border border-brand-lavender sm:-right-5 sm:-top-5" />
              <div className="relative overflow-hidden border border-black/10 bg-brand-light-gray">
                <Image
                  alt="Mindful yoga session and studio essentials"
                  className="h-auto w-full object-cover"
                  height={620}
                  src="/lotuslab/classes-4.png"
                  width={540}
                />
                <div className="border-t border-black/10 bg-white p-6 sm:p-7">
                  <p className="font-serif text-lg italic leading-relaxed text-brand-dark">
                    “True practice begins the moment you slow down enough to notice your breath.”
                  </p>
                  <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-purple">
                    — The Sattva Collective
                  </p>
                </div>
              </div>
            </div>

            {/* Mini Highlight Counters */}
            <div className="mt-6 grid grid-cols-3 gap-3 border border-black/10 bg-brand-purple/5 p-4 sm:p-5">
              {STORY_HIGHLIGHTS.map((item) => (
                <div key={item.label} className="text-center">
                  <p className="font-serif text-xl text-brand-purple sm:text-2xl">
                    {item.value}
                  </p>
                  <p className="mt-1 text-[11px] leading-4 text-brand-gray">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Milestones Timeline & CTA */}
          <div className="lg:col-span-7">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-purple">
              Milestones
            </span>
            <h3 className="mt-3 text-3xl sm:text-4xl">
              How our sanctuary grew
            </h3>
            <p className="mt-4 text-sm leading-7 text-brand-gray sm:text-base">
              Every chapter of Sattva has been shaped by conversations with teachers, students, and makers who care deeply about intentional living.
            </p>

            <div className="mt-8 space-y-6 border-l border-brand-lavender pl-6 sm:pl-8">
              {STORY_MILESTONES.map((milestone) => (
                <div key={milestone.year} className="relative">
                  <span className="absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-brand-purple sm:-left-[37px]" />
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
                    <span className="inline-block w-16 shrink-0 font-serif text-lg text-brand-purple">
                      {milestone.year}
                    </span>
                    <div>
                      <h4 className="text-lg text-brand-dark">
                        {milestone.title}
                      </h4>
                      <p className="mt-1 text-sm leading-6 text-brand-gray">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Links */}
            <div className="mt-10 flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/products"
                className="inline-flex min-h-12 items-center justify-center bg-brand-purple px-7 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-90"
              >
                Explore Essentials
              </Link>
              <Link
                href="/services"
                className="inline-flex min-h-12 items-center justify-center border border-brand-dark/20 bg-white px-7 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-dark transition-colors hover:border-brand-purple hover:text-brand-purple"
              >
                Book a Home Session
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

