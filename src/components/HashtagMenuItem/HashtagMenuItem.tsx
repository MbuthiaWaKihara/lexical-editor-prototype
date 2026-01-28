import { forwardRef } from "react";
import styles from "./HashtagMenuItem.module.css";

const HashtagMenuItem = forwardRef<HTMLDivElement, any>(
  ({ item, selected, ...props }, ref) => {
    return (
      <div
        ref={ref}
        {...props} 
        className={`${styles.item_container} ${selected ? styles.selected : ""}`}
      >
        {item.value}
      </div>
    );
  }
);

export default HashtagMenuItem;