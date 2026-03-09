import React from 'react';
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
import { getEditorRuntimeConfig } from "../utils/editorRuntimeConfig";
import PasteNormalizationPlugin from './PasteNormalizationPlugin';
import HeightSyncPlugin from './HeightSyncPlugin';
import CommentInputScrollPlugin from './CommentInputScrollPlugin';

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

  const params = new URLSearchParams(window.location.search);
  const isCommentMode = params.get("comment") === "true";

  const [editorPlaceholder, setEditorPlaceholder] = React.useState<string>("");
  const [dynamicCss, setDynamicCss] = React.useState<string>('');

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      const { placeholder, css } = getEditorRuntimeConfig();

      if (placeholder) {
        setEditorPlaceholder(placeholder);
      }

      if(css) {
        setDynamicCss(css);
      }
    }, 200);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
    <style id="rn-dynamic-style">{`
      *{background-color: transparent;}
      html,body{
        visibility: visible;
        background-color: ${isCommentMode ? '#EEEEEE' : '#FFFFFF'}
      }
      ${dynamicCss}
    `}</style>
    <EditorConfigProvider>
      <LexicalComposer initialConfig={initialConfig}>
        <div className="editor-page">
          <div className="editor-inner">
            <RichTextPlugin
              contentEditable={
                <ContentEditable 
                className="editor-input" 
                spellCheck={true}
                // autoCorrect="on"
                autoCapitalize="sentences"
                />
              }
              placeholder={
                <div className="editor-placeholder">
                  {editorPlaceholder}
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />

            <HistoryPlugin />
            <ListPlugin />
            <LinkPlugin />
            <MentionsPlugin 
            />
            <HashtagsPlugin 
            />
            <EditorBridgePlugin />
            <SelectionSyncPlugin />
            <PasteNormalizationPlugin />
            <HeightSyncPlugin />
            <CommentInputScrollPlugin />
          </div>
        </div>
      </LexicalComposer>
    </EditorConfigProvider>
    </>
  );
}
