"use client";

type QuantitySelectorProps = { quantity: number; onDecrease: () => void; onIncrease: () => void; onChange: (quantity: number) => void };

export function QuantitySelector({ quantity, onDecrease, onIncrease, onChange }: QuantitySelectorProps) {
  return (
    <div className="inline-flex h-11 items-center border border-black/15">
      <button aria-label="Decrease quantity" className="flex h-full w-10 items-center justify-center text-lg text-brand-dark transition-colors hover:bg-brand-light-gray disabled:cursor-not-allowed disabled:opacity-40" disabled={quantity <= 1} onClick={onDecrease} type="button">−</button>
      <input aria-label="Quantity" className="h-full w-10 border-x border-black/10 bg-transparent text-center text-sm text-brand-dark outline-none focus:bg-brand-light-gray" min="1" onChange={(event) => onChange(Number(event.target.value))} type="number" value={quantity} />
      <button aria-label="Increase quantity" className="flex h-full w-10 items-center justify-center text-lg text-brand-dark transition-colors hover:bg-brand-light-gray" onClick={onIncrease} type="button">+</button>
    </div>
  );
}
