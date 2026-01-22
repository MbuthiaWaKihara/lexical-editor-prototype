import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HeadingNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { LinkNode } from "@lexical/link";
import { HashtagNode } from "@lexical/hashtag";
import { HashtagPlugin } from "@lexical/react/LexicalHashtagPlugin";

import {
  BeautifulMentionsPlugin,
  BeautifulMentionNode,
} from "lexical-beautiful-mentions"; // ✅ only these exports exist :contentReference[oaicite:2]{index=2}

import { lexicalTheme } from "../utils/lexicalTheme";
import { EditorConfigProvider } from "./EditorConfigContext";
import SelectionSyncPlugin from "./SelectionSyncPlugin";
import EditorBridgePlugin from "./EditorBridgePlugin";

import axios from "axios";
import { getEditorRuntimeConfig } from "../utils/editorRuntimeConfig";

const initialConfig = {
  namespace: "LexicalEditor",
  theme: lexicalTheme,
  onError(error: Error) {
    throw error;
  },
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    LinkNode,
    HashtagNode,
    BeautifulMentionNode, // register the beautiful mention node
  ],
};

/**
 * onSearch handler for beautiful mentions
 * @param trigger the trigger character, e.g. "@"
 * @param query the text after the trigger
 */
const onSearchMentions: any = async (trigger: string, query: string) => {
  console.log(trigger)
  try {
    const { mentionsUrl, accessToken } = getEditorRuntimeConfig();
    if (!mentionsUrl || !accessToken) return [];

    const res = await axios.get(
      `${mentionsUrl}?q=${encodeURIComponent(query)}`,
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

const MobileMenuItem = ({ item, selected, select }: any) => {
  console.log(selected)
  return (
    <div
      style={{ padding: 8 }}
      onTouchStart={() => select(item)}
      onClick={() => select(item)}
    >
      {item.value}
    </div>
  );
}

export default function Editor() {
  return (
    <EditorConfigProvider>
      <LexicalComposer initialConfig={initialConfig}>
        <div className="editor-page">
          <div className="editor-inner">
            <RichTextPlugin
              contentEditable={<ContentEditable className="editor-input" />}
              placeholder={
                <div className="editor-placeholder">
                  Create a post. Use @ for members and # for channels
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />

            <HistoryPlugin />
            <ListPlugin />
            <LinkPlugin />
            <HashtagPlugin />

            {/* ================= Beautiful Mentions ================= */}
            <BeautifulMentionsPlugin
              triggers={["@"]}       // listen for "@" mentions
              onSearch={onSearchMentions} // async handler
              menuItemComponent={MobileMenuItem}
            />

            <EditorBridgePlugin />
            <SelectionSyncPlugin />
          </div>
        </div>
      </LexicalComposer>
    </EditorConfigProvider>
  );
}