export type BundleStepId = 'cameras' | 'plan' | 'sensors' | 'accessories';

export type ProductCategory = 'cameras' | 'sensors' | 'accessories' | 'plan';

export interface ProductVariant {
  id: string;
  name: string;
  color?: string;
  image: string;
}

export interface Product {
  id: string;
  category: ProductCategory;
  name: string;
  description?: string;
  image: string;
  discountLabel?: string;
  compareAtPrice?: number;
  price: number;
  billingPeriod?: 'monthly' | 'one-time';
  variants?: ProductVariant[];
  isRequired?: boolean;
}

export interface BundleSelection {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface BundleState {
  selections: BundleSelection[];
  activeStep: BundleStepId | null;
}

export interface ActiveVariants {
  [productId: string]: string;
}
