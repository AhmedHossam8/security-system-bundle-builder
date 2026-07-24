import { ReviewItem } from './ReviewItem';
import type { ReactNode } from 'react';
import type { ReviewItemProps } from './ReviewItem';

export interface ReviewCategoryProps {
  title: string;
  icon?: ReactNode;
  itemCount: number;
  items: ReviewItemProps[];
  className?: string;
}

export function ReviewCategory({ title, icon, itemCount, items, className }: ReviewCategoryProps) {
  if (items.length === 0) return null;

  return (
    <section
      className={`rounded-lg border border-border bg-surface shadow-card${className ? ` ${className}` : ''}`}
    >
      <div className="flex items-center gap-2 border-b border-border px-5 py-3">
        {icon && (
          <span aria-hidden="true" className="text-muted">
            {icon}
          </span>
        )}
        <h3 className="text-sm font-semibold text-primary">{title}</h3>
        <span className="ml-auto text-xs font-medium text-muted">
          {itemCount} item{itemCount !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="divide-y divide-border-light px-5">
        {items.map((item, index) => (
          <ReviewItem key={index} {...item} />
        ))}
      </div>
    </section>
  );
}
