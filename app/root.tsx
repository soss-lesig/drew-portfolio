import type { DOMAttributes } from "react";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import "../src/styles/index.css";
import "../highlight-theme.css";
import "@fontsource-variable/jost";

const themeScript = `
  (function() {
    var stored = localStorage.getItem('drewbs-theme');
    var preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    var theme = stored || preferred;
    document.documentElement.setAttribute('data-theme', theme);
  })();
`;

const inlineScript: DOMAttributes<HTMLScriptElement>["dangerouslySetInnerHTML"] =
  {
    __html: themeScript,
  };

export default function Root() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script dangerouslySetInnerHTML={inlineScript} />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
