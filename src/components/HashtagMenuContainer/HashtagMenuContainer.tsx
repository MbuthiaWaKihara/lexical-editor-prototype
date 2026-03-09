import { Children, forwardRef, useLayoutEffect, useMemo, useRef } from "react";
import type { CSSProperties } from "react";
import styles from "./HashtagMenuContainer.module.css";
import { getEditorRuntimeConfig } from "../../utils/editorRuntimeConfig";

const HashtagMenuContainer = forwardRef<HTMLDivElement, any>(
  ({ children, style, className, ...props }, forwardedRef) => {
    const localRef = useRef<HTMLDivElement | null>(null);
    const hasVisibleContent = useMemo(() => {
      return Children.toArray(children).some((child) => {
        if (child === null || child === undefined) {
          return false;
        }
        if (typeof child === "string") {
          return child.trim().length > 0;
        }
        return true;
      });
    }, [children]);

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

    const runtimeConfig = getEditorRuntimeConfig();
    const isCommentingInput =
      runtimeConfig.isCommentingInput ?? false;
    const menuMaxHeight = isCommentingInput
      ? "min(120px, calc(100vh - 16px))"
      : "min(160px, calc(100vh - 16px))";

    const mergedStyle: CSSProperties = {
      ...(style as CSSProperties),
      maxHeight: menuMaxHeight,
      ...(hasVisibleContent
        ? null
        : {
            border: "0",
            background: "transparent",
            boxShadow: "none",
            padding: "0",
            minHeight: "0",
            overflow: "hidden",
          }),
    };

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
        style={mergedStyle}
        className={[styles.menu_container, className].filter(Boolean).join(" ")}
      >
        {children}
      </div>
    );
  }
);

export default HashtagMenuContainer;
