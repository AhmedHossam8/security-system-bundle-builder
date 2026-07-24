import { z } from 'zod';

export const productVariantSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  color: z.string().optional(),
  image: z.string().min(1),
});

export const productCategorySchema = z.enum(['cameras', 'sensors', 'accessories', 'plan']);

export const productSchema = z.object({
  id: z.string().min(1),
  category: productCategorySchema,
  name: z.string().min(1),
  description: z.string().optional(),
  image: z.string().min(1).optional(),
  discountLabel: z.string().optional(),
  compareAtPrice: z.number().nonnegative().optional(),
  price: z.number().nonnegative(),
  billingPeriod: z.enum(['monthly', 'one-time']).optional(),
  variants: z.array(productVariantSchema).optional(),
  isRequired: z.boolean().optional(),
});

export const productsSchema = z.array(productSchema);

export const bundleStepIdSchema = z.enum(['cameras', 'plan', 'sensors', 'accessories']);

export const bundleSelectionSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().min(1).optional(),
  quantity: z.number().int().nonnegative(),
});

export const bundleStateSchema = z.object({
  selections: z.array(bundleSelectionSchema),
  activeStep: bundleStepIdSchema.nullable(),
});
