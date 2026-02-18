/**
 * Simple hash-based router
 * Listens for hash changes and calls the appropriate handler
 */

class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;

    // Listen for hash changes
    window.addEventListener("hashchange", () => this.handleRouteChange());

    // Handle initial load
    window.addEventListener("load", () => this.handleRouteChange());
  }

  /**
   * Register a route with a handler function
   * @param {string} path - Route pattern (e.g., '/blog', '/blog/:slug')
   * @param {Function} handler - Function to call when route matches
   */
  addRoute(path, handler) {
    this.routes[path] = handler;
  }

  /**
   * Parse the current hash and match it to a route
   */
  handleRouteChange() {
    window.scrollTo(0, 0); // Scroll to top on route change
    const hash = window.location.hash.slice(1) || "/"; // Remove # and default to '/'

    // Try exact match first
    if (this.routes[hash]) {
      this.currentRoute = hash;
      this.routes[hash]();
      return;
    }

    // Try pattern matching for dynamic routes like /blog/:slug
    for (const route in this.routes) {
      const params = this.matchRoute(route, hash);
      if (params) {
        this.currentRoute = route;
        this.routes[route](params);
        return;
      }
    }

    // No match found - show 404 or default
    console.warn(`No route found for: ${hash}`);
    this.navigateTo("/");
  }

  /**
   * Match a route pattern against the current hash
   * @param {string} pattern - Route pattern (e.g., '/blog/:slug')
   * @param {string} hash - Current hash (e.g., '/blog/my-post')
   * @returns {Object|null} - Params object if match, null otherwise
   */
  matchRoute(pattern, hash) {
    const patternParts = pattern.split("/");
    const hashParts = hash.split("/");

    // Must have same number of parts
    if (patternParts.length !== hashParts.length) {
      return null;
    }

    const params = {};

    for (let i = 0; i < patternParts.length; i++) {
      const patternPart = patternParts[i];
      const hashPart = hashParts[i];

      // Dynamic segment (starts with :)
      if (patternPart.startsWith(":")) {
        const paramName = patternPart.slice(1);
        params[paramName] = hashPart;
      }
      // Static segment must match exactly
      else if (patternPart !== hashPart) {
        return null;
      }
    }

    return params;
  }

  /**
   * Navigate to a new route
   * @param {string} path - Path to navigate to
   */
  navigateTo(path) {
    window.location.hash = path;
  }
}

// Export a singleton instance
export const router = new Router();
