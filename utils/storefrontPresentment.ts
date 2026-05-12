import { CURRENCY_MARKETS, DEFAULT_CURRENCY, resolveCurrency, type SupportedCurrencyCode } from './currency';
import { normalizeShopifyStoreDomain } from './shopifyStoreDomain';

const domain = normalizeShopifyStoreDomain(import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || '');
const storefrontAccessToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN || '';
const apiVersion = '2024-01';

const PRODUCT_FIELDS_CORE = `
    id
    handle
    title
    description
    descriptionHtml
    tags
    images(first: 10) {
      edges {
        node {
          url
          altText
        }
      }
    }
    options {
      name
      values
      optionValues {
        name
      }
    }
    variants(first: 100) {
      edges {
        node {
          id
          title
          availableForSale
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          image {
            url
            altText
          }
          product {
            id
            handle
          }
        }
      }
    }
`;

const PRODUCT_FRAGMENT_FULL = `
  fragment ProductFields on Product {
    ${PRODUCT_FIELDS_CORE}
    metafields(identifiers: [
      { namespace: "custom", key: "description" }
      { namespace: "custom", key: "description_points" }
      { namespace: "custom", key: "features" }
      { namespace: "custom", key: "page_layout" }
      { namespace: "custom", key: "show_kit_combo" }
      { namespace: "custom", key: "show_tech_specs" }
      { namespace: "custom", key: "show_videos" }
      { namespace: "custom", key: "show_expert_section" }
      { namespace: "custom", key: "show_trust_badges" }
      { namespace: "custom", key: "show_faq" }
      { namespace: "custom", key: "show_testimonials" }
      { namespace: "custom", key: "timer_title" }
      { namespace: "custom", key: "timer_subtitle" }
      { namespace: "custom", key: "scarcity_message" }
      { namespace: "custom", key: "bundle_options" }
      { namespace: "custom", key: "trust_badges" }
      { namespace: "custom", key: "faq" }
      { namespace: "custom", key: "primary_cta_text" }
      { namespace: "custom", key: "secondary_cta_text" }
    ]) {
      namespace
      key
      value
      type
    }
  }
`;

const PRODUCT_FRAGMENT_MINIMAL = `
  fragment ProductFieldsMin on Product {
    ${PRODUCT_FIELDS_CORE}
  }
`;

function canUseStorefrontGraphql(): boolean {
  return Boolean(domain && storefrontAccessToken);
}

function marketCountry(currency: SupportedCurrencyCode): string {
  return CURRENCY_MARKETS[currency]?.countryCode ?? CURRENCY_MARKETS[DEFAULT_CURRENCY].countryCode;
}

function normalizeProductOptions(product: any): any {
  if (!product?.options || !Array.isArray(product.options)) return product;
  const options = product.options.map((o: any) => {
    const fromOptionValues =
      Array.isArray(o.optionValues) && o.optionValues.length
        ? o.optionValues.map((v: any) => v?.name ?? v?.value).filter(Boolean)
        : null;
    const values =
      Array.isArray(o.values) && o.values.length ? o.values : fromOptionValues && fromOptionValues.length ? fromOptionValues : [];
    return { ...o, values };
  });
  return { ...product, options };
}

function normalizeProduct(product: any): any {
  if (!product) return null;
  const withOptions = normalizeProductOptions(product);
  return {
    ...withOptions,
    images: withOptions.images,
    variants: withOptions.variants?.edges?.map((edge: any) => edge?.node).filter(Boolean) ?? [],
    metafields: Array.isArray(withOptions.metafields) ? withOptions.metafields.filter(Boolean) : [],
  };
}

