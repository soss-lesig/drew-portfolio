export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function parseFrontmatter(markdown) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = markdown.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: {}, content: markdown };
  }

  const [, frontmatterText, content] = match;
  const frontmatter = {};

  // Parse simple YAML (key: value pairs)
  frontmatterText.split("\n").forEach((line) => {
    const [key, ...valueParts] = line.split(":");
    if (key && valueParts.length) {
      let value = valueParts.join(":").trim();

      // Handle arrays like tags: [web, css]
      if (value.startsWith("[") && value.endsWith("]")) {
        value = value
          .slice(1, -1)
          .split(",")
          .map((item) => item.trim());
      }

      // Strip surrounding quotes from string values - YAML allows quoted strings
      // but our naive parser was keeping them literally, producing "Title" on screen
      if (
        typeof value === "string" &&
        ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'")))
      ) {
        value = value.slice(1, -1);
      }

      frontmatter[key.trim()] = value;
    }
  });

  return { frontmatter, content };
}
