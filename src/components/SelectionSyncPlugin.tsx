import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection } from "lexical";
// import { $getNearestNodeOfType } from "@lexical/utils";
import { HeadingNode } from "@lexical/rich-text";
import { ListNode } from "@lexical/list";
import { useEffect } from "react";

function postToRN(payload: any) {
  // @ts-ignore
  window.ReactNativeWebView?.postMessage(
    JSON.stringify({
      type: "selection-change",
      payload,
    })
  );
}

export default function SelectionSyncPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;

        // Inline formats
        const formats: string[] = [];
        if (selection.hasFormat("bold")) formats.push("BOLD");
        if (selection.hasFormat("italic")) formats.push("ITALIC");
        if (selection.hasFormat("underline")) formats.push("UNDERLINE");
        if (selection.hasFormat("code")) formats.push("CODE");

        // Block type
        let blockType: string | null = null;
        let listType: string | null = null;

        const anchorNode = selection.anchor.getNode();
        const element =
          anchorNode.getKey() === "root"
            ? anchorNode
            : anchorNode.getTopLevelElementOrThrow();

        if (element instanceof HeadingNode) {
          blockType = element.getTag(); // h1 | h2 | h3
        }

        if (element instanceof ListNode) {
          listType = element.getListType(); // bullet | number
        }

        postToRN({
          formats,
          blockType,
          listType,
        });
      });
    });
  }, [editor]);

  return null;
}