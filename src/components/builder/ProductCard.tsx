import { Shield } from 'lucide-react';

import { QuantityStepper } from './QuantityStepper';
import { VariantSelector } from './VariantSelector';
import { formatPrice } from '../../utils/pricing';
import type { Product } from '../../types/bundle';

export interface ProductCardProps {
  product: Product;
  quantity: number;
  activeVariantId?: string;
  onSelectVariant?: (variantId: string) => void;
  onIncrement: () => void;
  onDecrement: () => void;
  onLearnMore?: () => void;
  isSelected?: boolean;
  className?: string;
}

export function ProductCard({
  product,
  quantity,
  activeVariantId,
  onSelectVariant,
  onIncrement,
  onDecrement,
  onLearnMore,
  isSelected,
  className,
}: ProductCardProps) {
  const selected = isSelected ?? quantity > 0;

  return (
    <div
      className={`flex gap-4 rounded-lg border p-4 bg-surface shadow-card transition-colors ${
        selected ? 'border-brand' : 'border-border'
      }${className ? ` ${className}` : ''}`}
    >
      <div className="w-24 shrink-0 sm:w-28">
        {product.category === 'plan' ? (
          <div className="flex aspect-square w-full items-center justify-center rounded-md bg-step-open">
            <Shield className="h-10 w-10 text-brand" />
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.name}
            className="aspect-square w-full rounded-md object-cover"
          />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-primary">
            {product.name}
            {product.isRequired && (
              <span className="ml-2 inline-flex items-center rounded-sm bg-page px-1.5 py-0.5 text-xs font-medium text-muted">
                Required
              </span>
            )}
          </h3>
          {product.discountLabel && (
            <span className="shrink-0 rounded-sm bg-discount px-1.5 py-0.5 text-xs font-semibold text-white">
              {product.discountLabel}
            </span>
          )}
        </div>

        {product.description && <p className="text-sm text-secondary">{product.description}</p>}

        {onLearnMore && (
          <button
            type="button"
            onClick={onLearnMore}
            className="self-start text-sm font-medium text-brand transition-colors hover:text-brand-hover"
          >
            Learn More →
          </button>
        )}

        {product.variants && product.variants.length > 0 && onSelectVariant && activeVariantId && (
          <VariantSelector
            variants={product.variants}
            selectedVariantId={activeVariantId}
            onSelect={onSelectVariant}
          />
        )}

        <div className="mt-auto flex items-center justify-between gap-4">
          {product.category !== 'plan' && (
            <QuantityStepper
              value={quantity}
              onIncrement={onIncrement}
              onDecrement={onDecrement}
              decrementDisabled={quantity <= 0}
              ariaLabel={product.name}
            />
          )}

          <div className={`flex flex-wrap items-center gap-x-2 gap-y-1 min-w-0${product.category === 'plan' ? ' ml-auto' : ''}`}>
            <span className="text-base font-semibold text-price">
              {formatPrice(product.price)}
              {product.billingPeriod === 'monthly' && (
                <span className="text-sm font-normal text-secondary">/mo</span>
              )}
            </span>
            {product.compareAtPrice && (
              <span className="text-sm text-muted line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
