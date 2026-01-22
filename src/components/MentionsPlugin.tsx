import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
} from "@lexical/react/LexicalTypeaheadMenuPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $insertNodes,
  $getSelection,
  $isRangeSelection,
  $setSelection,
  //@ts-ignore
  RangeSelection,
} from "lexical";
import { useEffect, useRef, useState } from "react";
import { $createMentionNode } from "../utils/MentionNode";
import { getEditorRuntimeConfig } from "../utils/editorRuntimeConfig";
import axios from "axios";

type MentionUser = {
  id: string;
  full_name: string;
};

class MentionOption extends MenuOption {
  user: MentionUser;
  constructor(user: MentionUser) {
    super(user.full_name);
    this.user = user;
  }
}

export default function MentionsPlugin() {
  const [editor] = useLexicalComposerContext();
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState<MentionOption[]>([]);
  const debounceRef = useRef<number | null>(null);

  /* ================= FETCH MENTIONS ================= */
  useEffect(() => {
    const { mentionsUrl, accessToken } = getEditorRuntimeConfig();

    if (!mentionsUrl || !accessToken) {
      setOptions([]);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = window.setTimeout(async () => {
      try {
        const response: any = await axios.get(
          `${mentionsUrl}?q=${encodeURIComponent(query)}`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        const users: MentionUser[] =
          response.data?.data?.map((m: any) => m.user) ?? [];

        setOptions(users.map((u) => new MentionOption(u)));
      } catch (err) {
        console.error("Mentions fetch error:", err);
        setOptions([]);
      }
    }, 250);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  /* ================= INSERT MENTION ================= */
  const insertMention = (option: MentionOption, replaceableString: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      // Save original selection to restore after node insert
      const rangeSelection = selection as RangeSelection;

      // 1️⃣ Delete the typed trigger text (e.g., "@jo")
      //@ts-ignore
      rangeSelection.deleteText(replaceableString.length, "backward");

      // 2️⃣ Create the mention node and insert it
      const mentionNode = $createMentionNode(option.user.full_name);
      $insertNodes([mentionNode]);

      // 3️⃣ Move cursor to a new text node **after the mention**
      //@ts-ignore
      const textNode = mentionNode.getTextContentNode
      //@ts-ignore
        ? mentionNode.getTextContentNode()
        : null;

      // Create a text node after mention to type normally
      const nextTextNode = textNode || mentionNode.getNextSibling();
      if (nextTextNode) {
        $setSelection(
          //@ts-ignore
          RangeSelection.createFromNodes([nextTextNode], 0, [nextTextNode], 0)
        );
      } else {
        // Fallback: insert a space so cursor is outside mention
        rangeSelection.insertText(" ");
      }
    });
  };

  return (
    <LexicalTypeaheadMenuPlugin<MentionOption>
      triggerFn={(text) => {
        const match = /(^|\s)@([\w-]*)$/.exec(text);
        if (!match) return null;

        return {
          leadOffset: match.index + match[1].length,
          matchingString: match[2],
          replaceableString: match[0].slice(match[1].length), // includes "@"
        };
      }}
      //@ts-ignore
      onQueryChange={setQuery}
      options={options}
      //@ts-ignore
      onSelectOption={(
        //@ts-ignore
        option,
        //@ts-ignore
        _textNode,
        //@ts-ignore
        _closeMenu,
        //@ts-ignore
        _matchingString,
        //@ts-ignore
        replaceableString
      ) => insertMention(option, replaceableString)}
      menuRenderFn={(
        anchorRef,
        { options, selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }
      ) =>
        anchorRef.current && options.length ? (
          <div className="mention-menu">
            {options.map((option, index) => (
              <div
                key={option.user.id}
                className={`mention-item ${
                  index === selectedIndex ? "highlighted" : ""
                }`}
                onMouseEnter={() => setHighlightedIndex(index)}
                onClick={() => selectOptionAndCleanUp(option)}
              >
                {option.user.full_name} {/* no @ */}
              </div>
            ))}
          </div>
        ) : null
      }
    />
  );
}