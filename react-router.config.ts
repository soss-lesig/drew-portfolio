import type { Config } from "@react-router/dev/config";
import { cloudflareDevProxyVitePlugin } from "@react-router/cloudflare";

export default {
  ssr: false,
  prerender: true,
} satisfies Config;
