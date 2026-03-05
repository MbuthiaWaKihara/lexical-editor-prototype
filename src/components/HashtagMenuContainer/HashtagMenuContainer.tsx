import { forwardRef, useEffect } from "react";
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
} from "@floating-ui/react";
import styles from "./HashtagMenuContainer.module.css";

const HashtagMenuContainer = forwardRef<HTMLDivElement, any>(
  ({ children, anchorElementRef, style, ...props }, forwardedRef) => {

    const { refs, floatingStyles } = useFloating({
      placement: "bottom-start",
      middleware: [
        offset(8),          // space from caret
        flip({ fallbackPlacements: ["top-start", "bottom-end", "top-end"] }),             // flip vertically and horizontally if not enough room
        shift({ padding: 8 }) // prevent viewport overflow
      ],
      whileElementsMounted: autoUpdate,
    });

    // Attach Lexical's anchor (caret position)
    useEffect(() => {
      if (anchorElementRef?.current) {
        refs.setReference(anchorElementRef.current);
      }
    }, [anchorElementRef, refs]);

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

export default HashtagMenuContainer;