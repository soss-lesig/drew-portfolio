import type { Config } from "@react-router/dev/config";
import { readFileSync } from "fs";
import { join } from "path";

export default {
  ssr: false,
  async prerender() {
    const postsPath = join(process.cwd(), "public", "content", "posts.json");
    const posts = JSON.parse(readFileSync(postsPath, "utf-8"));
    const slugPaths = posts.map((p: { slug: string }) => `/blog/${p.slug}`);

    return [
      "/",
      "/about",
      "/contact",
      "/drewbrew",
      "/blog",
      ...slugPaths,
    ];
  },
} satisfies Config;
