import {
  BeautifulMentionsPlugin,
} from "lexical-beautiful-mentions";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import HashtagMenuItem from "./HashtagMenuItem";
import HashtagMenuContainer from "./HashtagMenuContainer";
import { beginMentionSession } from "../utils/mentionSession";

const HashtagsPlugin = () => {
  const [editor] = useLexicalComposerContext();

  /**
   * The query is owned by the native bottom sheet, not the editor. So instead of
   * searching here and rendering an in-WebView menu, we simply detect the "#"
   * trigger, tell React Native to open the picker, and return no results so the
   * (invisible) menu never shows anything.
   */
  const onSearchHashtags: any = async (trigger: string) => {
    beginMentionSession(editor, trigger);
    return [];
  };

  return (
    <BeautifulMentionsPlugin
      triggers={["#"]}       // listen for "#" mentions
      onSearch={onSearchHashtags}
      searchDelay={0}
      creatable={false}
      menuItemComponent={HashtagMenuItem}
      menuComponent={HashtagMenuContainer}
      autoSpace={false}
    />
  );
};

export default HashtagsPlugin;
