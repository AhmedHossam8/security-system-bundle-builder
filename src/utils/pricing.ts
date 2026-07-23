import type { BundleSelection, Product } from '../types/bundle';

function roundToCents(value: number): number {
  return Math.round(value * 100) / 100;
}

export function calculateItemTotal(product: Product, quantity: number): number {
  return roundToCents(product.price * quantity);
}

export function calculateSelectionTotal(selection: BundleSelection, product: Product): number {
  return calculateItemTotal(product, selection.quantity);
}

export function calculateSubtotal(selections: BundleSelection[], products: Product[]): number {
  let total = 0;

  for (const selection of selections) {
    if (selection.quantity <= 0) continue;

    const product = products.find((p) => p.id === selection.productId);
    if (!product) continue;

    total += product.price * selection.quantity;
  }

  return roundToCents(total);
}

export function calculateCompareAtTotal(
  selections: BundleSelection[],
  products: Product[],
): number {
  let total = 0;

  for (const selection of selections) {
    if (selection.quantity <= 0) continue;

    const product = products.find((p) => p.id === selection.productId);
    if (!product) continue;

    const price = product.compareAtPrice ?? product.price;
    total += price * selection.quantity;
  }

  return roundToCents(total);
}

export function calculateSavings(compareAtTotal: number, subtotal: number): number {
  const savings = compareAtTotal - subtotal;
  return savings < 0 ? 0 : roundToCents(savings);
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export function formatPrice(price: number): string {
  return currencyFormatter.format(price);
}
