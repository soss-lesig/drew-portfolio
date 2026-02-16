// Import highlight.js CSS for syntax highlighting
import "./highlight-theme.css";
import typescript from "highlight.js/lib/languages/typescript";

// Import the router and blog controller functions
import { router } from "./blog/js/router.js";
import {
  showPortfolio,
  showBlogIndex,
  showBlogPost,
  showAbout,
  showContact,
  showDrewBrew,
} from "./blog/js/pageController.js";
import hljs from "highlight.js";

// Register routes
router.addRoute("/", showPortfolio);
router.addRoute("/blog", showBlogIndex);
router.addRoute("/about", showAbout);
router.addRoute("/contact", showContact);
router.addRoute("/drewbrew", showDrewBrew);
router.addRoute("/blog/:slug", showBlogPost);

// Router is already initialized in router.js constructor
// It will handle the initial route on page load

hljs.registerLanguage("typescript", typescript);
