import type { ActiveVariants, BundleSelection, BundleStepId } from '../types/bundle';

export interface SavedBundleState {
  selections: BundleSelection[];
  activeStep: BundleStepId | null;
  activeVariants: ActiveVariants;
}

const STORAGE_KEY = 'security-system-bundle';

export function saveBundleState(state: SavedBundleState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    console.error('Failed to save bundle state to localStorage.');
  }
}

export function loadBundleState(): SavedBundleState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as SavedBundleState;

    if (!Array.isArray(parsed.selections)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function clearBundleState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    console.error('Failed to clear bundle state from localStorage.');
  }
}
