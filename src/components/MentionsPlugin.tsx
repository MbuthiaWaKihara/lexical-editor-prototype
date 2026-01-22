import {
  LexicalTypeaheadMenuPlugin,
} from "@lexical/react/LexicalTypeaheadMenuPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $insertNodes } from "lexical";
import { useEffect, useRef, useState } from "react";
import { $createMentionNode } from "../utils/MentionNode";
import { getEditorRuntimeConfig } from "../utils/editorRuntimeConfig";
import axios from "axios";

type MentionUser = {
  id: string;
  name: string;
};

export default function MentionsPlugin() {
  const [editor] = useLexicalComposerContext();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MentionUser[]>([]);
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    const { mentionsUrl, accessToken } = getEditorRuntimeConfig();
    console.log('editor runtime config: ', getEditorRuntimeConfig());

    // if (!mentionsUrl || !accessToken) {
    //   setResults([]);
    //   return;
    // }

    // debounce typing
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = window.setTimeout(async () => {
      try {
        // const res = await fetch(
        //   `${mentionsUrl}?q=${encodeURIComponent(query)}`,
        //   {
        //     headers: {
        //       Authorization: `Bearer ${accessToken}`,
        //       "Content-Type": "application/json",
        //     },
        //   }
        // );

        // if (!res.ok) {
        //   console.log('error: ', res);
        //   setResults([]);
        //   return;
        // }

        // console.log('success: ', res.json);
        // const data = await res.json();
        // setResults(data ?? []);

        const response: any = axios.get(`${mentionsUrl}?q=${encodeURIComponent(query)}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            }
        });

        console.log(response);
        setResults(response.data);
      } catch(error) {
        console.log(error)
        setResults([]);
      }
    }, 250);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  return (
    <LexicalTypeaheadMenuPlugin
      triggerFn={(text) => {
        const match = /(^|\s)@([\w]*)$/.exec(text);
        if (!match) return null;

        return {
          leadOffset: match.index + match[1].length,
          matchingString: match[2],
          replaceableString: match[0].slice(match[1].length),
        };
      }}
      //@ts-ignore
      onQueryChange={setQuery}
      //@ts-ignore
      options={results}
      //@ts-ignore
      onSelectOption={(user: MentionUser) => {
        editor.update(() => {
          const mentionNode = $createMentionNode(user.name);
          $insertNodes([mentionNode]);
        });
      }}
      menuRenderFn={(anchorRef, { options, selectOption }: any) =>
        anchorRef.current && options.length ? (
          <div className="mention-menu">
            {options.map((user: MentionUser) => (
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