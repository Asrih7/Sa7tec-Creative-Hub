import { Link as RouterLink, useRouter, useRouterState } from "@tanstack/react-router";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  children?: ReactNode;
};

/** wouter-compatible <Link href="..."> built on TanStack Router. */
export function Link({ href, children, ...rest }: LinkProps) {
  if (/^(https?:|mailto:|tel:|#)/i.test(href)) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <RouterLink to={href} {...rest}>
      {children}
    </RouterLink>
  );
}

/** wouter-compatible useLocation(): [pathname, navigate]. */
export function useLocation(): [string, (to: string) => void] {
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return [pathname, (to: string) => router.navigate({ to })];
}
