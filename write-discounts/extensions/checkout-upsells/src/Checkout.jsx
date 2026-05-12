/* global shopify */
import "@shopify/ui-extensions/preact";
import { render } from "preact";
import { useEffect, useMemo, useState } from "preact/hooks";

const OFFER_CONFIG = [
  {
    key: "fascilitesRelief",
    handle: "fascilites-relief",
    label: "Bundle",
    description: "Massage Insoles plus Massage Roller for at-home arch relief.",
  },
  {
    key: "heelRelief",
    handle: "heel-relief",
    label: "Bundle",
    description: "Massage Insoles plus Heel Cushions for extra impact support.",
  },
  {
    key: "massageRoller",
    handle: "massage-roller",
    label: "Add-on",
    description: "Roll out sore arches and calves after long days on your feet.",
  },
  {
    key: "massageGun",
    handle: "massage-gun",
    label: "Add-on",
    description: "Percussion relief for tight feet, arches, and calves.",
  },
  {
    key: "heelCushionPads",
    handle: "heel-cushion-pds",
    label: "Add-on",
    description: "Low-profile heel cushioning for hard floors and long shifts.",
  },
  {
    key: "toeCushionPads",
    handle: "toe-cushion-pds",
    label: "Add-on",
    description: "Soft toe protection where shoes rub most.",
  },
];

const BUNDLE_HANDLES = new Set([
  "fascilites-relief",
  "heel-relief",
  "toe-relief",
  "complete-recovery-kit",
]);

const PRODUCT_QUERY = `#graphql
  query CheckoutUpsellProducts {
    fascilitesRelief: product(handle: "fascilites-relief") {
      ...OfferProduct
    }
    heelRelief: product(handle: "heel-relief") {
      ...OfferProduct
    }
    massageRoller: product(handle: "massage-roller") {
      ...OfferProduct
    }
    massageGun: product(handle: "massage-gun") {
      ...OfferProduct
    }
    heelCushionPads: product(handle: "heel-cushion-pds") {
      ...OfferProduct
    }
    toeCushionPads: product(handle: "toe-cushion-pds") {
      ...OfferProduct
    }
  }

  fragment OfferProduct on Product {
    id
    handle
    title
    description
    featuredImage {
      url
      altText
    }
    variants(first: 25) {
      nodes {
        id
        title
        availableForSale
        selectedOptions {
          name
          value
        }
        image {
          url
          altText
        }
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
      }
    }
  }
`;

export default function () {
  render(<Extension />, document.body);
}

function Extension() {
  const { applyCartLinesChange, i18n, lines, query } = shopify;
  const [products, setProducts] = useState([]);
  const [cartLines, setCartLines] = useState(lines.value ?? []);
  const [loading, setLoading] = useState(true);
  const [addingHandle, setAddingHandle] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    return lines.subscribe((nextLines) => setCartLines(nextLines ?? []));
  }, [lines]);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      setLoading(true);
      try {
        const response = await query(PRODUCT_QUERY);
        const data = response?.data ?? {};
        const loaded = OFFER_CONFIG.map((config) => {
          const product = data[config.key];
          return product ? { ...product, offer: config } : null;
        }).filter(Boolean);

        if (!cancelled) setProducts(loaded);
      } catch (loadError) {
        console.error("Failed to load checkout upsells", loadError);
        if (!cancelled) setError("We could not load add-ons right now.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProducts();
    return () => {
      cancelled = true;
    };
  }, [query]);

  const cartProductHandles = useMemo(() => {
    return new Set(
      cartLines
        .map((line) => line?.merchandise?.product?.handle)
        .filter(Boolean)
    );
  }, [cartLines]);

  const visibleProducts = useMemo(() => {
    return products
      .filter((product) => {
        if (cartProductHandles.has(product.handle)) return false;
        return Boolean(selectVariant(product, cartLines));
      })
      .slice(0, 3);
  }, [cartLines, cartProductHandles, products]);

  useEffect(() => {
    if (!error) return undefined;
    const timer = setTimeout(() => setError(""), 4000);
    return () => clearTimeout(timer);
  }, [error]);

  async function addOffer(product) {
    const variant = selectVariant(product, cartLines);
    if (!variant) return;

    setAddingHandle(product.handle);
    setError("");

    const change = {
      type: "addCartLine",
      merchandiseId: variant.id,
      quantity: 1,
    };

    const attributes = getBundleAttributes(product, cartLines);
    if (attributes.length) change.attributes = attributes;

    const result = await applyCartLinesChange(change);
    setAddingHandle("");

    if (result.type === "error") {
      console.error(result.message);
      setError("There was an issue adding this offer. Please try again.");
    }
  }

  if (loading) {
    return (
      <s-section heading="Complete your comfort kit">
        <s-box border="base" borderRadius="base" padding="base">
          <s-text color="subdued">Loading recommended add-ons...</s-text>
        </s-box>
      </s-section>
    );
  }

  if (!visibleProducts.length) return null;

  return (
    <s-section heading="Complete your comfort kit">
      <s-stack direction="block" gap="base">
        <s-paragraph color="subdued">
          Add a recovery essential before you place your order.
        </s-paragraph>

        {error && <s-text tone="critical">{error}</s-text>}

        {visibleProducts.map((product) => {
          const variant = selectVariant(product, cartLines);
          const isAdding = addingHandle === product.handle;
          const price = formatMoney(i18n, variant?.price);
          const compareAt = formatCompareAtMoney(i18n, variant);
          const image = variant?.image ?? product.featuredImage;
          const variantTitle = getVariantTitle(variant);

          return (
            <s-box
              key={product.id}
              border="base"
              borderRadius="base"
              padding="base"
            >
              <s-stack direction="block" gap="base">
                <s-stack direction="inline" gap="base" alignItems="center">
                  {image?.url && (
                    <s-image
                      src={image.url}
                      alt={image.altText || product.title}
                      inlineSize="72px"
                      borderRadius="base"
                    />
                  )}

                  <s-stack direction="block" gap="small-100">
                    <s-text type="small" color="subdued">
                      {product.offer.label}
                    </s-text>
                    <s-text type="strong">{product.title}</s-text>
                    <s-paragraph type="small" color="subdued">
                      {product.offer.description}
                    </s-paragraph>
                    {variantTitle && (
                      <s-text type="small" color="subdued">
                        {variantTitle}
                      </s-text>
                    )}
                    <s-stack direction="inline" gap="small-200">
                      <s-text type="strong">{price}</s-text>
                      {compareAt && (
                        <s-text type="small" color="subdued">
                          Compare at {compareAt}
                        </s-text>
                      )}
                    </s-stack>
                  </s-stack>
                </s-stack>

                <s-button
                  variant="primary"
                  inlineSize="fill"
                  loading={isAdding}
                  disabled={Boolean(addingHandle && !isAdding)}
                  onClick={() => addOffer(product)}
                >
                  Add to order
                </s-button>
              </s-stack>
            </s-box>
          );
        })}
      </s-stack>
    </s-section>
  );
}

