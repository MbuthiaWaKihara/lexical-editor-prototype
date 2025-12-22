import { TextNode } from "lexical";

export class MentionNode extends TextNode {
  static getType() {
    return "mention";
  }

  static clone(node: MentionNode) {
    return new MentionNode(node.__text, node.__key);
  }

  createDOM(): HTMLElement {
    const dom = document.createElement("span");
    dom.className = "mention";
    dom.textContent = `@${this.__text}`;
    return dom;
  }

  updateDOM(): boolean {
    return false;
  }

  isTextEntity(): true {
    return true;
  }
}

export function $createMentionNode(name: string) {
  return new MentionNode(name);
}