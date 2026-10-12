"use client";

import { useEffect, useState } from "react";
import { CloseIcon } from "@/components/ui/icons";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import type { Category } from "@/types/category";
import type { Product, ProductAvailability } from "@/types/admin-product";

type FormProduct = Product & { imageFile?: File; removeImage?: boolean };
type Props = { categories: Category[]; product?: Product; isSubmitting?: boolean; onClose: () => void; onSubmit: (product: FormProduct) => void };

export function ProductFormModal({ categories, product, isSubmitting, onClose, onSubmit }: Props) {
  const firstCategory = categories[0];
  const [values, setValues] = useState({
    name: product?.name ?? "",
    description: product?.description ?? "",
    categoryId: product?.categoryId ?? firstCategory?.id ?? "",
    price: product ? String(product.price) : "",
    stock: product ? String(product.stock) : "0",
    shippingIncluded: product?.shippingIncluded ?? true,
    taxIncluded: product?.taxIncluded ?? true,
    availability: product?.availability ?? ("Available" as ProductAvailability),
    tags: product?.tags ?? [],
    weight: product?.weight !== null && product?.weight !== undefined ? String(product.weight) : "",
    weightUnit: product?.weightUnit ?? "g",
    length: product?.length !== null && product?.length !== undefined ? String(product.length) : "",
    width: product?.width !== null && product?.width !== undefined ? String(product.width) : "",
    height: product?.height !== null && product?.height !== undefined ? String(product.height) : "",
    dimensionUnit: product?.dimensionUnit ?? "cm",
    material: product?.material ?? "",
    color: product?.color ?? "",
    manufacturer: product?.manufacturer ?? "",
    modelNumber: product?.modelNumber ?? "",
    countryOfOrigin: product?.countryOfOrigin ?? "",
    careInstructions: product?.careInstructions ?? "",
  });
  const [imageFile, setImageFile] = useState<File>();
  const [removeImage, setRemoveImage] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", close);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", close);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  function update(key: string, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
    setError("");
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = values.name.trim();
    const price = Number(values.price);
    const stock = Number(values.stock);
    if (!name) return setError("Product name is required.");
    if (!values.categoryId) return setError("Category is required.");
    if (!Number.isFinite(price) || price < 0) return setError("Price must be a valid non-negative number.");
    if (!Number.isInteger(stock) || stock < 0) return setError("Stock must be a non-negative whole number.");
    const category = categories.find((item) => item.id === values.categoryId);
    if (!category) return setError("Select a category.");

    const weightNum = values.weight.trim() !== "" ? Number(values.weight) : null;
    if (weightNum !== null && (!Number.isFinite(weightNum) || weightNum <= 0)) {
      return setError("Weight must be a positive number.");
    }
    const lengthNum = values.length.trim() !== "" ? Number(values.length) : null;
    if (lengthNum !== null && (!Number.isFinite(lengthNum) || lengthNum <= 0)) {
      return setError("Length must be a positive number.");
    }
    const widthNum = values.width.trim() !== "" ? Number(values.width) : null;
    if (widthNum !== null && (!Number.isFinite(widthNum) || widthNum <= 0)) {
      return setError("Width must be a positive number.");
    }
    const heightNum = values.height.trim() !== "" ? Number(values.height) : null;
    if (heightNum !== null && (!Number.isFinite(heightNum) || heightNum <= 0)) {
      return setError("Height must be a positive number.");
    }

    onSubmit({
      id: product?.id ?? "",
      name,
      description: values.description.trim(),
      categoryId: category.id,
      categoryName: category.name,
      price,
      stock,
      image: product?.image ?? "",
      tags: values.tags,
      shippingIncluded: values.shippingIncluded,
      taxIncluded: values.taxIncluded,
      availability: values.availability,
      weight: weightNum,
      weightUnit: weightNum !== null ? values.weightUnit : (values.weightUnit.trim() || null),
      length: lengthNum,
      width: widthNum,
      height: heightNum,
      dimensionUnit: (lengthNum !== null || widthNum !== null || heightNum !== null) ? values.dimensionUnit : (values.dimensionUnit.trim() || null),
      material: values.material.trim() || null,
      color: values.color.trim() || null,
      manufacturer: values.manufacturer.trim() || null,
      modelNumber: values.modelNumber.trim() || null,
      countryOfOrigin: values.countryOfOrigin.trim() || null,
      careInstructions: values.careInstructions.trim() || null,
      createdAt: product?.createdAt ?? "",
      updatedAt: product?.updatedAt ?? "",
      imageFile,
      removeImage: removeImage && !imageFile,
    });
  }

  function addTag() {
    const tag = tagInput.trim();
    if (!tag || values.tags.some((item) => item.toLowerCase() === tag.toLowerCase())) return;
    setValues((current) => ({ ...current, tags: [...current.tags, tag] }));
    setTagInput("");
  }
  const input = "mt-2 h-11 w-full rounded-md border border-black/10 bg-white px-4 text-sm outline-none focus:border-brand-purple";

  return (
    <div aria-labelledby="product-form-title" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-brand-dark/45 px-5 py-8" role="dialog">
      <div className="my-auto w-full max-w-3xl bg-white p-7 shadow-brand sm:p-10">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-purple">Product management</p>
            <h2 className="mt-2 text-3xl" id="product-form-title">{product ? "Edit Product" : "Add Product"}</h2>
          </div>
          <button aria-label="Close product form" className="h-9 w-9 text-brand-gray" onClick={onClose} type="button">
            <CloseIcon />
          </button>
        </div>
        <form className="mt-8 grid gap-5 sm:grid-cols-2" onSubmit={submit}>
          <label className="text-sm font-semibold sm:col-span-2">
            Product Name
            <input className={input} onChange={(event) => update("name", event.target.value)} value={values.name} />
          </label>
          <label className="text-sm font-semibold sm:col-span-2">
            Description
            <textarea className="mt-2 min-h-24 w-full resize-y rounded-md border border-black/10 p-4 text-sm outline-none focus:border-brand-purple" maxLength={500} onChange={(event) => update("description", event.target.value)} value={values.description} />
          </label>
          <label className="text-sm font-semibold">
            Category
            <select className={input} onChange={(event) => update("categoryId", event.target.value)} value={values.categoryId}>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </label>
          <label className="text-sm font-semibold">
            Availability
            <select className={input} onChange={(event) => update("availability", event.target.value)} value={values.availability}>
              <option>Available</option>
              <option>Unavailable</option>
            </select>
          </label>
          <label className="text-sm font-semibold">
            Price ($)
            <input className={input} min="0" step="0.01" type="number" onChange={(event) => update("price", event.target.value)} value={values.price} />
          </label>
          <label className="text-sm font-semibold">
            Stock
            <input className={input} min="0" step="1" type="number" onChange={(event) => update("stock", event.target.value)} value={values.stock} />
          </label>
          <fieldset className="sm:col-span-2">
            <legend className="text-sm font-semibold">Shipping & tax</legend>
            <label className="mt-2 flex cursor-pointer items-start gap-3 rounded-md border border-black/10 p-4">
              <input checked={values.shippingIncluded} className="mt-1 h-4 w-4 accent-brand-purple" onChange={(event) => { setValues((current) => ({ ...current, shippingIncluded: event.target.checked })); setError(""); }} type="checkbox" />
              <span>
                <span className="block text-sm font-semibold">Shipping included in product cost</span>
                <span className="mt-1 block text-xs font-normal text-brand-gray">{values.shippingIncluded ? "Shipping included in cost" : "Free shipping"}</span>
              </span>
            </label>
            <label className="mt-2 flex cursor-pointer items-start gap-3 rounded-md border border-black/10 p-4">
              <input checked={values.taxIncluded} className="mt-1 h-4 w-4 accent-brand-purple" onChange={(event) => { setValues((current) => ({ ...current, taxIncluded: event.target.checked })); setError(""); }} type="checkbox" />
              <span>
                <span className="block text-sm font-semibold">Sales tax included in product cost</span>
                <span className="mt-1 block text-xs font-normal text-brand-gray">{values.taxIncluded ? "Estimated sales tax included in cost" : "Estimated sales tax not included in cost"}</span>
              </span>
            </label>
          </fieldset>

          {/* Physical Specifications */}
          <div className="border-t border-black/10 pt-5 sm:col-span-2">
            <h3 className="text-base font-semibold text-brand-dark">Physical Specifications</h3>
            <p className="mt-1 text-xs text-brand-gray">Optional physical measurements for this product.</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold">
                Weight (optional)
                <input className={input} min="0" placeholder="e.g. 500 or 1.2" step="0.001" type="number" onChange={(event) => update("weight", event.target.value)} value={values.weight} />
              </label>
              <label className="text-sm font-semibold">
                Weight Unit
                <select className={input} onChange={(event) => update("weightUnit", event.target.value)} value={values.weightUnit}>
                  <option value="g">Grams (g)</option>
                  <option value="kg">Kilograms (kg)</option>
                  <option value="lb">Pounds (lb)</option>
                  <option value="oz">Ounces (oz)</option>
                </select>
              </label>
              <div className="grid grid-cols-3 gap-2 sm:col-span-2">
                <label className="text-sm font-semibold">
                  Length
                  <input className={input} min="0" placeholder="e.g. 20" step="0.01" type="number" onChange={(event) => update("length", event.target.value)} value={values.length} />
                </label>
                <label className="text-sm font-semibold">
                  Width
                  <input className={input} min="0" placeholder="e.g. 15" step="0.01" type="number" onChange={(event) => update("width", event.target.value)} value={values.width} />
                </label>
                <label className="text-sm font-semibold">
                  Height
                  <input className={input} min="0" placeholder="e.g. 5" step="0.01" type="number" onChange={(event) => update("height", event.target.value)} value={values.height} />
                </label>
              </div>
              <label className="text-sm font-semibold sm:col-span-2">
                Dimension Unit
                <select className={input} onChange={(event) => update("dimensionUnit", event.target.value)} value={values.dimensionUnit}>
                  <option value="cm">Centimeters (cm)</option>
                  <option value="in">Inches (in)</option>
                  <option value="m">Meters (m)</option>
                  <option value="mm">Millimeters (mm)</option>
                </select>
              </label>
            </div>
          </div>

          {/* Additional Specifications */}
          <div className="border-t border-black/10 pt-5 sm:col-span-2">
            <h3 className="text-base font-semibold text-brand-dark">Additional Specifications</h3>
            <p className="mt-1 text-xs text-brand-gray">Optional composition, identification, and care details.</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold">
                Material (optional)
                <input className={input} placeholder="e.g. 100% Organic Cotton" onChange={(event) => update("material", event.target.value)} value={values.material} />
              </label>
              <label className="text-sm font-semibold">
                Color (optional)
                <input className={input} placeholder="e.g. Lavender / Purple" onChange={(event) => update("color", event.target.value)} value={values.color} />
              </label>
              <label className="text-sm font-semibold">
                Manufacturer / Brand (optional)
                <input className={input} placeholder="e.g. Sattva Essentials" onChange={(event) => update("manufacturer", event.target.value)} value={values.manufacturer} />
              </label>
              <label className="text-sm font-semibold">
                Model Number (optional)
                <input className={input} placeholder="e.g. YM-2026-X" onChange={(event) => update("modelNumber", event.target.value)} value={values.modelNumber} />
              </label>
              <label className="text-sm font-semibold sm:col-span-2">
                Country of Origin (optional)
                <input className={input} placeholder="e.g. India" onChange={(event) => update("countryOfOrigin", event.target.value)} value={values.countryOfOrigin} />
              </label>
              <label className="text-sm font-semibold sm:col-span-2">
                Care Instructions (optional)
                <textarea className="mt-2 min-h-20 w-full resize-y rounded-md border border-black/10 p-4 text-sm outline-none focus:border-brand-purple" maxLength={500} onChange={(event) => update("careInstructions", event.target.value)} placeholder="e.g. Wipe clean with a damp cloth and mild detergent. Air dry." value={values.careInstructions} />
              </label>
            </div>
          </div>

          <label className="text-sm font-semibold sm:col-span-2">
            Tags
            <div className="mt-2 flex gap-2">
              <input className="h-11 min-w-0 flex-1 rounded-md border border-black/10 px-4 text-sm outline-none" onChange={(event) => setTagInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addTag(); } }} placeholder="Type a tag and press Enter" value={tagInput} />
              <button className="h-11 border border-brand-purple px-4 text-[10px] font-semibold uppercase text-brand-purple" onClick={addTag} type="button">Add</button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {values.tags.map((tag) => (
                <span className="rounded-full bg-brand-purple/10 px-3 py-1.5 text-xs text-brand-purple" key={tag}>
                  {tag} <button onClick={() => setValues((current) => ({ ...current, tags: current.tags.filter((item) => item !== tag) }))} type="button">×</button>
                </span>
              ))}
            </div>
          </label>
          <ImageUploadField disabled={isSubmitting} existingImage={product?.image} file={imageFile} label="Product image" onFileChange={(file) => { setImageFile(file); setRemoveImage(false); }} onRemove={() => setRemoveImage(true)} />
          {error && <p className="text-xs text-red-600 sm:col-span-2">{error}</p>}
          <div className="flex justify-end gap-3 sm:col-span-2">
            <button className="min-h-12 border border-brand-purple px-7 text-[11px] font-semibold uppercase text-brand-purple" onClick={onClose} type="button">Cancel</button>
            <button className="min-h-12 bg-brand-purple px-7 text-[11px] font-semibold uppercase text-white disabled:opacity-60" disabled={isSubmitting} type="submit">{isSubmitting ? "Saving…" : product ? "Save Changes" : "Add Product"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
