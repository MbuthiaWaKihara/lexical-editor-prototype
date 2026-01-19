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
import { MentionNode } from "../utils/MentionNode";
import MentionsPlugin from "./MentionsPlugin";
import EditorBridgePlugin from "./EditorBridgePlugin";
import { lexicalTheme } from "../utils/lexicalTheme";
import { EditorConfigProvider } from "./EditorConfigContext";
import SelectionSyncPlugin from "./SelectionSyncPlugin";

// import Toolbar from "./Toolbar";

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
    MentionNode,
  ],
};

export default function Editor() {
  return (
    <EditorConfigProvider
    >
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-page">
        {/* <Toolbar /> */}

        {/* <input
          className="editor-title"
          placeholder="Enter title (optional)"
        /> */}

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
          <MentionsPlugin />
          <EditorBridgePlugin />
          <SelectionSyncPlugin />
        </div>
      </div>
    </LexicalComposer>
    </EditorConfigProvider>
  );
}