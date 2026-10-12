"use client";

import { useState } from "react";
import Image from "next/image";

import type { Product } from "@/types/product";
import { formatDimensions, formatWeight } from "@/utils/specifications";

type ProductDetailsTabsProps = { product: Product };

export function ProductDetailsTabs({ product }: ProductDetailsTabsProps) {
  const [activeTab, setActiveTab] = useState<"details" | "specifications" | "reviews">("details");
  const weightStr = formatWeight(product.weight, product.weightUnit);
  const dimStr = formatDimensions(product.length, product.width, product.height, product.dimensionUnit);
  const hasSpecs = Boolean(
    weightStr ||
    dimStr ||
    product.material ||
    product.color ||
    product.manufacturer ||
    product.modelNumber ||
    product.countryOfOrigin ||
    product.careInstructions
  );

  return (
    <div className="mt-8 ">
      <div className="flex flex-wrap border-b border-black/10">
        <button className={`min-w-35 flex-1 px-5 py-4 text-sm transition-colors ${activeTab === "details" ? "bg-brand-purple text-white" : "bg-brand-light-gray text-brand-dark hover:text-brand-purple"}`} onClick={() => setActiveTab("details")} type="button">Details</button>
        {hasSpecs && (
          <button className={`min-w-35 flex-1 px-5 py-4 text-sm transition-colors ${activeTab === "specifications" ? "bg-brand-purple text-white" : "bg-brand-light-gray text-brand-dark hover:text-brand-purple"}`} onClick={() => setActiveTab("specifications")} type="button">Specifications</button>
        )}
        <button className={`min-w-35 flex-1 px-5 py-4 text-sm transition-colors ${activeTab === "reviews" ? "bg-brand-purple text-white" : "bg-brand-light-gray text-brand-dark hover:text-brand-purple"}`} onClick={() => setActiveTab("reviews")} type="button">Reviews</button>
      </div>
      <div className="px-5 py-8 sm:px-8">
        {activeTab === "details" ? (
          <DetailsContent product={product} />
        ) : activeTab === "specifications" ? (
          <SpecificationsContent product={product} />
        ) : (
          <ReviewsContent />
        )}
      </div>
    </div>
  );
}

function DetailsContent({ product }: ProductDetailsTabsProps) {
  return (
    <div>
      <h2>Details</h2>
      <p className="mt-5 text-sm leading-7 text-brand-gray">{product.details ?? product.description}</p>
      <p className="mt-5 text-sm leading-7 text-brand-gray">Designed to become a considered part of your everyday ritual, this piece balances comfort, function, and a calm, lasting finish.</p>
      <h3 className="mt-8 text-2xl">Made for your practice</h3>
      <p className="mt-4 text-sm leading-7 text-brand-gray">Use it at home, in the studio, or wherever you make space to move and breathe. Each detail is chosen to support a more present practice.</p>
    </div>
  );
}

function SpecificationsContent({ product }: ProductDetailsTabsProps) {
  const specs: Array<{ label: string; value: string }> = [];
  const weightStr = formatWeight(product.weight, product.weightUnit);
  if (weightStr) specs.push({ label: "Weight", value: weightStr });
  const dimStr = formatDimensions(product.length, product.width, product.height, product.dimensionUnit);
  if (dimStr) specs.push({ label: "Dimensions", value: dimStr });
  if (product.material) specs.push({ label: "Material", value: product.material });
  if (product.color) specs.push({ label: "Color", value: product.color });
  if (product.manufacturer) specs.push({ label: "Manufacturer / Brand", value: product.manufacturer });
  if (product.modelNumber) specs.push({ label: "Model Number", value: product.modelNumber });
  if (product.countryOfOrigin) specs.push({ label: "Country of Origin", value: product.countryOfOrigin });
  if (product.careInstructions) specs.push({ label: "Care Instructions", value: product.careInstructions });

  return (
    <div>
      <h2>Product Specifications</h2>
      <div className="mt-6 overflow-hidden rounded-md border border-black/10">
        <table className="w-full border-collapse text-left text-sm">
          <tbody>
            {specs.map((item, index) => (
              <tr
                className="border-b border-black/5 last:border-0 hover:bg-brand-light-gray/50"
                key={item.label}
              >
                <th className="w-1/3 bg-brand-light-gray/60 px-5 py-3.5 font-semibold text-brand-dark sm:w-1/4">
                  {item.label}
                </th>
                <td className="px-5 py-3.5 text-brand-gray">
                  {item.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReviewsContent() {
  return (
    <div>
      <h2>Reviews</h2>
      <div className="mt-8 space-y-5">
        <Review name="Jeena Davis" image="/lotuslab/author1.jpg">Beautifully made and exactly what I needed for my daily practice.</Review>
        <Review name="David Cooper" image="/lotuslab/author3.jpg">Thoughtful quality, quick delivery, and a lovely addition to my routine.</Review>
      </div>
      {/* <h2 className="mt-12">Write Review</h2>
      <form action="#reviews" className="mt-6 space-y-5" method="get">
        <div className="grid gap-5 sm:grid-cols-2">
          <input aria-label="Name" className="w-full border-0 bg-brand-light-gray px-5 py-5 text-brand-dark outline-none transition-colors placeholder:font-serif placeholder:text-brand-dark hover:bg-brand-lavender focus:bg-brand-lavender" name="name" placeholder="Name" type="text" />
          <input aria-label="Email" className="w-full border-0 bg-brand-light-gray px-5 py-5 text-brand-dark outline-none transition-colors placeholder:font-serif placeholder:text-brand-dark hover:bg-brand-lavender focus:bg-brand-lavender" name="email" placeholder="Email" type="email" />
        </div>
        <input aria-label="Title" className="w-full border-0 bg-brand-light-gray px-5 py-5 text-brand-dark outline-none transition-colors placeholder:font-serif placeholder:text-brand-dark hover:bg-brand-lavender focus:bg-brand-lavender" name="title" placeholder="Title" type="text" />
        <p className="text-sm text-brand-dark">Rating: <span className="ml-2 tracking-widest text-brand-purple">★★★★★</span></p>
        <textarea aria-label="Review summary" className="min-h-[150px] w-full resize-y border-0 bg-brand-light-gray px-5 py-5 text-brand-dark outline-none transition-colors placeholder:font-serif placeholder:text-brand-dark hover:bg-brand-lavender focus:bg-brand-lavender" name="review" placeholder="Review Summary" />
        <button className="min-h-12 bg-brand-purple px-7 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-brand-dark" type="submit">Submit Review</button>
      </form> */}
    </div>
  );
}

function Review({ children, image, name }: { children: string; image: string; name: string }) {
  return <article className="bg-brand-light-gray p-5"><div className="flex items-center gap-5"><Image alt="" className="h-20 w-20 rounded-full object-cover" height={80} src={image} width={80} /><div><h3 className="text-xl">{name}</h3><p className="mt-2 tracking-widest text-brand-purple">★★★★★</p></div></div><p className="mt-5 text-sm leading-7 text-brand-gray">{children}</p></article>;
}
