import productsJson from './products.json';
import { productsSchema } from '../lib/schemas';
import type { Product } from '../types/bundle';

const result = productsSchema.safeParse(productsJson);

if (!result.success) {
  console.error('Invalid product catalog:', result.error);
  throw new Error('Failed to load the product catalog.');
}

export const products: Product[] = result.data;