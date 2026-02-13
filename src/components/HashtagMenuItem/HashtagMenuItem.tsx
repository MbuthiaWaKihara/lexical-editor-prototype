import { forwardRef } from "react";
import styles from "./HashtagMenuItem.module.css";
import data from "@emoji-mart/data";
import { init } from "emoji-mart";

init(data);

const HashtagMenuItem = forwardRef<HTMLDivElement, any>(
  ({ item, selected, ...props }, ref) => {

    return (
      <div
        ref={ref}
        {...props} 
        className={`${styles.item_container} ${selected ? styles.selected : ""}`}
      >
        {
          item.data &&
          item.data.data &&
          item.data.data.emoji ?
          (
            <span
            className={styles.item_emoji_container}
            >
              {
                //@ts-ignore
                <em-emoji 
                shortcodes={item.data.data.emoji} 
                set="apple" 
                size="15px"
                />
              }
            </span>
          ) :
          <p
          className={styles.item_hashtag}
          >
            #
          </p>
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

export default HashtagMenuItem;