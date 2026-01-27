import {
  BeautifulMentionsPlugin,
} from "lexical-beautiful-mentions";
import MentionMenuItem from "./MentionMenuItem";
import { getEditorRuntimeConfig } from '../utils/editorRuntimeConfig';
import axios from 'axios';

const MentionsPlugin = () => {

  /**
   * onSearch handler for beautiful mentions
   * @param trigger the trigger character, e.g. "@"
   * @param query the text after the trigger
   */
  const onSearchMentions: any = async (trigger: string, query: string) => {
    console.log('EVANS: ', trigger)
    try {
      const { mentionsUrl, accessToken } = getEditorRuntimeConfig();
      if (!mentionsUrl || !accessToken) return [];
  
      const res = await axios.get(
        `${mentionsUrl}?search=${encodeURIComponent(query)}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
  
      // The plugin expects an array of items with `value` and optional `data`.
      return (
        res.data?.data?.map((m: any) => ({
          value: m.user.full_name,
          data: m.user,
        })) ?? []
      );
    } catch (err) {
      console.error("mentions search failed", err);
      return [];
    }
  }
  
  return (
    <BeautifulMentionsPlugin
      triggers={["@"]}       // listen for "@" mentions
      onSearch={onSearchMentions} // async handler
      menuItemComponent={MentionMenuItem}
    />
  )
}

export default MentionsPlugin