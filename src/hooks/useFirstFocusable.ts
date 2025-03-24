import { useEffect, useRef } from "react";

export const useFirstFocusable = ({
  withinRef,
  trackedState,
  fallbackRef,
  updateState
}: { 
  withinRef: React.RefObject<HTMLElement | null>, 
  trackedState: boolean, 
  fallbackRef?: React.RefObject<HTMLElement | null>,
  updateState?: unknown
}) => {
  const focusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!withinRef.current || !trackedState) return;
  
    const targetElement = withinRef.current.firstElementChild || withinRef.current;
    const selectedEl = targetElement.querySelector("[data-selected]");
  
    let firstFocusable: HTMLElement | null = null;
  
    if (selectedEl === null) {
      const inputs = targetElement.querySelectorAll("input");
      const input = Array.from(inputs).find((input: HTMLInputElement) => !input.disabled && input.tabIndex >= 0);
      firstFocusable = input as HTMLElement | null;
    } else if (selectedEl instanceof HTMLElement) {
      firstFocusable = selectedEl;
    }
  
    if (!firstFocusable) {
      const focusableElements = withinRef.current.querySelectorAll("a, button, input, select");
      const element = Array.from(focusableElements).find(element => {
        const htmlElement = element as HTMLAnchorElement | HTMLButtonElement | HTMLInputElement | HTMLSelectElement;
        if (htmlElement instanceof HTMLAnchorElement) return true;
        return !htmlElement.disabled && htmlElement.tabIndex >= 0;
      });
      firstFocusable = element as HTMLElement | null;
    }
  
    if (firstFocusable) {
      firstFocusable.focus({ preventScroll: true });
      withinRef.current.scrollTop = 0;
      focusedElement.current = firstFocusable;
    } else {
      if (fallbackRef?.current) {
        fallbackRef.current.focus({ preventScroll: true });
        focusedElement.current = fallbackRef.current;
      } else {
        focusedElement.current = null;
      }
    }
  }, [trackedState, withinRef, fallbackRef, updateState]);

  return focusedElement.current;
}