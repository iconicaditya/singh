import { useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";

export function useScrollToSection() {
  const router = useRouter();
  const pathname = usePathname();

  const scrollToSection = useCallback((sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      return true;
    }
    return false;
  }, []);

  const handleSectionScroll = useCallback((href: string) => (event?: React.MouseEvent<HTMLElement>) => {
    const sectionId = href.split("#")[1];
    if (!sectionId) return;

    if (event) {
      event.preventDefault();
    }

    if (pathname === "/") {
      // Already on home page, scroll directly
      scrollToSection(sectionId);
      return;
    }

    // Navigate to home with scrollTo and section query parameters
    // For contact, show only the contact section
    if (sectionId === "contact") {
      router.push(`/?section=contact`);
    } else {
      router.push(`/?scrollTo=${sectionId}`);
    }
  }, [pathname, router, scrollToSection]);

  return { handleSectionScroll, scrollToSection };
}
