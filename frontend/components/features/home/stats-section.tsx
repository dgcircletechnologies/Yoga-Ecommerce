import { Container } from "@/components/ui/container";

const stats = [
  ["12", "Collections", "Thoughtful pieces for every ritual."],
  ["24", "Essentials", "Tools to support your practice."],
  ["100%", "Mindful", "Chosen with intention and care."],
  ["1", "Community", "Making space to move together."],
];

export function StatsSection() {
  return (
    <section className="py-12 sm:py-16">
      <Container className="grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-4">
        {stats.map(([stat, title, description]) => <div className="text-center" key={title}><span className="block font-sans text-6xl font-bold leading-none text-brand-purple/10 sm:text-8xl">{stat}</span><div className="-mt-6 px-2 sm:-mt-9"><h3 className="mb-2 text-xl">{title}</h3><p className="text-sm leading-6 text-brand-gray">{description}</p></div></div>)}
      </Container>
    </section>
  );
}
