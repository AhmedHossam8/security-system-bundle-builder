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
  Icon: React.ComponentType<{ className?: string }>;
  nextLabel: string | undefined;
}[] = [
  {
    id: 'cameras',
    title: 'Choose your cameras',
    Icon: Camera,
    nextLabel: 'Next: Choose your plan',
  },
  {
    id: 'plan',
    title: 'Choose your plan',
    Icon: Shield,
    nextLabel: 'Next: Choose your sensors',
  },
  {
    id: 'sensors',
    title: 'Choose your sensors',
    Icon: Radio,
    nextLabel: 'Next: Add extra protection',
  },
  {
    id: 'accessories',
    title: 'Add extra protection',
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
  } = useBundle();

  const reviewData = useMemo(() => {
    const grouped = selectionUtils.groupSelectionsByCategory(selectedItems, products);

    const categories: ReviewCategoryProps[] = STEPS.map((step) => {
      const categorySelections = grouped[step.id] ?? [];

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
        };
      });

      return {
        title: step.title,
        icon: <step.Icon className="h-4 w-4" />,
        itemCount: items.length,
        items,
      } as ReviewCategoryProps;
    }).filter(Boolean) as ReviewCategoryProps[];

    const subtotal = pricingUtils.calculateSubtotal(selectedItems, products);
    const compareAtTotal = pricingUtils.calculateCompareAtTotal(selectedItems, products);
    const savings = pricingUtils.calculateSavings(compareAtTotal, subtotal);
    const totalItems = selectedItems.reduce((sum, s) => sum + s.quantity, 0);

    const summary: OrderSummaryProps = { subtotal, compareAtTotal, savings, totalItems };

    return { categories, summary, hasSelections: selectedItems.length > 0 };
  }, [selectedItems]);

  return (
    <div
      className={`mx-auto flex w-full max-w-6xl flex-col gap-8 md:flex-row${className ? ` ${className}` : ''}`}
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

      <div className="w-full shrink-0 md:w-72 lg:w-80">
        <ReviewPanel {...reviewData} onSave={saveBundle} />
      </div>
    </div>
  );
}
