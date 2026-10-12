export function formatWeight(weight?: number | null, unit?: string | null): string {
  if (weight === null || weight === undefined || Number.isNaN(Number(weight)) || Number(weight) <= 0) return "";
  return `${Number(weight)} ${unit?.trim() || "g"}`.trim();
}

export function formatDimensions(
  length?: number | null,
  width?: number | null,
  height?: number | null,
  unit?: string | null
): string {
  const parts: number[] = [];
  if (length !== null && length !== undefined && Number(length) > 0) parts.push(Number(length));
  if (width !== null && width !== undefined && Number(width) > 0) parts.push(Number(width));
  if (height !== null && height !== undefined && Number(height) > 0) parts.push(Number(height));
  if (!parts.length) return "";
  return `${parts.join(" × ")} ${unit?.trim() || "cm"}`.trim();
}

export function hasProductSpecifications(spec?: {
  weight?: number | null;
  length?: number | null;
  width?: number | null;
  height?: number | null;
  material?: string | null;
  color?: string | null;
  manufacturer?: string | null;
  modelNumber?: string | null;
  countryOfOrigin?: string | null;
  careInstructions?: string | null;
}): boolean {
  if (!spec) return false;
  return Boolean(
    (spec.weight && Number(spec.weight) > 0) ||
    (spec.length && Number(spec.length) > 0) ||
    (spec.width && Number(spec.width) > 0) ||
    (spec.height && Number(spec.height) > 0) ||
    spec.material?.trim() ||
    spec.color?.trim() ||
    spec.manufacturer?.trim() ||
    spec.modelNumber?.trim() ||
    spec.countryOfOrigin?.trim() ||
    spec.careInstructions?.trim()
  );
}

