import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

/**
 * The createRouteMatcher function creates a matcher to determine if a request corresponds to a protected route. In this case, it matches any route starting with /dashboard.
 */
const isProtectedRoute = createRouteMatcher(
	[
		'/dashboard(.*)',
	]
)

/**
 * The clerkMiddleware function is the main middleware that handles authentication. It checks the request (req) and protects the route using auth().protect() if it matches the specified route.
 */
export default clerkMiddleware((auth, req) => {
	if (isProtectedRoute(req)) auth().protect()
})

/**
 * The config object contains a matcher array that defines which routes should have this middleware applied.
 * It skips Next.js internal routes and static files, while always applying to API routes.
 */
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}