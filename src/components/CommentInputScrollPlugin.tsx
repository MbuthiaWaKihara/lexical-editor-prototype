import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot } from "lexical";
import { useEffect } from "react";
import { getEditorRuntimeConfig } from "../utils/editorRuntimeConfig";

function isEditorEmpty(editorState: any): boolean {
  let empty = true;
  editorState.read(() => {
    empty = $getRoot().getTextContent().trim().length === 0;
  });
  return empty;
}

export default function CommentInputScrollPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const rootElement = document.getElementById("root");
    if (!rootElement) return;

    const applyRootScrollMode = (empty: boolean) => {
      const runtimeConfig: any = getEditorRuntimeConfig();
      const isCommentingInput =
        runtimeConfig.isCommentingInput ?? runtimeConfig.isCommentInput ?? false;

      if (isCommentingInput && empty) {
        rootElement.style.overflow = "hidden";
        rootElement.style.overflowY = "hidden";
        return;
      }

      rootElement.style.overflow = "";
      rootElement.style.overflowY = "scroll";
    };

    const updateFromEditorState = (editorState: any) => {
      applyRootScrollMode(isEditorEmpty(editorState));
    };

    updateFromEditorState(editor.getEditorState());

    const unregisterUpdateListener = editor.registerUpdateListener(
      ({ editorState }) => {
        updateFromEditorState(editorState);
      }
    );

    const handleRuntimeConfigChange = () => {
      updateFromEditorState(editor.getEditorState());
    };

    window.addEventListener(
      "editor-runtime-config-change",
      handleRuntimeConfigChange
    );

    return () => {
      unregisterUpdateListener();
      window.removeEventListener(
        "editor-runtime-config-change",
        handleRuntimeConfigChange
      );
      rootElement.style.overflow = "";
      rootElement.style.overflowY = "scroll";
    };
  }, [editor]);

  return null;
}
