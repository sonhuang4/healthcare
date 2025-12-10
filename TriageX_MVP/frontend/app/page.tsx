import { redirect } from "next/navigation";
import { routing } from "../i18n/routing";

// Server-side redirect to locale-aware route
export default function HomeRedirect() {
  redirect(`/${routing.defaultLocale}`);
}
