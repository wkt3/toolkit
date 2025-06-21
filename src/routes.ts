/**
 * An array of routes that are accessible to the public openly without any restrictions
 * @type{string[]}
 */
export const publicRoutes = [
  "/",
  "/newVerification",
  "/main",
  "/dashboard",
  "/error",
];

/**
 * an array of routes used for authentication
 * these routes will redirect logged in users to /settings
 * @type{string[]}
 */
export const authRoutes = [
  "/signin",
  "/register",
  "/error",
  "/forgotpassword",
  "/newPassword",
  "/verifyEmail",
];

/**
 * the prefix for API Authentication routes
 * Routes that starts with this prefix are always available for to working of website API ROUTES PROPERLY
 * so this should always be free and open for every time its used
 * @type{string}
 */

export const apiAuthPrefix = "/api/auth";

/**
 * the default redirect path after logging in
 * @type{string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/settings";
