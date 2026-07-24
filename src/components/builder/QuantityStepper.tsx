import { Minus, Plus } from 'lucide-react';

export interface QuantityStepperProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  disabled?: boolean;
  decrementDisabled?: boolean;
  incrementDisabled?: boolean;
  ariaLabel?: string;
  className?: string;
}

export function QuantityStepper({
  value,
  onIncrement,
  onDecrement,
  disabled = false,
  decrementDisabled = false,
  incrementDisabled = false,
  ariaLabel,
  className,
}: QuantityStepperProps) {
  return (
    <div
      className={`inline-flex items-center rounded-md border border-border bg-surface h-9 select-none${className ? ` ${className}` : ''}`}
    >
      <button
        type="button"
        disabled={disabled || decrementDisabled}
        onClick={onDecrement}
        aria-label={ariaLabel ? `Decrease quantity for ${ariaLabel}` : 'Decrease quantity'}
        className="flex items-center justify-center w-9 h-full rounded-l-md text-secondary hover:bg-page active:bg-border-light disabled:text-disabled transition-colors"
      >
        <Minus className="w-4 h-4" />
      </button>
      <div className="w-px h-4 bg-border" />
      <span className="flex items-center justify-center min-w-[3ch] px-3 h-full text-sm font-medium text-primary">
        {value}
      </span>
      <div className="w-px h-4 bg-border" />
      <button
        type="button"
        disabled={disabled || incrementDisabled}
        onClick={onIncrement}
        aria-label={ariaLabel ? `Increase quantity for ${ariaLabel}` : 'Increase quantity'}
        className="flex items-center justify-center w-9 h-full rounded-r-md text-secondary hover:bg-page active:bg-border-light disabled:text-disabled transition-colors"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
