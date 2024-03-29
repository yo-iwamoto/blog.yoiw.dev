import { useEffect } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.min.css";

export function useHighlightEffect() {
  useEffect(() => {
    const pre = Array.from(document.querySelectorAll("pre code"));
    for (const el of pre) {
      if (!(el instanceof HTMLElement)) continue;
      hljs.highlightElement(el);
    }
  });
}
