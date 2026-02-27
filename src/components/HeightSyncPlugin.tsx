import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";

export default function HeightSyncPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const editorElement = document.querySelector(
      ".editor-inner"
    ) as HTMLElement;

    if (!editorElement) return;

    let lastHeight = 0;

    const sendHeight = () => {
      const height = editorElement.scrollHeight;

      if (height !== lastHeight) {
        lastHeight = height;

        // @ts-ignore
        window.ReactNativeWebView?.postMessage(
          JSON.stringify({
            type: "editor-height-change",
            payload: { height },
          })
        );
      }
    };

    // 1️⃣ Detect content updates (typing, formatting, etc.)
    const unregisterUpdateListener = editor.registerUpdateListener(() => {
      requestAnimationFrame(sendHeight);
    });

    // 2️⃣ Detect DOM resize changes
    const resizeObserver = new ResizeObserver(() => {
      sendHeight();
    });

    resizeObserver.observe(editorElement);

    // Initial measurement
    sendHeight();

    return () => {
      unregisterUpdateListener();
      resizeObserver.disconnect();
    };
  }, [editor]);

  return null;
}