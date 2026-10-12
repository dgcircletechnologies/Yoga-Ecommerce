import type { Metadata } from "next";

import { AboutSection } from "@/components/features/home/about-section";
import { StoryJourneySection } from "@/components/features/home/story-journey-section";
import { PageHero } from "@/components/layout/page-hero";
import { TestimonialsSection } from "@/components/features/home/testimonials-section";
import { testimonials } from "@/data/mock/testimonials";

export const metadata: Metadata = {
  title: "Our story | Sattva",
  description: "Discover the journey and principles behind Sattva.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero backgroundImage="/lotuslab/classes-3.png" title="Our story" />
      <main>
        <AboutSection />
        <StoryJourneySection />
        <TestimonialsSection testimonials={testimonials} />
      </main>
    </>
  );
}
