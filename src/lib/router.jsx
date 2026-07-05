import NextLink from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";

function normaliseHref(value = "/") {
  if (typeof value === "string") {
    return value || "/";
  }

  return value?.pathname || "/";
}

export function Link({ to, href, children, ...props }) {
  return (
    <NextLink href={normaliseHref(to || href)} {...props}>
      {children}
    </NextLink>
  );
}

export function NavLink({ to, href, className, children, ...props }) {
  const router = useRouter();
  const nextHref = normaliseHref(to || href);
  const isActive = router.pathname === nextHref || router.asPath.split("?")[0] === nextHref;
  const resolvedClassName = typeof className === "function" ? className({ isActive }) : className;

  return (
    <NextLink href={nextHref} className={resolvedClassName} {...props}>
      {children}
    </NextLink>
  );
}

export function useNavigate() {
  const router = useRouter();

  return (to, options = {}) => {
    if (options.replace) {
      return router.replace(to);
    }

    return router.push(to);
  };
}

export function useLocation() {
  const router = useRouter();
  const asPath = router.asPath || "/";
  const [pathname, queryString = ""] = asPath.split("?");

  return {
    pathname,
    search: queryString ? `?${queryString}` : "",
    key: asPath
  };
}

export function useParams() {
  const router = useRouter();

  return useMemo(() => {
    return Object.fromEntries(
      Object.entries(router.query || {}).map(([key, value]) => [
        key,
        Array.isArray(value) ? value[0] : value
      ])
    );
  }, [router.query]);
}

export function useSearchParams() {
  const router = useRouter();
  const search = router.asPath?.split("?")[1] || "";
  const params = useMemo(() => new URLSearchParams(search), [search]);

  const setSearchParams = (nextParams) => {
    const query = nextParams instanceof URLSearchParams
      ? nextParams.toString()
      : new URLSearchParams(nextParams).toString();
    const pathname = router.asPath.split("?")[0] || "/";
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  return [params, setSearchParams];
}

export function Navigate({ to, replace = false }) {
  const router = useRouter();

  useEffect(() => {
    if (replace) {
      void router.replace(to);
      return;
    }

    void router.push(to);
  }, [replace, router, to]);

  return null;
}
