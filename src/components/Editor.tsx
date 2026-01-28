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
import { lexicalTheme } from "../utils/lexicalTheme";
import { EditorConfigProvider } from "./EditorConfigContext";
import SelectionSyncPlugin from "./SelectionSyncPlugin";
import EditorBridgePlugin from "./EditorBridgePlugin";
import MentionsPlugin from "./MentionsPlugin";
import { BeautifulMentionNode } from "lexical-beautiful-mentions";
import HashtagsPlugin from "./HashtagsPlugin";

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
    BeautifulMentionNode, // register the beautiful mention node
  ],
};

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
            <MentionsPlugin />
            <HashtagsPlugin />
            <EditorBridgePlugin />
            <SelectionSyncPlugin />
          </div>
        </div>
      </LexicalComposer>
    </EditorConfigProvider>
  );
}