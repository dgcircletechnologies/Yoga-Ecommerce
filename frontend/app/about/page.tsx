import type { Metadata } from "next";

import { AboutSection } from "@/components/features/home/about-section";
import { TestimonialsSection } from "@/components/features/home/testimonials-section";
import { testimonials } from "@/data/mock/testimonials";

export const metadata: Metadata = {
  title: "Our Story | Sattva",
  description: "The journey and principles behind Sattva.",
};

export default function AboutPage() {
  return (
    <main>
      <AboutSection />
      <TestimonialsSection testimonials={testimonials} />
    </main>
  );
}