async function storefrontRequest<T>(
  query: string,
  variables: Record<string, unknown>,
  currency: SupportedCurrencyCode
): Promise<T | null> {
  if (!canUseStorefrontGraphql()) return null;

  const res = await fetch(`https://${domain}/api/${apiVersion}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
    },
    body: JSON.stringify({
      query,
      variables: {
        ...variables,
        country: marketCountry(currency),
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`Storefront API request failed: ${res.status}`);
  }

  const body = await res.json();
  if (body.errors?.length) {
    console.warn('[Storefront GraphQL] errors (may still return partial data):', body.errors);
  }
  if (body.data == null) {
    const msg = body.errors?.map((err: { message?: string }) => err.message).filter(Boolean).join('; ');
    throw new Error(msg || 'Storefront API returned no data');
  }

  return body.data ?? null;
}

async function fetchPresentmentProductByHandleWithFragment(
  handle: string,
  currency: SupportedCurrencyCode,
  fragmentBlock: string,
  spreadName: 'ProductFields' | 'ProductFieldsMin'
): Promise<any | null> {
  const data = await storefrontRequest<{ product: any | null }>(
    `
      query ProductByHandle($handle: String!, $country: CountryCode)
      @inContext(country: $country) {
        product(handle: $handle) {
          ...${spreadName}
        }
      }
      ${fragmentBlock}
    `,
    { handle },
    currency
  );

  return normalizeProduct(data?.product);
}

async function fetchPresentmentProductByIdWithFragment(
  productId: string,
  currency: SupportedCurrencyCode,
  fragmentBlock: string,
  spreadName: 'ProductFields' | 'ProductFieldsMin'
): Promise<any | null> {
  const data = await storefrontRequest<{ product: any | null }>(
    `
      query ProductById($id: ID!, $country: CountryCode)
      @inContext(country: $country) {
        product(id: $id) {
          ...${spreadName}
        }
      }
      ${fragmentBlock}
    `,
    { id: productId },
    currency
  );

  return normalizeProduct(data?.product);
}

async function fetchPresentmentProductsWithFragment(
  limit: number,
  currency: SupportedCurrencyCode,
  fragmentBlock: string,
  spreadName: 'ProductFields' | 'ProductFieldsMin'
): Promise<any[] | null> {
  const data = await storefrontRequest<{ products: { edges: Array<{ node: any }> } }>(
    `
      query Products($first: Int!, $country: CountryCode)
      @inContext(country: $country) {
        products(first: $first) {
          edges {
            node {
              ...${spreadName}
            }
          }
        }
      }
      ${fragmentBlock}
    `,
    { first: limit },
    currency
  );

  return data?.products?.edges?.map((edge) => normalizeProduct(edge.node)).filter(Boolean) ?? null;
}

export async function fetchPresentmentProductByHandle(handle: string, currencyInput: unknown): Promise<any | null> {
  const currency = resolveCurrency(currencyInput);
  try {
    const p = await fetchPresentmentProductByHandleWithFragment(handle, currency, PRODUCT_FRAGMENT_FULL, 'ProductFields');
    if (p) return p;
  } catch (e) {
    console.warn('[Presentment] Full product query failed, retrying without metafields:', e);
  }
  try {
    return await fetchPresentmentProductByHandleWithFragment(handle, currency, PRODUCT_FRAGMENT_MINIMAL, 'ProductFieldsMin');
  } catch (e2) {
    console.warn('[Presentment] Minimal product query failed:', e2);
    return null;
  }
}

export async function fetchPresentmentProductById(id: string, currencyInput: unknown): Promise<any | null> {
  const currency = resolveCurrency(currencyInput);
  const numericId = id.replace(/\D/g, '');
  const productId = id.startsWith('gid://') ? id : numericId ? `gid://shopify/Product/${numericId}` : '';
  if (!productId) return null;

  try {
    const p = await fetchPresentmentProductByIdWithFragment(productId, currency, PRODUCT_FRAGMENT_FULL, 'ProductFields');
    if (p) return p;
  } catch (e) {
    console.warn('[Presentment] Full product-by-id query failed, retrying without metafields:', e);
  }
  try {
    return await fetchPresentmentProductByIdWithFragment(productId, currency, PRODUCT_FRAGMENT_MINIMAL, 'ProductFieldsMin');
  } catch (e2) {
    console.warn('[Presentment] Minimal product-by-id query failed:', e2);
    return null;
  }
}

export async function fetchPresentmentProducts(limit: number, currencyInput: unknown): Promise<any[] | null> {
  const currency = resolveCurrency(currencyInput);
  try {
    const list = await fetchPresentmentProductsWithFragment(limit, currency, PRODUCT_FRAGMENT_FULL, 'ProductFields');
    if (list?.length) return list;
  } catch (e) {
    console.warn('[Presentment] Full products query failed, retrying without metafields:', e);
  }
  try {
    return await fetchPresentmentProductsWithFragment(limit, currency, PRODUCT_FRAGMENT_MINIMAL, 'ProductFieldsMin');
  } catch (e2) {
    console.warn('[Presentment] Minimal products query failed:', e2);
    return null;
  }
}
