import { useState } from 'react';
import { Shield } from 'lucide-react';

import { ProductCard } from './ProductCard';
import { Modal } from '../ui/Modal';
import { formatPrice } from '../../utils/pricing';

import type { BundleSelection, Product } from '../../types/bundle';

export interface ProductGridProps {
  products: Product[];
  selectedItems: BundleSelection[];
  getQuantity: (productId: string, variantId?: string) => number;
  getActiveVariantId: (productId: string) => string | undefined;
  selectVariant: (productId: string, variantId: string) => void;
  incrementQuantity: (productId: string, variantId?: string) => void;
  decrementQuantity: (productId: string, variantId?: string) => void;
  className?: string;
}

export function ProductGrid({
  products,
  selectedItems,
  getQuantity,
  getActiveVariantId,
  selectVariant,
  incrementQuantity,
  decrementQuantity,
  className,
}: ProductGridProps) {
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  if (products.length === 0) {
    return null;
  }

  return (
    <>
      <div className={`grid grid-cols-1 gap-4${className ? ` ${className}` : ''}`}>
        {products.map((product) => {
          const hasVariants = product.variants && product.variants.length > 0;
          const activeVariantId = hasVariants ? getActiveVariantId(product.id) : undefined;

          const quantity = hasVariants
            ? getQuantity(product.id, activeVariantId)
            : getQuantity(product.id);

          const isProductSelected = selectedItems.some((s) => s.productId === product.id);

          return (
            <ProductCard
              key={product.id}
              product={product}
              quantity={quantity}
              activeVariantId={activeVariantId}
              onSelectVariant={
                hasVariants
                  ? (variantId: string) => selectVariant(product.id, variantId)
                  : undefined
              }
              onIncrement={
                hasVariants
                  ? () => incrementQuantity(product.id, activeVariantId)
                  : () => incrementQuantity(product.id)
              }
              onDecrement={
                hasVariants
                  ? () => decrementQuantity(product.id, activeVariantId)
                  : () => decrementQuantity(product.id)
              }
              onLearnMore={() => setDetailProduct(product)}
              isSelected={isProductSelected}
            />
          );
        })}
      </div>

      {detailProduct && (
        <Modal
          isOpen={detailProduct !== null}
          onClose={() => setDetailProduct(null)}
          title={detailProduct.name}
        >
          <div className="flex flex-col gap-4">
            {detailProduct.category === 'plan' ? (
              <div className="flex aspect-video w-full items-center justify-center rounded-md bg-step-open">
                <Shield className="h-16 w-16 text-brand" />
              </div>
            ) : detailProduct.image ? (
              <img
                src={detailProduct.image}
                alt={detailProduct.name}
                className="w-full rounded-md object-cover"
              />
            ) : null}
            {detailProduct.description && (
              <p className="text-sm text-secondary">{detailProduct.description}</p>
            )}
            {detailProduct.variants && detailProduct.variants.length > 0 && (
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Available Colors
                </span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {detailProduct.variants.map((variant) => (
                    <span
                      key={variant.id}
                      className="rounded-sm bg-page px-2 py-1 text-xs font-medium text-secondary"
                    >
                      {variant.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-center justify-between border-t border-border pt-4">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-primary">
                  {formatPrice(detailProduct.price)}
                </span>
                {detailProduct.billingPeriod === 'monthly' && (
                  <span className="text-sm text-secondary">/mo</span>
                )}
                {detailProduct.compareAtPrice && (
                  <span className="text-sm text-muted line-through">
                    {formatPrice(detailProduct.compareAtPrice)}
                  </span>
                )}
              </div>
              {detailProduct.discountLabel && (
                <span className="rounded-sm bg-discount px-1.5 py-0.5 text-xs font-semibold text-white">
                  {detailProduct.discountLabel}
                </span>
              )}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
