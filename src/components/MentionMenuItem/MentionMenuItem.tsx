import { forwardRef } from "react";
import styles from "./MentionMenuItem.module.css";
import miscUtils from "../../utils/miscUtils";
import { colors } from "../../utils/data";

const MentionMenuItem = forwardRef<HTMLDivElement, any>(
  ({ item, selected, onClick, onMouseDown, onTouchStart, ...props }, ref) => {
    return (
      <div
        ref={ref}
        {...props}
        onTouchStart={(e) => {
          console.log("[MentionMenuItem] onTouchStart", item?.value);
          if (typeof onTouchStart === "function") onTouchStart(e);
        }}
        onMouseDown={(e) => {
          console.log("[MentionMenuItem] onMouseDown", item?.value);
          if (typeof onMouseDown === "function") onMouseDown(e);
        }}
        onClick={(e) => {
          console.log("[MentionMenuItem] onClick", item?.value);
          if (typeof onClick === "function") onClick(e);
        }}
        className={`${styles.item_container} ${selected ? styles.selected : ""}`}
      >
        {
          item.data &&
          item.data.data &&
          item.data.data.profile_image ?
          <img
          src={item.data.data.profile_image}
          className={styles.item_image}
          /> :
          <div
          style={{
            //@ts-ignore
            backgroundColor: colors[miscUtils.getColorInitial(item.value)]
          }}
          className={styles.item_no_image_container}
          >
            <p
            className={styles.item_no_image_text}
            >
              {miscUtils.getNameInitials(item.value)}
            </p>
          </div>
        }
        <p
        className={styles.item_text}
        >
          {item.value}
        </p>
      </div>
    );
  }
);

export default MentionMenuItem;