// Tiny TS/TSX highlighter. Runs on the server at build time, ships zero JS.
const KEYWORDS = new Set(
  "import export from default const let var function return if else for while of in new typeof as type interface extends async await true false null undefined void".split(
    " ",
  ),
);

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const wrap = (cls: string, s: string) => `<span class="tok-${cls}">${esc(s)}</span>`;

const TOKEN =
  /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(<\/?[A-Za-z][\w.]*)|(\b\d[\d_.]*\b)|([A-Za-z_$][\w$]*)(?=\s*\()|([A-Za-z_$][\w$]*)/g;

export function highlight(code: string): string {
  let out = "";
  let last = 0;
  for (const m of code.matchAll(TOKEN)) {
    out += esc(code.slice(last, m.index));
    last = m.index + m[0].length;
    if (m[1]) out += wrap("comment", m[1]);
    else if (m[2]) out += wrap("string", m[2]);
    else if (m[3]) out += wrap("tag", m[3]);
    else if (m[4]) out += wrap("number", m[4]);
    else if (m[5]) out += KEYWORDS.has(m[5]) ? wrap("keyword", m[5]) : wrap("fn", m[5]);
    else if (m[6]) out += KEYWORDS.has(m[6]) ? wrap("keyword", m[6]) : esc(m[6]);
  }
  return out + esc(code.slice(last));
}
