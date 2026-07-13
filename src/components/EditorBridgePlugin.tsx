import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  // FORMAT_TEXT_COMMAND,
  $getSelection,
  $isRangeSelection,
  $getRoot,
  $createParagraphNode,
  $getNodeByKey,
  $isTextNode,
  $createTextNode,
} from "lexical";
import { $createBeautifulMentionNode } from "lexical-beautiful-mentions";
import { getPendingMention, endMentionSession } from "../utils/mentionSession";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { $createHeadingNode } from "@lexical/rich-text";
import { $generateHtmlFromNodes } from "@lexical/html";
import { useEffect } from "react";
import { setEditorRuntimeConfig } from "../utils/editorRuntimeConfig";
import { $setBlocksType } from "@lexical/selection";

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
  | { type: "get-editor-state"; requestId: number }
  | {
      type: "init-config";
      payload: {
        mentionsUrl?: string;
        hashtagsUrl?: string;
        accessToken?: string;
        css?: string;
        isCommentingInput?: boolean;
      };
    }
  | {
      type: "insert-mention";
      payload: {
        trigger: string;
        value: string;
        data: Record<string, unknown>;
      };
    }
  | { type: "cancel-mention" }
  | { type: "clear-editor" }
  | { type: "focus-editor" }
  | { type: "blur-editor" }
  | { type: "focus-editor-element" }
  | { type: "blur-editor-element" }
  | { type: "remove-heading" }

export default function EditorBridgePlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // tell React Native that Lexical is ready
    //@ts-ignore
    window.ReactNativeWebView?.postMessage(
      JSON.stringify({ type: "editor-ready" })
    );
  }, []);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      let data: EditorCommand;

      try {
        data = JSON.parse(event.data);
      } catch {
        return;
      }

      switch (data.type) {
        case "clear-editor":
          editor.update(() => {
            const root = $getRoot();
            root.clear();

            // 👇 important: Lexical requires at least one paragraph
            root.append($createParagraphNode());
          });
          return;

        // ===== MENTION / HASHTAG (native picker) =====
        // Native bottom sheet picked an item — remove the trigger char that
        // opened the session and drop a mention node in its place. The node
        // shape ({ trigger, value, data: { data: <apiObject> } }) is identical
        // to what the in-editor typeahead used to produce, so the downstream
        // payload serialization is unchanged.
        case "insert-mention": {
          const { trigger, value } = data.payload;
          const itemData = data.payload.data;

          editor.update(() => {
            const mentionNode = $createBeautifulMentionNode(trigger, value, {
              data: itemData as any,
            });

            const pending = getPendingMention();
            let inserted = false;

            if (pending && pending.key && pending.offset != null) {
              const node = $getNodeByKey(pending.key);
              if ($isTextNode(node)) {
                const text = node.getTextContent();
                const triggerIdx = pending.offset - 1;

                if (triggerIdx >= 0 && text[triggerIdx] === trigger) {
                  const before = text.slice(0, triggerIdx);
                  const after = text.slice(pending.offset);
                  const afterNode = after ? $createTextNode(after) : null;

                  if (before) {
                    node.insertBefore($createTextNode(before));
                  }
                  node.insertBefore(mentionNode);
                  if (afterNode) {
                    node.insertBefore(afterNode);
                  }
                  node.remove();

                  if (afterNode) {
                    afterNode.select(0, 0);
                  } else {
                    const parent = mentionNode.getParent();
                    if (parent && "selectEnd" in parent) {
                      (parent as any).selectEnd();
                    }
                  }
                  inserted = true;
                }
              }
            }

            if (!inserted) {
              // Fallback: nothing to clean up — just insert at the caret / end.
              let selection = $getSelection();
              if (!$isRangeSelection(selection)) {
                $getRoot().selectEnd();
                selection = $getSelection();
              }
              if ($isRangeSelection(selection)) {
                selection.insertNodes([mentionNode]);
              }
            }
          });

          endMentionSession();
          // Focus/keyboard restoration is driven from React Native (reusing the
          // established focusEditor bridge) once the bottom sheet has dismissed.
          return;
        }

        // Native bottom sheet dismissed without a pick — remove the dangling
        // trigger char so the editor is left clean.
        case "cancel-mention": {
          editor.update(() => {
            const pending = getPendingMention();
            if (pending && pending.key && pending.offset != null) {
              const node = $getNodeByKey(pending.key);
              if ($isTextNode(node)) {
                const text = node.getTextContent();
                const triggerIdx = pending.offset - 1;
                if (triggerIdx >= 0 && text[triggerIdx] === pending.trigger) {
                  const newText =
                    text.slice(0, triggerIdx) + text.slice(pending.offset);
                  if (newText.length === 0) {
                    node.remove();
                  } else {
                    node.setTextContent(newText);
                  }
                }
              }
            }
          });
          endMentionSession();
          return;
        }

        // ===== RUNTIME CONFIG (NEW) =====
        case "init-config":
          console.log('init-config payload: ', data.payload);
          setEditorRuntimeConfig(data.payload);
          return;
        case "focus-editor":
          editor.update(() => {
            const root = $getRoot();
            root.selectEnd();
          });

          setTimeout(() => {
            editor.focus();
          }, 0);
          return;
        case "blur-editor":
          editor.blur();
          return;
        case "focus-editor-element":
          const editorInputElementFocus = document.querySelector('.editor-input') as HTMLInputElement;

          if(editorInputElementFocus) {
            editorInputElementFocus.focus();
          }
          return;
        case "blur-editor-element":
            const editorInputElementBlur = document.querySelector('.editor-input') as HTMLInputElement;

            if(editorInputElementBlur) {
              editorInputElementBlur.blur();
            }
            return;
        // ===== TEXT STYLES =====
        case "bold":
        case "italic":
        case "underline":
        case "strike":
          editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return;

            const map: Record<string, any> = {
              bold: "bold",
              italic: "italic",
              underline: "underline",
              strike: "strikethrough",
            };

            selection.formatText(map[data.type]);
          });
          return;

        // ===== HEADINGS =====
        case "h1":
        case "h2":
        case "h3":
          editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return;

            $setBlocksType(selection, () => $createHeadingNode(data.type));
          });
          return;

        case "remove-heading":
          editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return;

            $setBlocksType(selection, () => $createParagraphNode());
          });
          return;

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
