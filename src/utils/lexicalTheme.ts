import { type BeautifulMentionsTheme } from "lexical-beautiful-mentions";

const beautifulMentionsTheme: BeautifulMentionsTheme = {
  // default mention styles
  "@": "selected-mention",
};


export const lexicalTheme = {
  text: {
    bold: "lexical-text-bold",
    italic: "lexical-text-italic",
    underline: "lexical-text-underline",
    strikethrough: "lexical-text-strikethrough",
  },
  beautifulMentions: beautifulMentionsTheme,
};