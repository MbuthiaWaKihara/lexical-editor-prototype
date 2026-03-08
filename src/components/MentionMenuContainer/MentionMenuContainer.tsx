import { forwardRef, useLayoutEffect, useRef } from "react";
import styles from "./MentionMenuContainer.module.css";

const MentionMenuContainer = forwardRef<HTMLDivElement, any>(
  ({ children, style, className, ...props }, forwardedRef) => {
    const localRef = useRef<HTMLDivElement | null>(null);

    useLayoutEffect(() => {
      const node = localRef.current;
      if (!node) return;

      let frame = 0;
      const requestReposition = () => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          window.dispatchEvent(new Event("resize"));
        });
      };

      requestReposition();
      const observer = new ResizeObserver(requestReposition);
      observer.observe(node);

      return () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
      };
    }, [children]);

    return (
      <div
        ref={(node) => {
          localRef.current = node;
          if (typeof forwardedRef === "function") {
            forwardedRef(node);
          } else if (forwardedRef) {
            (forwardedRef as any).current = node;
          }
        }}
        {...props}
        style={style}
        className={[styles.menu_container, className].filter(Boolean).join(" ")}
      >
        {children}
      </div>
    );
  }
);

export default MentionMenuContainer;
