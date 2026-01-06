import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_TEXT_COMMAND } from "lexical";
import { useEffect } from "react";

type EditorCommand =
  | { type: "bold" }
  | { type: "italic" }
  | { type: "underline" }
  | { type: "strike" };

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
        case "bold":
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
          break;
        case "italic":
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
          break;
        case "underline":
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
          break;
        case "strike":
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
          break;
      }
    }

    window.addEventListener("message", handleMessage);
    //@ts-ignore
    document.addEventListener("message", handleMessage); // Android fix

    return () => {
      window.removeEventListener("message", handleMessage);
      //@ts-ignore
      document.removeEventListener("message", handleMessage);
    };
  }, [editor]);

  return null;
}