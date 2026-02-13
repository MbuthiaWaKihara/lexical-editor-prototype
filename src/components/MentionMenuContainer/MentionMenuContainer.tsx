import { forwardRef } from "react";
import styles from "./MentionMenuContainer.module.css";

const MentionMenuContainer = forwardRef<HTMLDivElement, any>(
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

export default MentionMenuContainer;