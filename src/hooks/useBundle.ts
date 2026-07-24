import { useCallback, useMemo, useState } from 'react';

import { initialBundleState } from '../data/initialBundle';
import { products } from '../data/products';
import { clearBundleState, loadBundleState, saveBundleState } from '../lib/storage';
import * as bundleUtils from '../utils/bundle';
import * as selectionUtils from '../utils/selections';

import type { ActiveVariants, BundleSelection, BundleState, BundleStepId } from '../types/bundle';

const MIN_QUANTITY = 0;

function getInitialState(): { state: BundleState; activeVariants: ActiveVariants } {
  const saved = loadBundleState();

  if (saved) {
    return {
      state: {
        selections: saved.selections.map((s) => ({ ...s })),
        activeStep: saved.activeStep,
      },
      activeVariants: { ...saved.activeVariants },
    };
  }

  return {
    state: {
      ...initialBundleState,
      selections: initialBundleState.selections.map((selection) => ({
        ...selection,
      })),
    },
    activeVariants: bundleUtils.getInitialActiveVariants(products, initialBundleState.selections),
  };
}

export function useBundle() {
  const [initial] = useState(getInitialState);

  const [state, setState] = useState<BundleState>(initial.state);

  const [activeVariants, setActiveVariants] = useState<ActiveVariants>(initial.activeVariants);

  /**
   * Find a product by its ID.
   */
  const getProduct = useCallback((productId: string) => {
    return bundleUtils.getProductById(products, productId);
  }, []);

  /**
   * Find a specific variant belonging to a product.
   */
  const getVariant = useCallback(
    (productId: string, variantId: string) => {
      const product = getProduct(productId);

      return product ? bundleUtils.getVariantById(product, variantId) : undefined;
    },
    [getProduct],
  );

  /**
   * Change the currently active variant for a product.
   *
   * Important:
   * This does NOT modify quantities.
   *
   * Example:
   *
   * Red × 2
   * Select Blue
   *
   * Result:
   *
   * Red × 2
   * Blue × 0
   */
  const selectVariant = useCallback(
    (productId: string, variantId: string) => {
      const product = getProduct(productId);

      if (!product) {
        console.error(`Cannot select variant. Product "${productId}" does not exist.`);
        return;
      }

      const variant = getVariant(productId, variantId);

      if (!variant) {
        console.error(
          `Cannot select variant. Variant "${variantId}" does not belong to product "${productId}".`,
        );
        return;
      }

      setActiveVariants((current) => ({
        ...current,
        [productId]: variantId,
      }));
    },
    [getProduct, getVariant],
  );

  /**
   * Returns the currently active variant ID for a product.
   */
  const getActiveVariantId = useCallback(
    (productId: string): string | undefined => {
      return activeVariants[productId];
    },
    [activeVariants],
  );

  /**
   * Find a selection in the bundle.
   */
  const findSelection = useCallback(
    (selections: BundleSelection[], productId: string, variantId?: string) => {
      return selectionUtils.findSelection(selections, productId, variantId);
    },
    [],
  );

  /**
   * Get the quantity for a product/variant combination.
   *
   * For products with variants:
   * quantity depends on both productId and variantId.
   *
   * For products without variants:
   * quantity depends only on productId.
   */
  const getQuantity = useCallback(
    (productId: string, variantId?: string): number => {
      const product = getProduct(productId);

      if (!product) {
        return 0;
      }

      if (product.variants?.length) {
        if (!variantId) {
          return 0;
        }

        const selection = state.selections.find(
          (item) => item.productId === productId && item.variantId === variantId,
        );

        return selection?.quantity ?? 0;
      }

      const selection = state.selections.find(
        (item) => item.productId === productId && item.variantId === undefined,
      );

      return selection?.quantity ?? 0;
    },
    [getProduct, state.selections],
  );

  /**
   * Update the quantity of a product/variant.
   *
   * Quantity of 0 removes the selection completely.
   */
  const setQuantity = useCallback(
    (productId: string, quantity: number, variantId?: string) => {
      const product = getProduct(productId);

      if (!product) {
        console.error(`Cannot update quantity. Product "${productId}" does not exist.`);
        return;
      }

      if (!Number.isInteger(quantity) || quantity < MIN_QUANTITY) {
        console.error(`Invalid quantity "${quantity}" for product "${productId}".`);
        return;
      }

      if (product.variants?.length) {
        if (!variantId) {
          console.error(`Product "${productId}" requires a variant ID.`);
          return;
        }

        const variant = getVariant(productId, variantId);

        if (!variant) {
          console.error(
            `Cannot update quantity. Variant "${variantId}" does not belong to product "${productId}".`,
          );
          return;
        }
      }

      if (!product.variants?.length && variantId) {
        console.error(`Product "${productId}" does not support variant IDs.`);
        return;
      }

      setState((current) => {
        const existingSelection = findSelection(current.selections, productId, variantId);

        if (quantity === 0) {
          return {
            ...current,
            selections: current.selections.filter(
              (selection) =>
                !(selection.productId === productId && selection.variantId === variantId),
            ),
          };
        }

        if (existingSelection) {
          return {
            ...current,
            selections: current.selections.map((selection) =>
              selection.productId === productId && selection.variantId === variantId
                ? {
                    ...selection,
                    quantity,
                  }
                : selection,
            ),
          };
        }

        return {
          ...current,
          selections: [
            ...current.selections,
            {
              productId,
              variantId,
              quantity,
            },
          ],
        };
      });
    },
    [findSelection, getProduct, getVariant],
  );

  /**
   * Increase quantity by one.
   */
  const incrementQuantity = useCallback(
    (productId: string, variantId?: string) => {
      const currentQuantity = getQuantity(productId, variantId);

      setQuantity(productId, currentQuantity + 1, variantId);
    },
    [getQuantity, setQuantity],
  );

  /**
   * Decrease quantity by one.
   *
   * Quantity will never go below zero.
   */
  const decrementQuantity = useCallback(
    (productId: string, variantId?: string) => {
      const currentQuantity = getQuantity(productId, variantId);

      if (currentQuantity <= MIN_QUANTITY) {
        return;
      }

      setQuantity(productId, currentQuantity - 1, variantId);
    },
    [getQuantity, setQuantity],
  );

  /**
   * Change the currently open accordion step.
   *
   * Passing null closes all steps.
   */
  const setActiveStep = useCallback((step: BundleStepId | null) => {
    setState((current) => ({
      ...current,
      activeStep: step,
    }));
  }, []);

  /**
   * Toggle an accordion step.
   *
   * If the selected step is already open, it closes.
   * Otherwise, it opens the selected step.
   */
  const toggleStep = useCallback((step: BundleStepId) => {
    setState((current) => ({
      ...current,
      activeStep: current.activeStep === step ? null : step,
    }));
  }, []);

  /**
   * Count distinct products selected in a category.
   *
   * Variants of the same product count as one distinct product.
   *
   * Example:
   *
   * Cam v4 White × 2
   * Cam v4 Black × 1
   *
   * Result:
   *
   * 1 selected
   */
  const getSelectedProductCount = useCallback(
    (category: BundleStepId): number => {
      const categorySelections = selectionUtils.getSelectionsByCategory(
        state.selections,
        products,
        category,
      );

      return selectionUtils.getDistinctProductCount(categorySelections, products);
    },
    [state.selections],
  );

  /**
   * Get all selections belonging to a category.
   */
  const getSelectionsByCategory = useCallback(
    (category: BundleStepId): BundleSelection[] => {
      return selectionUtils.getSelectionsByCategory(state.selections, products, category);
    },
    [state.selections],
  );

  /**
   * Reset the bundle to its original configuration.
   */
  const resetBundle = useCallback(() => {
    setState({
      ...initialBundleState,
      selections: initialBundleState.selections.map((selection) => ({
        ...selection,
      })),
    });
    setActiveVariants(
      bundleUtils.getInitialActiveVariants(products, initialBundleState.selections),
    );
    clearBundleState();
  }, []);

  /**
   * Save the current bundle state to localStorage.
   */
  const saveBundle = useCallback(() => {
    saveBundleState({
      selections: state.selections,
      activeStep: state.activeStep,
      activeVariants,
    });
  }, [state.selections, state.activeStep, activeVariants]);

  /**
   * Clear the saved bundle state from localStorage.
   */
  const discardSavedBundle = useCallback(() => {
    clearBundleState();
  }, []);

  /**
   * Memoized state information.
   *
   * This is useful when components need derived information
   * without recalculating it unnecessarily.
   */
  const selectedItems = useMemo(
    () => selectionUtils.getSelectedItems(state.selections),
    [state.selections],
  );

  return {
    state,
    selectedItems,
    activeVariants,

    getProduct,
    getVariant,
    getActiveVariantId,
    getQuantity,
    getSelectedProductCount,
    getSelectionsByCategory,

    setActiveStep,
    toggleStep,
    selectVariant,

    setQuantity,
    incrementQuantity,
    decrementQuantity,

    resetBundle,
    saveBundle,
    discardSavedBundle,
  };
}
