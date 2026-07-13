import { $getSelection, $isRangeSelection, type LexicalEditor } from "lexical";
import { sendToNative } from "./nativeBridge";

/**
 * Shared state for a single mention/hashtag picking "session".
 *
 * The in-WebView typeahead menu is intentionally suppressed (see MentionsPlugin
 * / HashtagsPlugin). Instead, when a trigger ("@" or "#") is detected we notify
 * React Native so it can present a native bottom sheet that owns the query. The
 * editor is blurred by RN so no querying can happen inside the editor.
 *
 * We remember exactly where the trigger character sits so the bridge can later
 * remove it and drop a mention node in its place (on select) or just remove it
 * (on cancel) — without relying on the editor selection, which is gone once the
 * editor is blurred.
 */
export interface PendingMention {
  trigger: string;
  /** Key of the text node that holds the trigger char, if capturable. */
  key: string | null;
  /** Caret offset immediately after the trigger char. */
  offset: number | null;
}

let active = false;
let pending: PendingMention | null = null;

/**
 * Begin a picking session for the given trigger. Idempotent while a session is
 * already active so repeated onSearch calls (or a second plugin) can't open the
 * sheet twice.
 */
export function beginMentionSession(editor: LexicalEditor, trigger: string) {
  if (active) {
    return;
  }
  active = true;
  pending = { trigger, key: null, offset: null };

  editor.getEditorState().read(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection) && selection.isCollapsed()) {
      pending = {
        trigger,
        key: selection.anchor.key,
        offset: selection.anchor.offset,
      };
    }
  });

  sendToNative({ type: "mention-hashtag-open", trigger });
}

export function getPendingMention(): PendingMention | null {
  return pending;
}

export function isMentionSessionActive(): boolean {
  return active;
}

export function endMentionSession() {
  active = false;
  pending = null;
}
