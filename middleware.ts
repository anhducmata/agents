import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

// Create a route matcher for public routes
const isPublicRoute = createRouteMatcher(["/", "/api/webhooks(.*)", "/sign-in(.*)", "/sign-up(.*)"])

export default clerkMiddleware({
  publicRoutes: (req) => isPublicRoute(req),
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
