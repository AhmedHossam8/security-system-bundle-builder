import { useState } from 'react';

import { formatPrice } from '../../utils/pricing';

export interface OrderSummaryProps {
  subtotal: number;
  compareAtTotal: number;
  savings: number;
  onSave?: () => void;
  onCheckout?: () => void;
  className?: string;
}

export function OrderSummary({
  subtotal,
  compareAtTotal,
  savings,
  onSave,
  onCheckout,
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
      className={`flex flex-col border-t border-border-light${className ? ` ${className}` : ''}`}
    >
      <div className="flex items-center justify-end gap-3 px-5 py-3">
        {compareAtTotal > subtotal && (
          <span className="text-lg text-muted line-through">{formatPrice(compareAtTotal)}</span>
        )}
        <span className="text-xl font-bold text-price">{formatPrice(subtotal)}</span>
      </div>

      <div className="flex flex-col gap-3 px-5 pb-5 pt-3">
        {savings > 0 && (
          <p className="text-center text-xs font-medium text-success">
            Congrats! You are saving {formatPrice(savings)} on your security bundle!
          </p>
        )}
        <button
          type="button"
          onClick={onCheckout}
          className="w-full rounded-md bg-brand-checkout px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-checkout-hover"
        >
          Checkout
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saved}
          className="w-full text-center text-sm underline text-muted transition-colors hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saved ? 'Saved!' : 'Save my system for later'}
        </button>
      </div>
    </section>
  );
}
