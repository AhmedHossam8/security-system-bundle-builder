import { formatPrice } from '../../utils/pricing';

import type { Product, ProductVariant } from '../../types/bundle';

export interface ReviewItemProps {
  product: Product;
  variant?: ProductVariant;
  quantity: number;
  lineTotal: number;
  className?: string;
}

export function ReviewItem({ product, variant, quantity, lineTotal, className }: ReviewItemProps) {
  return (
    <div className={`flex items-center gap-3 py-3${className ? ` ${className}` : ''}`}>
      <img
        src={variant?.image ?? product.image}
        alt={product.name}
        className="h-12 w-12 shrink-0 rounded-md object-cover"
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-medium text-primary">{product.name}</span>
        {variant && <span className="text-xs text-secondary">{variant.name}</span>}
      </div>
      <span className="shrink-0 text-sm text-muted">&times;{quantity}</span>
      <span className="w-20 shrink-0 text-right text-sm font-medium text-primary">
        {formatPrice(lineTotal)}
      </span>
    </div>
  );
}
