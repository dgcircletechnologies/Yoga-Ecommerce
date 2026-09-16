import Image from "next/image";

import { Container } from "@/components/ui/container";
import type { Testimonial } from "@/types/testimonial";

type TestimonialsSectionProps = { testimonials: Testimonial[] };

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  return (
    <section className="bg-gradient-to-r from-brand-purple/10 to-transparent py-20 sm:py-24 lg:py-28">
      <Container>
        <div className="text-center"><span className="mb-4 inline-block text-sm uppercase tracking-[0.14em] text-brand-purple">Testimonials</span><h2>What our community says</h2></div>
        <div className="mx-auto mt-12 grid max-w-5xl gap-12 md:grid-cols-3 md:gap-8">
          {testimonials.map((testimonial) => <article className="text-center" key={testimonial.name}><Image alt="" className="mx-auto mb-7 h-20 w-20 rounded-full object-cover" height={80} src={testimonial.image} width={80} /><p className="mb-6 text-sm leading-7 text-brand-gray">{testimonial.quote}</p><h3 className="mb-2 text-xl">{testimonial.name}</h3><p className="text-xs uppercase tracking-[0.18em] text-brand-dark">{testimonial.role}</p></article>)}
        </div>
      </Container>
    </section>
  );
}
