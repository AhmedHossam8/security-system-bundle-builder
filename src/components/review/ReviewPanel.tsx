import { OrderSummary } from './OrderSummary';
import { ReviewCategory } from './ReviewCategory';
import type { ReviewCategoryProps } from './ReviewCategory';
import type { OrderSummaryProps } from './OrderSummary';

export interface ReviewPanelProps {
  categories: ReviewCategoryProps[];
  summary: OrderSummaryProps;
  hasSelections: boolean;
  onSave?: () => void;
  className?: string;
}

export function ReviewPanel({
  categories,
  summary,
  hasSelections,
  onSave,
  className,
}: ReviewPanelProps) {
  if (!hasSelections) {
    return (
      <aside
        className={`rounded-lg border border-border bg-surface p-5 text-center shadow-card${className ? ` ${className}` : ''}`}
      >
        <p className="text-sm text-muted">Your system summary will appear here</p>
      </aside>
    );
  }

  return (
    <aside className={`flex flex-col gap-4${className ? ` ${className}` : ''}`}>
      <h2 className="text-lg font-bold text-primary">System Summary</h2>
      {categories.map((category, index) => (
        <ReviewCategory key={index} {...category} />
      ))}
      <OrderSummary {...summary} onSave={onSave} />
    </aside>
  );
}
