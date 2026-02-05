import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import {
  $getRoot,
  $isParagraphNode,
} from "lexical";
import { PASTE_COMMAND, COMMAND_PRIORITY_LOW } from "lexical";

export default function PasteNormalizationPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      PASTE_COMMAND,
      () => {
        // wait for paste to complete
        setTimeout(() => {
          editor.update(() => {
            const root = $getRoot();
            const children = root.getChildren();

            let previousWasEmpty = false;

            children.forEach((node) => {
              if ($isParagraphNode(node)) {
                const text = node.getTextContent().trim();
                const isEmpty = text === "";

                // remove consecutive empty paragraphs
                if (isEmpty && previousWasEmpty) {
                  node.remove();
                  return;
                }

                previousWasEmpty = isEmpty;
              } else {
                previousWasEmpty = false;
              }
            });

            // remove leading empty paragraph
            const first = root.getFirstChild();
            if ($isParagraphNode(first) && first.getTextContent().trim() === "") {
              first.remove();
            }

            // remove trailing empty paragraph
            const last = root.getLastChild();
            if ($isParagraphNode(last) && last.getTextContent().trim() === "") {
              last.remove();
            }
          });
        }, 0);

        return false; // allow normal paste
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor]);

  return null;
}