import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  layout("../src/components/Layout.jsx", [
    index("../src/pages/Home.jsx"),
    route("about", "../src/pages/About.jsx"),
    route("contact", "../src/pages/Contact.jsx"),
    route("drewbrew", "../src/pages/DrewBrew.jsx"),
    route("blog", "../src/pages/BlogIndex.jsx"),
    route("blog/:slug", "../src/pages/BlogPost.jsx"),
    route("vault", "../src/pages/Vault.jsx"),
    route("studio/login", "../src/pages/Login.jsx"),
    route("studio", "../src/pages/Admin.jsx"),
  ]),
  route("*", "../src/pages/NotFound.jsx"),
] satisfies RouteConfig;
