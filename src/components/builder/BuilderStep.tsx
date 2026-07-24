import { ChevronDown, ChevronUp } from 'lucide-react';
import type { ReactNode } from 'react';

export interface BuilderStepProps {
  stepNumber: number;
  totalSteps: number;
  title: string;
  selectedCount: number;
  isOpen: boolean;
  icon?: ReactNode;
  children: ReactNode;
  nextLabel?: string;
  onToggle: () => void;
  onNext?: () => void;
  className?: string;
}

export function BuilderStep({
  stepNumber,
  totalSteps,
  title,
  selectedCount,
  isOpen,
  icon,
  children,
  nextLabel,
  onToggle,
  onNext,
  className,
}: BuilderStepProps) {
  const displayStep = Math.max(1, stepNumber);
  const displayTotal = Math.max(1, totalSteps);
  const displayCount = Math.max(0, selectedCount);

  return (
    <section
      className={`rounded-lg border border-border bg-surface shadow-card${className ? ` ${className}` : ''}`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full flex-col gap-1 px-6 py-4 text-left transition-colors hover:bg-page"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            Step {displayStep} of {displayTotal}
          </span>
          <span className="text-sm font-medium text-secondary">{displayCount} SELECTED</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-base font-semibold text-primary">
            {icon && <span aria-hidden="true">{icon}</span>}
            {title}
          </span>
          <span aria-hidden="true" className="text-muted">
            {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="border-t border-border px-6 py-4">
          {children}

          {nextLabel && onNext && (
            <div className="mt-6">
              <button
                type="button"
                onClick={onNext}
                className="rounded-md bg-brand px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-hover"
              >
                {nextLabel}
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
