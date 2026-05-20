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

        //@ts-ignore
        window.ReactNativeWebView?.postMessage(
          JSON.stringify({
            type: "editor-height-change",
            payload: { height },
          })
        );
      }
    };

    const measureAfterPaint = () => {
      // microtask → next frame → next frame (very important for paste)
      Promise.resolve().then(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(sendHeight);
        });
      });
    };

    const unregisterUpdateListener = editor.registerUpdateListener(() => {
      measureAfterPaint();
    });

    const resizeObserver = new ResizeObserver(() => {
      measureAfterPaint();
    });

    resizeObserver.observe(editorElement);

    const handleForceResend = () => {
      lastHeight = 0;
      measureAfterPaint();
    };

    window.addEventListener("editor-force-height-resend", handleForceResend);

    // initial measurement
    measureAfterPaint();

    return () => {
      unregisterUpdateListener();
      resizeObserver.disconnect();
      window.removeEventListener(
        "editor-force-height-resend",
        handleForceResend
      );
    };
  }, [editor]);

  return null;
}