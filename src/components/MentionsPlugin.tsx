import {
  BeautifulMentionsPlugin,
} from "lexical-beautiful-mentions";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import MentionMenuItem from "./MentionMenuItem";
import MentionMenuContainer from "./MentionMenuContainer";
import { beginMentionSession } from "../utils/mentionSession";

const MentionsPlugin = () => {
  const [editor] = useLexicalComposerContext();

  /**
   * The query is owned by the native bottom sheet, not the editor. So instead of
   * searching here and rendering an in-WebView menu, we simply detect the "@"
   * trigger, tell React Native to open the picker, and return no results so the
   * (invisible) menu never shows anything.
   */
  const onSearchMentions: any = async (trigger: string) => {
    beginMentionSession(editor, trigger);
    return [];
  };

  return (
    <BeautifulMentionsPlugin
      triggers={["@"]}       // listen for "@" mentions
      onSearch={onSearchMentions}
      searchDelay={0}
      creatable={false}
      menuItemComponent={MentionMenuItem}
      menuComponent={MentionMenuContainer}
      autoSpace={false}
    />
  );
};

export default MentionsPlugin;
