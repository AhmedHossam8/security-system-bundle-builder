import { ReviewItem } from './ReviewItem';
import type { ReviewItemProps } from './ReviewItem';

export interface ReviewCategoryProps {
  title: string;
  items: ReviewItemProps[];
  className?: string;
}

export function ReviewCategory({ title, items, className }: ReviewCategoryProps) {
  if (items.length === 0) return null;

  return (
    <section className={`flex flex-col gap-2${className ? ` ${className}` : ''}`}>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">{title}</h3>
      <div>
        {items.map((item, index) => (
          <ReviewItem key={index} {...item} />
        ))}
      </div>
    </section>
  );
}
