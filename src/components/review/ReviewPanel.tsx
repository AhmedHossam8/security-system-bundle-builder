import { CreditCard, ShieldCheck, Truck } from 'lucide-react';

import { OrderSummary } from './OrderSummary';
import { ReviewCategory } from './ReviewCategory';
import { formatPrice } from '../../utils/pricing';
import type { ReviewCategoryProps } from './ReviewCategory';
import type { OrderSummaryProps } from './OrderSummary';

export interface ReviewPanelProps {
  categories: ReviewCategoryProps[];
  summary: OrderSummaryProps;
  hasSelections: boolean;
  onSave?: () => void;
  onCheckout?: () => void;
  className?: string;
}

export function ReviewPanel({
  categories,
  summary,
  hasSelections,
  onSave,
  onCheckout,
  className,
}: ReviewPanelProps) {
  if (!hasSelections) {
    return (
      <aside
        className={`flex flex-col gap-3 rounded-lg border border-border bg-review-bg p-5${className ? ` ${className}` : ''}`}
      >
        <span className="text-xs font-semibold uppercase tracking-wider text-muted">Review</span>
        <h2 className="text-lg font-bold text-primary">Your Security System</h2>
        <p className="text-sm leading-relaxed text-secondary">
          Review your personalized protection system designed to keep what matters most safe.
        </p>
      </aside>
    );
  }

  return (
    <aside
      className={`flex flex-col rounded-lg border border-border bg-review-bg lg:rounded-none lg:border-0${className ? ` ${className}` : ''}`}
    >
      <div className="flex flex-col gap-1 px-5 pt-5">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted">Review</span>
        <h2 className="text-lg font-bold text-primary">Your Security System</h2>
        <p className="text-sm leading-relaxed text-secondary">
          Review your personalized protection system designed to keep what matters most safe.
        </p>
      </div>

      <div className="divide-y divide-border-light px-5">
        {categories.map((category, index) => (
          <ReviewCategory key={index} {...category} className="py-3" />
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-border-light px-5 py-3">
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-muted" />
          <span className="text-sm text-secondary">Delivery</span>
        </div>
        <span className="text-sm font-medium text-primary">{formatPrice(5)}</span>
      </div>

      {summary.subtotal > 0 && (
        <>
          <div className="flex items-center gap-2 border-t border-border-light px-5 py-3">
            <ShieldCheck className="h-4 w-4 text-success" />
            <span className="text-xs text-secondary">100% satisfaction guaranteed</span>
          </div>
          <div className="flex items-center gap-2 border-t border-border-light px-5 py-3">
            <CreditCard className="h-4 w-4 text-muted" />
            <span className="text-xs text-secondary">
              or {formatPrice(summary.subtotal / 4)}/mo with 4 interest-free installments
            </span>
          </div>
        </>
      )}

      <OrderSummary {...summary} onSave={onSave} onCheckout={onCheckout} />
    </aside>
  );
}
