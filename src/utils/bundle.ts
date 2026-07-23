import type {
  ActiveVariants,
  BundleSelection,
  BundleState,
  Product,
  ProductVariant,
} from '../types/bundle';

export function getProductById(products: Product[], productId: string): Product | undefined {
  return products.find((product) => product.id === productId);
}

export function getVariantById(product: Product, variantId: string): ProductVariant | undefined {
  return product.variants?.find((variant) => variant.id === variantId);
}

export function getInitialActiveVariants(
  products: Product[],
  selections: BundleSelection[],
): ActiveVariants {
  const initialVariants: ActiveVariants = {};

  for (const product of products) {
    if (!product.variants?.length) continue;

    const initialSelection = selections.find(
      (selection) => selection.productId === product.id && selection.variantId,
    );

    if (initialSelection?.variantId) {
      initialVariants[product.id] = initialSelection.variantId;
    } else {
      initialVariants[product.id] = product.variants[0].id;
    }
  }

  return initialVariants;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateBundleSelection(
  selection: BundleSelection,
  products: Product[],
): ValidationResult {
  const product = getProductById(products, selection.productId);

  if (!product) {
    return { valid: false, error: `Product "${selection.productId}" does not exist.` };
  }

  if (!Number.isInteger(selection.quantity)) {
    return { valid: false, error: 'Quantity must be an integer.' };
  }

  if (selection.quantity < 0) {
    return { valid: false, error: 'Quantity cannot be negative.' };
  }

  const hasVariants = !!product.variants?.length;

  if (hasVariants && !selection.variantId) {
    return {
      valid: false,
      error: `Product "${product.id}" requires a variant selection.`,
    };
  }

  if (hasVariants && selection.variantId) {
    const variant = getVariantById(product, selection.variantId);
    if (!variant) {
      return {
        valid: false,
        error: `Variant "${selection.variantId}" does not belong to product "${product.id}".`,
      };
    }
  }

  if (!hasVariants && selection.variantId) {
    return {
      valid: false,
      error: `Product "${product.id}" does not support variants.`,
    };
  }

  return { valid: true };
}

export interface BundleValidationResult {
  valid: boolean;
  errors: Array<{ selection: BundleSelection; error: string }>;
}

export function validateBundle(bundle: BundleState, products: Product[]): BundleValidationResult {
  const errors: Array<{ selection: BundleSelection; error: string }> = [];

  for (const selection of bundle.selections) {
    const result = validateBundleSelection(selection, products);
    if (!result.valid) {
      errors.push({ selection, error: result.error! });
    }
  }

  return { valid: errors.length === 0, errors };
}
