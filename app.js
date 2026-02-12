// Import highlight.js CSS for syntax highlighting
import "highlight.js/styles/github-dark.css";

// Import the router and blog controller functions
import { router } from "./blog/js/router.js";
import {
  showPortfolio,
  showBlogIndex,
  showBlogPost,
} from "./blog/js/blogController.js";

// Register routes
router.addRoute("/", showPortfolio);
router.addRoute("/blog", showBlogIndex);
router.addRoute("/blog/:slug", showBlogPost);

// Router is already initialized in router.js constructor
// It will handle the initial route on page load
