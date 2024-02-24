/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 */
export const publicRoutes = [
  "/",
  "/sitemap.xml",
  "/api/socket/io",
  "/verify-email",
];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /settings
 */
export const authRoutes = [
  "/login",
  "/register",
];

/**
 * These routes are used for API authentication purposes and `uploadthin`
 * Routes that start with this prefix are used for API authentication purposes
 */
export const apiPublicRoutes = [
  "/api/auth",
  "/api/uploadthing"
];

/**
 * The default redirect path after logging in
 */
export const DEFAULT_LOGIN_REDIRECT = "/channel";