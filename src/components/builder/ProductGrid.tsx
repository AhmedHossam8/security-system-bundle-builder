import { useBundle } from '../../hooks/useBundle';
import { ProductCard } from './ProductCard';
import type { Product } from '../../types/bundle';

export interface ProductGridProps {
  products: Product[];
  className?: string;
}

export function ProductGrid({ products, className }: ProductGridProps) {
  const {
    selectedItems,
    getQuantity,
    getActiveVariantId,
    selectVariant,
    incrementQuantity,
    decrementQuantity,
  } = useBundle();

  if (products.length === 0) {
    return null;
  }

  return (
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
              hasVariants ? (variantId: string) => selectVariant(product.id, variantId) : undefined
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
            isSelected={isProductSelected}
          />
        );
      })}
    </div>
  );
}
