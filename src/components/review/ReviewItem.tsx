import { Minus, Plus, Shield } from 'lucide-react';

import { formatPrice } from '../../utils/pricing';

import type { Product, ProductVariant } from '../../types/bundle';

export interface ReviewItemProps {
  product: Product;
  variant?: ProductVariant;
  quantity: number;
  lineTotal: number;
  onIncrement?: () => void;
  onDecrement?: () => void;
  className?: string;
}

export function ReviewItem({
  product,
  variant,
  quantity,
  lineTotal,
  onIncrement,
  onDecrement,
  className,
}: ReviewItemProps) {
  const compareAtLineTotal =
    product.compareAtPrice != null ? product.compareAtPrice * quantity : undefined;

  const isPlan = product.category === 'plan';

  return (
    <div className={`flex items-center gap-3 py-3${className ? ` ${className}` : ''}`}>
      {isPlan ? (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-step-open">
          <Shield className="h-6 w-6 text-brand" />
        </div>
      ) : (
        <img
          src={variant?.image ?? product.image}
          alt={product.name}
          className="h-12 w-12 shrink-0 rounded-md object-cover"
        />
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="line-clamp-2 text-sm font-medium text-primary">{product.name}</span>
        {variant && <span className="text-xs text-secondary">{variant.name}</span>}
      </div>
      {!isPlan && onIncrement && onDecrement && (
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={onDecrement}
            disabled={quantity <= 0}
            aria-label={`Decrease quantity of ${product.name}`}
            className="flex h-7 w-7 items-center justify-center rounded-sm border border-border bg-surface text-muted transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="w-6 text-center text-sm font-medium text-primary">{quantity}</span>
          <button
            type="button"
            onClick={onIncrement}
            aria-label={`Increase quantity of ${product.name}`}
            className="flex h-7 w-7 items-center justify-center rounded-sm border border-border bg-surface text-muted transition-colors hover:border-primary hover:text-primary"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
      )}
      <div className="flex w-20 shrink-0 flex-col items-end gap-0.5">
        {compareAtLineTotal != null && (
          <span className="text-xs text-muted line-through">{formatPrice(compareAtLineTotal)}</span>
        )}
        <span className="text-sm font-medium text-price">{formatPrice(lineTotal)}</span>
      </div>
    </div>
  );
}
