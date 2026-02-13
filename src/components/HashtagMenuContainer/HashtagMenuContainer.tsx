import { forwardRef } from "react";
import styles from "./HashtagMenuContainer.module.css";

const HashtagMenuContainer = forwardRef<HTMLDivElement, any>(
  ({ children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        {...props}
        className={styles.menu_container}
      >
        {children}
      </div>
    );
  }
);

export default HashtagMenuContainer;