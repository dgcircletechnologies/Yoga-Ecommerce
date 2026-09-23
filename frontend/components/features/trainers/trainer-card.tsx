import Link from "next/link";
import type { Trainer } from "@/types/trainer";

export function TrainerCard({ trainer }: { trainer: Trainer }) {
  return <article className="group bg-white shadow-sm"><div className="aspect-[4/4.2] overflow-hidden bg-brand-light-gray">{trainer.profileImageUrl ? <img alt={trainer.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" src={trainer.profileImageUrl} /> : <div className="flex h-full items-center justify-center font-serif text-7xl text-brand-purple/50">{trainer.name.charAt(0)}</div>}</div><div className="p-6"><h3 className="font-serif text-2xl">{trainer.name}</h3>{(trainer.specialty || trainer.experience) && <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-purple">{[trainer.specialty, trainer.experience].filter(Boolean).join(" · ")}</p>}<p className="mt-3 line-clamp-3 min-h-18 text-sm leading-6 text-brand-dark">{trainer.aboutMe || "Here to support your practice."}</p><Link className="mt-5 inline-block text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-purple" href={`/trainers/${trainer.id}`}>View profile →</Link></div></article>;
}
