import { marked } from "marked";
import hljs from "highlight.js";
import hljsJsx from "highlight.js/lib/languages/xml";
import hljsTypescript from "highlight.js/lib/languages/typescript";

hljs.registerLanguage("jsx", hljsJsx);
hljs.registerLanguage("tsx", hljsTypescript);
hljs.registerLanguage("ts", hljsTypescript);

marked.use({
  renderer: {
    code(token) {
      const language = token.lang || "plaintext";
      const validLang = hljs.getLanguage(language) ? language : "plaintext";
      const highlighted = hljs.highlight(token.text, { language: validLang }).value;
      return `<pre><code class="hljs language-${validLang}">${highlighted}</code></pre>`;
    },
  },
});

export { marked };
