import { forwardRef, useLayoutEffect } from "react";
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  size,
} from "@floating-ui/react";
import styles from "./MentionMenuContainer.module.css";

const MentionMenuContainer = forwardRef<HTMLDivElement, any>(
  ({ children, anchorElementRef, style, ...props }, forwardedRef) => {

    const { refs, floatingStyles } = useFloating({
      placement: "bottom-start",
      strategy: "fixed",
      middleware: [
        offset(8),          // space from caret
        flip({
          fallbackPlacements: ["top-start", "bottom-end", "top-end"],
          padding: 8,
        }), // flip vertically and horizontally if not enough room
        shift({ padding: 8, crossAxis: true }), // prevent viewport overflow on both axes
        size({
          padding: 8,
          apply({ availableHeight, elements }) {
            Object.assign(elements.floating.style, {
              maxHeight: `${Math.max(availableHeight, 120)}px`,
              overflowY: "auto",
            });
          },
        }),
      ],
      whileElementsMounted: (...args) =>
        autoUpdate(...args, { animationFrame: true }),
    });

    // Keep Floating UI reference synced to Lexical's moving caret anchor.
    useLayoutEffect(() => {
      refs.setReference(anchorElementRef?.current ?? null);
    });

    return (
      <div
        ref={(node) => {
          refs.setFloating(node);
          if (typeof forwardedRef === "function") {
            forwardedRef(node);
          } else if (forwardedRef) {
            (forwardedRef as any).current = node;
          }
        }}
        {...props}
        style={{
          ...floatingStyles,
          ...style,
          zIndex: 1000,
        }}
        className={styles.menu_container}
      >
        {children}
      </div>
    );
  }
);

export default MentionMenuContainer;
