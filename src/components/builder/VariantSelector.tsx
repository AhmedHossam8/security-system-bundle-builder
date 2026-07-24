import type { ProductVariant } from '../../types/bundle';

export interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariantId: string;
  onSelect: (variantId: string) => void;
  className?: string;
}

export function VariantSelector({
  variants,
  selectedVariantId,
  onSelect,
  className,
}: VariantSelectorProps) {
  if (variants.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap gap-2${className ? ` ${className}` : ''}`}>
      {variants.map((variant) => {
        const isSelected = variant.id === selectedVariantId;

        return (
          <button
            key={variant.id}
            type="button"
            onClick={() => onSelect(variant.id)}
            aria-pressed={isSelected}
            className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
              isSelected
                ? 'border-brand bg-brand-light text-brand'
                : 'border-border bg-surface text-secondary hover:bg-page'
            }`}
          >
            {variant.color ? (
              <span
                className="block h-4 w-4 shrink-0 rounded-full border border-border"
                style={{ backgroundColor: variant.color }}
                aria-hidden="true"
              />
            ) : (
              <img
                src={variant.image}
                alt=""
                className="block h-4 w-4 shrink-0 rounded-sm object-cover"
                aria-hidden="true"
              />
            )}
            <span>{variant.name}</span>
          </button>
        );
      })}
    </div>
  );
}
