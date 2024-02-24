// import { auth } from "@/auth";
// import {
//   DEFAULT_LOGIN_REDIRECT,
//   apiPublicRoutes,
//   authRoutes,
//   publicRoutes,
// } from "./routes";

// export default auth((req) => {

// });

// export const config = {
//   matcher: [
//     "/((?!.+\\.[\\w]+$|_next).*)",
//     "/",
//     "/(api|trpc)(.*)",
//     "/((?!ws$).*)",
//     "/((?!proxy|favicon.ico).*)",
//   ],
// };

export { auth as middleware } from "@/auth";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */

    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

// *Don't use Clerk matcher. CSS and Static files are not being served
