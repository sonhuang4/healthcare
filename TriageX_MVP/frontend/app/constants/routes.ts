// Route paths constants

export const ROUTES = {
    HOME: "/",
    INPUT: "/input",
    PROCESSING: "/processing",
    RESULTS: "/results",
    ABOUT: "/about",
    RESOURCES: "/resources",
    CONTACT: "/contact",
    TESTIMONIALS: "/testimonials",
    ADMIN: "/admin",
} as const;

export type Route = typeof ROUTES[keyof typeof ROUTES];

