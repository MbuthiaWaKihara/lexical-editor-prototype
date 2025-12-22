import {
  LexicalTypeaheadMenuPlugin,
} from "@lexical/react/LexicalTypeaheadMenuPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $insertNodes } from "lexical";
import { useMemo, useState } from "react";
import { $createMentionNode } from "../utils/MentionNode";

const USERS = [
  { id: "1", name: "Alice" },
  { id: "2", name: "Bob" },
  { id: "3", name: "Charlie" },
];

export default function MentionsPlugin() {
  const [editor] = useLexicalComposerContext();
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    return USERS.filter((user) =>
      user && user.name && query && user.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  return (
    <LexicalTypeaheadMenuPlugin
      triggerFn={(text) => {
        const match = /@([a-zA-Z]*)$/.exec(text);
        if (!match) return null;

        return {
          leadOffset: match.index,
          matchingString: match[1],
          replaceableString: match[0],
        };
      }}
      //@ts-ignore
      onQueryChange={setQuery}
      options={results}
      onSelectOption={(user: any) => {
        editor.update(() => {
          const mentionNode = $createMentionNode(user.name);
          $insertNodes([mentionNode]);
        });
      }}
      menuRenderFn={(anchorRef, { options, selectOption }: any) =>
        anchorRef.current && options.length ? (
          <div className="mention-menu">
            {options.map((user: any) => (
              <div
                key={user.id}
                className="mention-item"
                onClick={() => selectOption(user)}
              >
                @{user.name}
              </div>
            ))}
          </div>
        ) : null
      }
    />
  );
}