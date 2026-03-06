/**
 * Parses a markdown file string with YAML frontmatter.
 *
 * @param {string} raw - Raw file contents
 * @returns {{
 *   title: string,
 *   subtitle?: string,
 *   date?: string,
 *   tags?: string[],
 *   body: string
 * }}
 * @throws {Error} if the file has no valid frontmatter block or is missing a title
 */
export function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);

  if (!match) {
    throw new Error(
      "No frontmatter block found. Make sure the file starts with --- and has a closing ---."
    );
  }

  const yamlBlock = match[1];
  const body = match[2].trim();

  const get = (key) => {
    const lineMatch = yamlBlock.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
    return lineMatch ? lineMatch[1].trim() : undefined;
  };

  // title - required
  const rawTitle = get("title");
  if (!rawTitle) throw new Error("Frontmatter is missing a 'title' field.");
  const title = rawTitle.replace(/^["']|["']$/g, "");

  // subtitle - optional
  const rawSubtitle = get("subtitle");
  const subtitle = rawSubtitle
    ? rawSubtitle.replace(/^["']|["']$/g, "")
    : undefined;

  // date - optional (falls back to today in the editor)
  const date = get("date");

  // tags - optional, handles both array syntax [a, b] and bare a, b
  const rawTags = get("tags");
  let tags;
  if (rawTags) {
    const cleaned = rawTags.replace(/^\[|\]$/g, "");
    tags = cleaned
      .split(",")
      .map((t) => t.trim().replace(/^["']|["']$/g, ""))
      .filter(Boolean);
  }

  return { title, subtitle, date, tags, body };
}
