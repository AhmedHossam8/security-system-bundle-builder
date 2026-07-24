import type { BundleState } from '../types/bundle';

export const initialBundleState: BundleState = {
  selections: [
    {
      productId: 'wyze-cam-v4',
      variantId: 'white',
      quantity: 1,
    },
    {
      productId: 'wyze-cam-pan-v3',
      variantId: 'white',
      quantity: 2,
    },
    {
      productId: 'wyze-sense-motion-sensor',
      quantity: 2,
    },
    {
      productId: 'wyze-sense-hub',
      quantity: 1,
    },
    {
      productId: 'wyze-microsd-card-256gb',
      quantity: 2,
    },
    {
      productId: 'cam-unlimited',
      quantity: 1,
    },
  ],
  activeStep: 'cameras',
};
