import { redirect } from "next/navigation";
import { routing } from "../../i18n/routing";

// Server-side redirect to homepage (testimonials are shown on homepage)
export default function TestimonialsRedirect() {
  redirect(`/${routing.defaultLocale}#team`);
}
