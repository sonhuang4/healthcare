import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
    locales: ["en", "sv"],
    defaultLocale: "en",
    localePrefix: "as-needed", // Only show locale in URL when not default (en)
});

export const { Link, redirect, usePathname, useRouter } =
    createNavigation(routing);