function selectVariant(product, cartLines) {
  const variants = product?.variants?.nodes ?? [];
  const availableVariants = variants.filter((variant) => variant.availableForSale);
  const candidates = availableVariants.length ? availableVariants : variants;
  if (!candidates.length) return null;

  const insoleOptions = getInsoleOptions(cartLines);
  const matchedVariant = candidates.find((variant) => {
    const options = variant.selectedOptions ?? [];
    return options.every((option) => {
      const optionName = option.name?.toLowerCase();
      if (optionName === "size" && insoleOptions.size) {
        return option.value === insoleOptions.size;
      }
      if (optionName === "color" && insoleOptions.color) {
        return option.value === insoleOptions.color;
      }
      return true;
    });
  });

  return matchedVariant ?? candidates[0];
}

function getBundleAttributes(product, cartLines) {
  if (!BUNDLE_HANDLES.has(product?.handle)) return [];

  const insoleOptions = getInsoleOptions(cartLines);
  const attributes = [];
  if (insoleOptions.size) attributes.push({ key: "Insole size", value: insoleOptions.size });
  if (insoleOptions.color) attributes.push({ key: "Insole color", value: insoleOptions.color });
  return attributes;
}

function getInsoleOptions(cartLines) {
  const insoleLine = cartLines.find((line) => {
    const product = line?.merchandise?.product;
    const handle = product?.handle?.toLowerCase();
    const title = `${product?.title ?? ""} ${line?.merchandise?.title ?? ""}`.toLowerCase();

    return (
      handle === "massage-insoles" ||
      (title.includes("massage") && title.includes("insole")) ||
      (title.includes("aerotouch") && title.includes("insole"))
    );
  });

  const selectedOptions = insoleLine?.merchandise?.selectedOptions ?? [];
  return {
    size: selectedOptions.find((option) => option.name?.toLowerCase() === "size")?.value,
    color: selectedOptions.find((option) => option.name?.toLowerCase() === "color")?.value,
  };
}

function getVariantTitle(variant) {
  if (!variant?.title || variant.title === "Default Title") return "";
  return variant.title;
}

function formatMoney(i18n, money) {
  const amount = Number(money?.amount ?? 0);
  if (!Number.isFinite(amount)) return "";

  try {
    return i18n.formatCurrency(amount);
  } catch {
    const currency = money?.currencyCode ? `${money.currencyCode} ` : "";
    return `${currency}${amount.toFixed(2)}`;
  }
}

function formatCompareAtMoney(i18n, variant) {
  const price = Number(variant?.price?.amount ?? 0);
  const compareAt = Number(variant?.compareAtPrice?.amount ?? 0);
  if (!Number.isFinite(compareAt) || compareAt <= price) return "";
  return formatMoney(i18n, variant.compareAtPrice);
}
