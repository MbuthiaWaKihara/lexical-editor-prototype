import styles from './MentionMenuItem.module.css';

const MentionMenuItem = (props: any) => {
  return (
    <div
      className={styles.item_container}
      onClick={() => {
        console.log('EVANS: ', props.item);
        // props.select(props.item)
      }}
    >
      {props.item.value}
    </div>
  )
}

export default MentionMenuItem;