import {
  BeautifulMentionsPlugin,
} from "lexical-beautiful-mentions";
import MentionMenuItem from "./MentionMenuItem";
import { getEditorRuntimeConfig } from '../utils/editorRuntimeConfig';
import axios from 'axios';

const HashtagsPlugin = () => {

  /**
   * onSearch handler for beautiful mentions
   * @param trigger the trigger character, e.g. "@"
   * @param query the text after the trigger
   */
  const onSearchHashtags: any = async (trigger: string, query: string) => {
    console.log('EVANS: ', trigger)
    try {
      const { hashtagsUrl, accessToken } = getEditorRuntimeConfig();
      if (!hashtagsUrl || !accessToken) return [];
  
      const res = await axios.get(
        `${hashtagsUrl}?search=${encodeURIComponent(query)}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
  
      // The plugin expects an array of items with `value` and optional `data`.
      return (
        res.data?.data?.map((m: any) => ({
          value: m.name,
          data: m,
        })) ?? []
      );
    } catch (err) {
      console.error("hashtags search failed", err);
      return [];
    }
  }
  
  return (
    <BeautifulMentionsPlugin
      triggers={["#"]}       // listen for "#" mentions
      onSearch={onSearchHashtags} // async handler
      menuItemComponent={MentionMenuItem}
    />
  )
}

export default HashtagsPlugin