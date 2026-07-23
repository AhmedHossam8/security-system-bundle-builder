import type { BundleSelection, Product, ProductCategory } from '../types/bundle';

export function getSelectionKey(productId: string, variantId?: string): string {
  if (variantId) {
    return `${productId}:${variantId}`;
  }

  return productId;
}

export function findSelection(
  selections: BundleSelection[],
  productId: string,
  variantId?: string,
): BundleSelection | undefined {
  return selections.find(
    (selection) => selection.productId === productId && selection.variantId === variantId,
  );
}

export function getSelectedItems(selections: BundleSelection[]): BundleSelection[] {
  return selections.filter((selection) => selection.quantity > 0);
}

export function getDistinctProductCount(
  selections: BundleSelection[],
  products: Product[],
): number {
  const productIds = new Set<string>();

  for (const selection of selections) {
    if (selection.quantity <= 0) continue;

    const product = products.find((p) => p.id === selection.productId);
    if (!product || product.isRequired) continue;

    productIds.add(product.id);
  }

  return productIds.size;
}

export function getSelectionsByCategory(
  selections: BundleSelection[],
  products: Product[],
  category: ProductCategory,
): BundleSelection[] {
  return selections.filter((selection) => {
    if (selection.quantity <= 0) return false;

    const product = products.find((p) => p.id === selection.productId);
    return product?.category === category;
  });
}

export function groupSelectionsByCategory(
  selections: BundleSelection[],
  products: Product[],
): Record<ProductCategory, BundleSelection[]> {
  const grouped: Record<ProductCategory, BundleSelection[]> = {
    cameras: [],
    sensors: [],
    accessories: [],
    plan: [],
  };

  for (const selection of selections) {
    if (selection.quantity <= 0) continue;

    const product = products.find((p) => p.id === selection.productId);
    if (!product) continue;

    grouped[product.category].push(selection);
  }

  return grouped;
}
