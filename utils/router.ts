import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Page } from '../types';

// URL pattern definitions
const ROUTES = {
  HOME: '/',
  PRODUCT: '/product/:handle',
  SHOP: '/shop',
  CATEGORY: '/category/:category',
  BEST_SELLERS: '/best-sellers',
  TECHNOLOGY: '/technology',
  BLOG: '/blog',
  BLOG_POST: '/blog/:slug',
  SUPPORT: '/support',
  TRACK_ORDER: '/track-order',
  ORDER_STATUS: '/order-status',
  RETURNS: '/returns',
  SIZE_GUIDE: '/size-guide',
  WARRANTY: '/warranty',
  BUNDLES: '/bundles',
  KIT_PRODUCT: '/bundle/:kitId',
  ACCESSORIES: '/accessories',
  SEARCH: '/search',
  NOT_FOUND: '*',
};

// Convert a route pattern to a regex
const patternToRegex = (pattern: string): { regex: RegExp; paramNames: string[] } => {
  const paramNames: string[] = [];
  const escaped = pattern.replace(/\*/g, '.*').replace(/:([a-zA-Z]+)/g, (_, paramName) => {
    paramNames.push(paramName);
    return '([^/]+)';
  });
  return {
    regex: new RegExp(`^${escaped}$`),
    paramNames,
  };
};

// Pre-compile route patterns
const routePatterns: Record<string, { regex: RegExp; paramNames: string[] }> = {};
for (const [key, pattern] of Object.entries(ROUTES)) {
  routePatterns[key] = patternToRegex(pattern);
}

interface RouterState {
  page: Page;
  params: Record<string, string>;
  query: Record<string, string>;
}

// Parse the current URL and return page, params, and query
export const parseUrl = (url: string = window.location.href): RouterState => {
  try {
    const { pathname, search } = new URL(url, window.location.origin);

    // Extract query parameters
    const queryParams = new URLSearchParams(search);
    const query: Record<string, string> = {};
    queryParams.forEach((value, key) => {
      query[key] = value;
    });

    // Try to match path against routes (excluding query)
    for (const [page, { regex, paramNames }] of Object.entries(routePatterns)) {
      if (page === 'NOT_FOUND') continue;
      const match = pathname.match(regex);
      if (match) {
        const params: Record<string, string> = {};
        paramNames.forEach((name, index) => {
          params[name] = match[index + 1];
        });
        return {
          page: page as Page,
          params,
          query,
        };
      }
    }

    // No route matched
    return {
      page: Page.NOT_FOUND,
      params: {},
      query,
    };
  } catch (error) {
    console.error('Error parsing URL:', error);
    return {
      page: Page.HOME,
      params: {},
      query: {},
    };
  }
};

// Create a URL string for a given page and params
export const createUrl = (
  page: Page,
  params: Record<string, string> = {},
  query: Record<string, string> = {}
): string => {
  const pattern = ROUTES[page];
  if (!pattern) {
    console.warn(`Unknown page: ${page}`);
    return window.location.origin;
  }

  let url = pattern;
  // Replace path parameters
  Object.entries(params).forEach(([key, value]) => {
    url = url.replace(`:${key}`, encodeURIComponent(value));
  });

  // Remove any remaining parameters (optional ones not provided)
  url = url.replace(/:[a-zA-Z]+/g, '');

  // Add query string if present
  const queryString = new URLSearchParams(query).toString();
  if (queryString) {
    url += `?${queryString}`;
  }

  return url;
};

export interface RouterContextValue {
  page: Page;
  params: Record<string, string>;
  query: Record<string, string>;
  navigate: (page: Page, params?: Record<string, string>, query?: Record<string, string>) => void;
  replace: (page: Page, params?: Record<string, string>, query?: Record<string, string>) => void;
  back: () => void;
  forward: () => void;
}

const RouterContext = createContext<RouterContextValue | null>(null);

type NavigationIntentRef = React.MutableRefObject<(() => void) | undefined>;

/**
 * Single source of truth for URL-driven UI state. Mount once above the app shell.
 * Optional `navigationIntentRef`: assign `ref.current = () => { ... }` in a parent render
 * to run code synchronously before every client navigation (pushState / replaceState / popstate).
 */
export const RouterProvider: React.FC<{
  children: React.ReactNode;
  navigationIntentRef?: NavigationIntentRef;
}> = ({ children, navigationIntentRef }) => {
  const [state, setState] = useState<RouterState>(() => parseUrl());

  const fireNavigationIntent = useCallback(() => {
    navigationIntentRef?.current?.();
  }, [navigationIntentRef]);

  useEffect(() => {
    const handlePopState = () => {
      fireNavigationIntent();
      setState(parseUrl());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [fireNavigationIntent]);

  const navigate = useCallback(
    (page: Page, params: Record<string, string> = {}, query: Record<string, string> = {}) => {
      fireNavigationIntent();
      const url = createUrl(page, params, query);
      window.history.pushState({ page, params, query }, '', url);
      setState({ page, params, query });
    },
    [fireNavigationIntent]
  );

  const replace = useCallback(
    (page: Page, params: Record<string, string> = {}, query: Record<string, string> = {}) => {
      fireNavigationIntent();
      const url = createUrl(page, params, query);
      window.history.replaceState({ page, params, query }, '', url);
      setState({ page, params, query });
    },
    [fireNavigationIntent]
  );

  const back = useCallback(() => {
    window.history.back();
  }, []);

  const forward = useCallback(() => {
    window.history.forward();
  }, []);

  const value = useMemo(
    () => ({
      page: state.page,
      params: state.params,
      query: state.query,
      navigate,
      replace,
      back,
      forward,
    }),
    [state.page, state.params, state.query, navigate, replace, back, forward]
  );

  return React.createElement(RouterContext.Provider, { value }, children);
};

export const useRouter = (): RouterContextValue => {
  const ctx = useContext(RouterContext);
  if (!ctx) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return ctx;
};
