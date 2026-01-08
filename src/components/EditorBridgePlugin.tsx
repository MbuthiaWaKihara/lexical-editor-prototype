import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  FORMAT_TEXT_COMMAND,
  $getSelection,
  $isRangeSelection,
} from "lexical";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { $createHeadingNode } from "@lexical/rich-text";
import { $generateHtmlFromNodes } from "@lexical/html";
import { useEffect } from "react";

type EditorCommand =
  | { type: "bold" }
  | { type: "italic" }
  | { type: "underline" }
  | { type: "strike" }
  | { type: "h1" }
  | { type: "h2" }
  | { type: "h3" }
  | { type: "ordered-list" }
  | { type: "unordered-list" }
  | { type: "remove-list" }
  | { type: "get-editor-state", requestId: Number };

export default function EditorBridgePlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      let data: EditorCommand;

      try {
        data = JSON.parse(event.data);
      } catch {
        return;
      }

      switch (data.type) {
        // ===== TEXT STYLES =====
        case "bold":
        case "italic":
        case "underline":
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, data.type);
          break;

        case "strike":
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
          break;

        // ===== HEADINGS =====
        case "h1":
        case "h2":
        case "h3":
          editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return;

            const headingNode = $createHeadingNode(data.type);
            selection.insertNodes([headingNode]);
            headingNode.select();
          });
          break;

        // ===== LISTS =====
        case "unordered-list":
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
          break;

        case "ordered-list":
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
          break;

        case "remove-list":
          editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
          break;

        // ===== EXPORT STATE =====
        case "get-editor-state":
          const { requestId } = data;

          editor.getEditorState().read(() => {
            const html = $generateHtmlFromNodes(editor);
            const json = editor.getEditorState().toJSON();

            // Send back to React Native
            // @ts-ignore
            window.ReactNativeWebView?.postMessage(
              JSON.stringify({
                type: "editor-state",
                requestId,
                payload: {
                  html,
                  json,
                },
              })
            );
          });
          break;
      }
    }

    window.addEventListener("message", handleMessage);
    // Android WebView
    // @ts-ignore
    document.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
      // @ts-ignore
      document.removeEventListener("message", handleMessage);
    };
  }, [editor]);

  return null;
}