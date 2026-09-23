"use client";
import { useEffect, useState } from "react";
import { getTrainers } from "@/api/trainers.api";
import type { Trainer } from "@/types/trainer";
import { Container } from "@/components/ui/container";
import { TrainerCard } from "./trainer-card";

export function TrainersList() { const [items, setItems] = useState<Trainer[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(""); useEffect(() => { getTrainers().then(setItems).catch(() => setError("Unable to load trainers. Please try again.")).finally(() => setLoading(false)); }, []); return <Container className="py-16 sm:py-20 lg:py-24"><div className="mb-10 text-center sm:mb-14"><span className="mb-4 inline-block text-sm uppercase tracking-[0.14em] text-brand-purple">Meet the team</span><h2>Experienced guidance</h2><p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-brand-gray">Thoughtful support from people who believe in a steadier, more joyful practice.</p></div>{loading ? <div className="py-20 text-center text-sm text-brand-gray">Loading trainers…</div> : error ? <div className="py-20 text-center text-sm text-red-600">{error}</div> : items.length === 0 ? <div className="py-20 text-center text-sm text-brand-gray">No trainers available yet.</div> : <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{items.map((trainer) => <TrainerCard key={trainer.id} trainer={trainer} />)}</div>}</Container>; }
