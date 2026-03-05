import { forwardRef, useEffect, useRef } from "react";
import { createPopper } from "@popperjs/core";
import type { Instance } from "@popperjs/core";
import styles from "./MentionMenuContainer.module.css";

const MentionMenuContainer = forwardRef<HTMLDivElement, any>(
  ({ children, anchorElementRef, style, ...props }, forwardedRef) => {
    const popperInstance = useRef<Instance | null>(null);
    const floatingRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      if (!anchorElementRef?.current || !floatingRef.current) return;

      popperInstance.current = createPopper(
        anchorElementRef.current,
        floatingRef.current,
        {
          placement: "bottom-start",
          strategy: "fixed",
          modifiers: [
            {
              name: "offset",
              options: { offset: [0, 8] },
            },
            {
              name: "flip",
              options: {
                fallbackPlacements: [
                  "top-start",
                  "bottom-end",
                  "top-end",
                ],
                padding: 8,
                boundary: "viewport",
              },
            },
            {
              name: "preventOverflow",
              options: {
                padding: 8,
                boundary: "viewport",
              },
            },
          ],
        }
      );

      return () => {
        popperInstance.current?.destroy();
        popperInstance.current = null;
      };
    }, [anchorElementRef]);

    const menu = (
      <div
        ref={(node) => {
          floatingRef.current = node;

          if (typeof forwardedRef === "function") {
            forwardedRef(node);
          } else if (forwardedRef) {
            (forwardedRef as any).current = node;
          }
        }}
        {...props}
        style={{
          ...style,
          zIndex: 9999,
        }}
        className={styles.menu_container}
      >
        {children}
      </div>
    );

    return menu;
  }
);

export default MentionMenuContainer;