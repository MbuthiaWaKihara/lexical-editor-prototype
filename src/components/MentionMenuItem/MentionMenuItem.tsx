import { forwardRef } from "react";
import styles from "./MentionMenuItem.module.css";

const MentionMenuItem = forwardRef<HTMLDivElement, any>(
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

export default MentionMenuItem;