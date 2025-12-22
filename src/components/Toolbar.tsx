import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  $getSelection,
  $isRangeSelection,
} from "lexical";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import { TOGGLE_LINK_COMMAND } from "@lexical/link";

export default function Toolbar() {
  const [editor] = useLexicalComposerContext();

  const format = (command: string) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, command as any);
  };

  const setHeading = (level: "h1" | "h2" | "h3") => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, (level as any));
  };

  const insertLink = () => {
    const url = prompt("Enter URL");
    if (url) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
    }
  };

  const insertImage = () => {
    const url = prompt("Enter image or GIF URL");
    if (!url) return;

    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.insertRawText(`\n![image](${url})\n`);
      }
    });
  };

  return (
    <div className="toolbar">
      <button onClick={() => setHeading("h1")}>H1</button>
      <button onClick={() => setHeading("h2")}>H2</button>
      <button onClick={() => setHeading("h3")}>H3</button>

      <button onClick={() => format("bold")}>B</button>
      <button onClick={() => format("italic")}>I</button>
      <button onClick={() => format("underline")}>U</button>

      <button
        onClick={() =>
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
        }
      >
        •
      </button>

      <button
        onClick={() =>
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
        }
      >
        1.
      </button>

      <button onClick={insertLink}>🔗</button>
      <button onClick={insertImage}>🖼</button>
    </div>
  );
}