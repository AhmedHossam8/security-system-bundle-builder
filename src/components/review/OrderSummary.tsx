import { useState } from 'react';

import { formatPrice } from '../../utils/pricing';

export interface OrderSummaryProps {
  subtotal: number;
  compareAtTotal: number;
  savings: number;
  totalItems: number;
  onSave?: () => void;
  className?: string;
}

export function OrderSummary({
  subtotal,
  compareAtTotal,
  savings,
  totalItems,
  onSave,
  className,
}: OrderSummaryProps) {
  const [saved, setSaved] = useState(false);

  function handleSave() {
    onSave?.();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <section
      className={`rounded-lg border border-border bg-surface shadow-card${className ? ` ${className}` : ''}`}
    >
      <div className="px-5 py-4">
        <h3 className="mb-3 text-sm font-semibold text-primary">Order Summary</h3>
        <div className="divide-y divide-border-light">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-secondary">
              Subtotal ({totalItems} item{totalItems !== 1 ? 's' : ''})
            </span>
            <span className="text-sm font-medium text-primary">{formatPrice(subtotal)}</span>
          </div>
          {compareAtTotal > subtotal && (
            <>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-secondary">Compare at</span>
                <span className="text-sm text-muted line-through">
                  {formatPrice(compareAtTotal)}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-medium text-success">Savings</span>
                <span className="text-sm font-medium text-success">-{formatPrice(savings)}</span>
              </div>
            </>
          )}
          <div className="flex items-center justify-between py-2">
            <span className="text-sm font-semibold text-primary">Total</span>
            <span className="text-base font-bold text-primary">{formatPrice(subtotal)}</span>
          </div>
        </div>
      </div>
      <div className="border-t border-border px-5 py-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={saved}
          className="w-full rounded-md bg-brand px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saved ? 'Saved!' : 'Save My System for Later'}
        </button>
      </div>
    </section>
  );
}
