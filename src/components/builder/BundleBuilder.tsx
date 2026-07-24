import { useMemo } from 'react';
import { Camera, Lock, Radio, Shield } from 'lucide-react';

import { products } from '../../data/products';
import { useBundle } from '../../hooks/useBundle';
import * as bundleUtils from '../../utils/bundle';
import * as pricingUtils from '../../utils/pricing';
import * as selectionUtils from '../../utils/selections';
import { BuilderStep } from './BuilderStep';
import { ProductGrid } from './ProductGrid';
import { ReviewPanel } from '../review/ReviewPanel';
import type { BundleStepId } from '../../types/bundle';
import type { ReviewCategoryProps } from '../review/ReviewCategory';
import type { OrderSummaryProps } from '../review/OrderSummary';

const STEPS: {
  id: BundleStepId;
  title: string;
  reviewTitle: string;
  Icon: React.ComponentType<{ className?: string }>;
  nextLabel: string | undefined;
}[] = [
  {
    id: 'cameras',
    title: 'Cameras',
    reviewTitle: 'Cameras',
    Icon: Camera,
    nextLabel: 'Next: Plan',
  },
  {
    id: 'plan',
    title: 'Plan',
    reviewTitle: 'Plan',
    Icon: Shield,
    nextLabel: 'Next: Sensors',
  },
  {
    id: 'sensors',
    title: 'Sensors',
    reviewTitle: 'Sensors',
    Icon: Radio,
    nextLabel: 'Next: Accessories',
  },
  {
    id: 'accessories',
    title: 'Add extra protection',
    reviewTitle: 'Accessories',
    Icon: Lock,
    nextLabel: undefined,
  },
];

export interface BundleBuilderProps {
  className?: string;
}

export function BundleBuilder({ className }: BundleBuilderProps) {
  const {
    state,
    selectedItems,
    getQuantity,
    getActiveVariantId,
    selectVariant,
    incrementQuantity,
    decrementQuantity,
    getSelectedProductCount,
    setActiveStep,
    toggleStep,
    saveBundle,
    resetBundle,
  } = useBundle();

  const reviewData = useMemo(() => {
    const grouped = selectionUtils.groupSelectionsByCategory(selectedItems, products);

    const REVIEW_ORDER = ['cameras', 'sensors', 'accessories', 'plan'] as const;

    const categories: ReviewCategoryProps[] = REVIEW_ORDER.map((id) => {
      const step = STEPS.find((s) => s.id === id);
      const categorySelections = grouped[id] ?? [];

      if (categorySelections.length === 0) {
        return null;
      }

      const items = categorySelections.map((selection) => {
        const product = bundleUtils.getProductById(products, selection.productId)!;
        const variant = selection.variantId
          ? bundleUtils.getVariantById(product, selection.variantId)
          : undefined;

        return {
          product,
          variant,
          quantity: selection.quantity,
          lineTotal: pricingUtils.calculateItemTotal(product, selection.quantity),
          onIncrement: () => incrementQuantity(selection.productId, selection.variantId),
          onDecrement: () => decrementQuantity(selection.productId, selection.variantId),
        };
      });

      return {
        title: step?.reviewTitle ?? id,
        items,
      } as ReviewCategoryProps;
    }).filter(Boolean) as ReviewCategoryProps[];

    const subtotal = pricingUtils.calculateSubtotal(selectedItems, products);
    const compareAtTotal = pricingUtils.calculateCompareAtTotal(selectedItems, products);
    const savings = pricingUtils.calculateSavings(compareAtTotal, subtotal);

    const summary: OrderSummaryProps = { subtotal, compareAtTotal, savings };

    return { categories, summary, hasSelections: selectedItems.length > 0 };
  }, [selectedItems, incrementQuantity, decrementQuantity]);

  return (
    <div
      className={`flex w-full flex-col gap-6 lg:flex-row lg:gap-8${className ? ` ${className}` : ''}`}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        {STEPS.map((step, index) => {
          const stepProducts = products.filter((p) => p.category === step.id);

          return (
            <BuilderStep
              key={step.id}
              stepNumber={index + 1}
              totalSteps={STEPS.length}
              title={step.title}
              selectedCount={getSelectedProductCount(step.id)}
              isOpen={state.activeStep === step.id}
              icon={<step.Icon className="h-5 w-5" />}
              nextLabel={step.nextLabel}
              onToggle={() => toggleStep(step.id)}
              onNext={
                index < STEPS.length - 1 ? () => setActiveStep(STEPS[index + 1].id) : undefined
              }
            >
              <ProductGrid
                products={stepProducts}
                selectedItems={selectedItems}
                getQuantity={getQuantity}
                getActiveVariantId={getActiveVariantId}
                selectVariant={selectVariant}
                incrementQuantity={incrementQuantity}
                decrementQuantity={decrementQuantity}
              />
            </BuilderStep>
          );
        })}
      </div>

      <div className="w-full shrink-0 lg:w-80 lg:self-start lg:sticky lg:top-8 xl:w-96">
        <ReviewPanel {...reviewData} onSave={saveBundle} onCheckout={resetBundle} />
      </div>
    </div>
  );
}
