import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { ProductPage } from './pages/ProductPage';
import { TechnologyPage } from './pages/TechnologyPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { SupportPage } from './pages/SupportPage';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutUpsellModal } from './components/CheckoutUpsellModal';
import { SalesBanner } from './components/SalesBanner';
import { DiscountPopup } from './components/DiscountPopup';
import { ReferralPopup } from './components/ReferralPopup';
import { LivePurchaseNotification } from './components/LivePurchaseNotification';
import { Product, CartItem, Page, BlogPost, BundleKit } from './types';
import { shopify } from './utils/shopify';
import { mapShopifyProduct, mapShopifyLineItem } from './utils/mapper';
import { fetchProductByHandle } from './utils/productFetcher';
import { ShopPage } from './pages/ShopPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { BestSellersPage } from './pages/BestSellersPage';
import { CategoryPage } from './pages/CategoryPage';
import { AccountPage } from './pages/AccountPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { OrderStatusPage } from './pages/OrderStatusPage';
import { ReturnsExchangePage } from './pages/ReturnsExchangePage';
import { SizeGuidePage } from './pages/SizeGuidePage';
import { BundleKitsPage } from './pages/BundleKitsPage';
import { KitProductPage } from './pages/KitProductPage';
import { AccessoriesPage } from './pages/AccessoriesPage';
import { WarrantyPage } from './pages/WarrantyPage';
import { SecondaryProductPage } from './pages/SecondaryProductPage';
import { MassageRollerPage } from './pages/MassageRollerPage';
import { initGA, logPageView, logAddToCart, logBeginCheckout } from './utils/analytics';
import { isSecondaryProduct, isMassageRollerProduct, getProductClassificationDebug } from './utils/productDetection';
import { SizeSelectorModal } from './components/SizeSelectorModal';
import { RouterProvider, useRouter } from './utils/router';
import { ProductPageSkeleton } from './components/ProductPageSkeleton';
import {
  getShopifyHandle,
  getShopifyId,
  getFallbackProduct,
  getCartProductLookupKey,
  hasShopifyMapping,
  KNOWN_PRODUCT_IDS,
  PRODUCT_DATA_MAP
} from './utils/productMapping';
import { resolveMassageInsoleUpsell } from './utils/checkoutUpsell';
import { extractDiscountCodesFromCheckout } from './utils/checkoutPromo';
import { sumCartFinalSubtotals } from './utils/cartLineDisplay';

/**
 * Resolve a Shopify variant for checkout. Only requires Size/Color to match when those
 * options exist on the variant (accessories often use "Title" only — UI defaults like
 * "Black" / "One Size" must not break add-to-cart).
 */
function findCheckoutVariant(shopifyProduct: any, size: string, color: string): any | undefined {
  const variants = shopifyProduct?.variants;
  if (!variants || variants.length === 0) return undefined;

  const match = variants.find((v: any) => {
    const opts = v.selectedOptions || [];
    const opt = (name: string) => opts.find((o: any) => o.name === name)?.value;
    const vSize = opt('Size');
    const vColor = opt('Color');
    if (vSize !== undefined && vSize !== size) return false;
    if (vColor !== undefined && vColor !== color) return false;
    return true;
  });

  if (match) return match;
  if (variants.length === 1) return variants[0];
  return undefined;
}

// Import static data for blog posts and bundle kits
import { BLOG_POSTS } from './pages/BlogPage';
import { BUNDLE_KITS } from './pages/BundleKitsPage';

function AppShell() {
  const { page, params, query, navigate } = useRouter();

  // Derived params
  const category = params.category;
  const searchQuery = query.q || '';
  const productHandle = params.handle;
  const blogSlug = params.slug;
  const kitId = params.kitId;

  // Helper to get URL-safe handle for navigation
  const getProductHandle = (product: Product): string => {
    return product.handle || product.id;
  };

  // Navigation adapter for product selection
  const handleProductSelect = (product: Product) => {
    navigate(Page.PRODUCT, { handle: getProductHandle(product) });
  };

  // Cart & Checkout state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutId, setCheckoutId] = useState<string | null>(localStorage.getItem('shopify_checkout_id'));
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [isCartLoading, setIsCartLoading] = useState(false);
  const [cartError, setCartError] = useState<string | null>(null);
  const [quickAddProduct, setQuickAddProduct] = useState<Product | null>(null);
  /** Store catalog for cart upsells (real Shopify products, mapped) */
  const [shopCatalogProducts, setShopCatalogProducts] = useState<Product[]>([]);
  const [checkoutUpsellOpen, setCheckoutUpsellOpen] = useState(false);

  const checkoutUpsellContext = useMemo(
    () => resolveMassageInsoleUpsell(cartItems),
    [cartItems]
  );

  const cartTotalItemCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const [appliedPromoCodes, setAppliedPromoCodes] = useState<string[]>([]);
  const [promoApplyError, setPromoApplyError] = useState<string | null>(null);

  const applyCartCheckout = useCallback((checkout: any) => {
    if (!checkout) return;
    if (Array.isArray(checkout.lineItems)) {
      setCartItems(checkout.lineItems.map(mapShopifyLineItem));
    } else {
      setCartItems([]);
    }
    if (checkout.webUrl) setCheckoutUrl(checkout.webUrl);
    setAppliedPromoCodes(extractDiscountCodesFromCheckout(checkout));
  }, []);

  // Page-specific data states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductLoading, setIsProductLoading] = useState(false);
  const [productError, setProductError] = useState<string | null>(null);

  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);

  const [selectedKit, setSelectedKit] = useState<BundleKit | null>(null);

  // Analytics
  useEffect(() => {
    initGA();
    logPageView();
  }, []);

  useEffect(() => {
    logPageView();
  }, [page]);

  // Diagnostic: Log all Shopify products on startup + hydrate cart upsell catalog
  useEffect(() => {
    const logShopifyProducts = async () => {
      if (!shopify) {
        console.warn('[Diagnostic] Shopify client not available');
        return;
      }
      try {
        const products = await shopify.product.fetchAll(50);
        console.log('[Diagnostic] ===== ALL SHOPIFY PRODUCTS =====');
        products.forEach(p => {
          console.log(`[Diagnostic] ID: ${p.id} | Handle: ${p.handle} | Title: ${p.title}`);
        });
        console.log('[Diagnostic] ====================================');
        setShopCatalogProducts(products.map(mapShopifyProduct));
      } catch (e) {
        console.error('[Diagnostic] Failed to fetch Shopify products:', e);
      }
    };
    logShopifyProducts();
  }, [shopify]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  // Initialize Checkout
  useEffect(() => {
    const initCheckout = async () => {
      if (!shopify) {
        setCartError("Store is temporarily unavailable. Please try again later.");
        return;
      }

      if (checkoutId) {
        try {
          const checkout = await shopify.checkout.fetch(checkoutId);
          if (checkout && !checkout.completedAt) {
            applyCartCheckout(checkout);
            return;
          }
        } catch (e) {
          console.warn("Invalid or expired checkout, creating new one.");
          localStorage.removeItem('shopify_checkout_id');
        }
      }

      try {
        const checkout = await shopify.checkout.create();
        setCheckoutId(String(checkout.id));
        localStorage.setItem('shopify_checkout_id', String(checkout.id));
        applyCartCheckout(checkout);
      } catch (e) {
        console.error("Failed to create checkout", e);
        setCartError("Failed to initialize checkout. Please refresh.");
      }
    };

    initCheckout();
  }, [checkoutId, applyCartCheckout]);

  // Fetch product when handle changes
  useEffect(() => {
    let requestId = 0;
    let isMounted = true;

    console.log('[App] fetchProduct effect triggered with productHandle:', productHandle);

    const fetchProduct = async () => {
      requestId++;
      const currentRequestId = requestId;
      console.log('[App] ============ FETCH PRODUCT START ============');
      console.log('[App] URL param productHandle:', productHandle);
      console.log('[App] Request ID:', currentRequestId);

      if (!productHandle) {
        console.log('[App] No product handle, clearing selectedProduct');
        if (isMounted) setSelectedProduct(null);
        return;
      }

      setIsProductLoading(true);
      if (isMounted) setProductError(null);

      try {
        console.log('[App] Fetching product...');
        const shopifyHandle = getShopifyHandle(productHandle);
        console.log('[App] Using handle:', shopifyHandle);

        const product = await fetchProductByHandle(shopifyHandle);

        // Ignore if this request is not the latest
        if (currentRequestId !== requestId) {
          console.log('[App] ⚠️ Stale response, ignoring (expected:', requestId, 'got:', currentRequestId, ')');
          return;
        }

        if (product) {
          console.log('[App] ✅ Product loaded from Shopify');
          console.log('[App]   → product.id (raw):', product.id);
          console.log('[App]   → product.handle (raw):', product.handle);
          console.log('[App]   → productHandle (URL param):', productHandle);

          // Map Shopify product to our Product type
          const mappedProduct = mapShopifyProduct(product);
          console.log('[App]   → mapped product.name:', mappedProduct.name);
          console.log('[App]   → mapped product.id:', mappedProduct.id);
          console.log('[App]   → mapped product.handle:', mappedProduct.handle);

          const debug = getProductClassificationDebug(mappedProduct);
          console.log('[App]   → Classification:', debug.type);
          console.log('[App]   → Tags:', mappedProduct.tags);
          if (mappedProduct.metafields) {
            console.log('[App]   → Metafields:', Object.keys(mappedProduct.metafields));
          }

          if (isMounted) setSelectedProduct(mappedProduct);
        } else {
          console.log('[App] ❌ Shopify fetch returned null');
          console.log('[App] Attempting fallback for handle:', productHandle);
          console.log('[App] Known fallback IDs:', Object.keys(PRODUCT_DATA_MAP));
          const fallbackProduct = getFallbackProduct(productHandle);
          if (fallbackProduct) {
            console.log('[App] ✅ Using fallback product:', fallbackProduct.name);
            console.log('[App]   → product.id:', fallbackProduct.id);

            const debug = getProductClassificationDebug(fallbackProduct);
            console.log('[App]   → Classification:', debug.type);
            console.log('[App]   → Tags:', fallbackProduct.tags);

            if (isMounted) setSelectedProduct(fallbackProduct);
          } else {
            console.log('[App] ❌ No fallback data available for:', productHandle);
            console.log('[App] Available fallback products:', Object.keys(PRODUCT_DATA_MAP));
            if (isMounted && currentRequestId === requestId) {
              setProductError('Product not found');
              setSelectedProduct(null);
            }
          }
        }
      } catch (error) {
        console.error('[App] Failed to fetch product:', error);
        if (isMounted && currentRequestId === requestId) {
          setProductError('Failed to load product. Please try again.');
          setSelectedProduct(null);
        }
      } finally {
        if (isMounted && currentRequestId === requestId) {
          setIsProductLoading(false);
          console.log('[App] ============ FETCH PRODUCT END ============');
        }
      }
    };

    fetchProduct();

    return () => {
      isMounted = false;
      console.log('[App] fetchProduct cleanup - isMounted set to false (requestId was:', requestId, ')');
    };
  }, [productHandle]);

  // Fetch blog post when slug changes
  useEffect(() => {
    if (!blogSlug) {
      setSelectedBlogPost(null);
      return;
    }
    const post = BLOG_POSTS.find(p => p.id === blogSlug);
    setSelectedBlogPost(post || null);
  }, [blogSlug]);

  // Fetch kit when kitId changes
  useEffect(() => {
    if (!kitId) {
      setSelectedKit(null);
      return;
    }
    const kit = BUNDLE_KITS.find(k => k.id === kitId);
    setSelectedKit(kit || null);
  }, [kitId]);

  // Cart functions
  const handleQuickAddToCart = async (product: Product) => {
    if (isMainProduct(product)) {
      setQuickAddProduct(product);
      return;
    }

    if (!checkoutId || !shopify) return;
    setIsCartLoading(true);
    setCartError(null);

    try {
      const lookupKey = getCartProductLookupKey(product);
      const shopifyHandle = getShopifyHandle(lookupKey);
      console.log('[Cart] Using handle:', shopifyHandle, 'lookupKey:', lookupKey, 'for product:', product.name);

      let shopifyProduct = await shopify.product.fetchByHandle(shopifyHandle);
      if (!shopifyProduct && hasShopifyMapping(lookupKey)) {
        shopifyProduct = await shopify.product.fetchByHandle(lookupKey);
      }
      if (!shopifyProduct) {
        shopifyProduct = await shopify.product.fetch(product.id);
      }

      if (!shopifyProduct?.variants?.length) {
        console.error('No variants found for product', product.id);
        setCartError('Product not available.');
        setIsCartLoading(false);
        return;
      }

      const firstVariant = shopifyProduct.variants[0];
      const checkout = await shopify.checkout.addLineItems(checkoutId, [
        { variantId: firstVariant.id, quantity: 1 },
      ]);

      applyCartCheckout(checkout);
      logAddToCart(product.name, product.price);
      setIsCartOpen(true);
    } catch (e) {
      console.error('Quick add to cart failed', e);
      setCartError('Failed to add to cart. Please try again.');
    } finally {
      setIsCartLoading(false);
    }
  };

  const handleSizeSelectConfirm = async (product: Product, size: string, color: string, quantity: number) => {
    setQuickAddProduct(null);
    await handleAddToCart(product, size, color, quantity);
  };

  const handleAddToCart = async (
    product: Product,
    size: string,
    color: string,
    quantity = 1,
    openCart = true
  ): Promise<{ webUrl: string | null; lineItems: CartItem[] } | null> => {
    if (!checkoutId || !shopify) return null;
    setIsCartLoading(true);
    setCartError(null);

    try {
      const lookupKey = getCartProductLookupKey(product);
      const shopifyHandle = getShopifyHandle(lookupKey);
      console.log('[Cart] Adding to cart - using handle:', shopifyHandle, 'lookupKey:', lookupKey, 'for product:', product.name);

      let shopifyProduct = await shopify.product.fetchByHandle(shopifyHandle);
      if (!shopifyProduct && hasShopifyMapping(lookupKey)) {
        shopifyProduct = await shopify.product.fetchByHandle(lookupKey);
      }
      if (!shopifyProduct) {
        shopifyProduct = await shopify.product.fetch(product.id);
      }

      if (!shopifyProduct) {
        console.error("Product not found with any method");
        setCartError("Product not found");
        setIsCartLoading(false);
        return null;
      }

      const variant = findCheckoutVariant(shopifyProduct, size, color);

      if (variant) {
        const lineItemsToAdd = [{
          variantId: variant.id,
          quantity: quantity
        }];

        const checkout = await shopify.checkout.addLineItems(checkoutId, lineItemsToAdd);
        applyCartCheckout(checkout);
        const lineItems = checkout.lineItems.map(mapShopifyLineItem);
        logAddToCart(product.name, product.price * quantity);

        if (openCart) {
          setIsCartOpen(true);
        }
        return { webUrl: checkout.webUrl || null, lineItems };
      } else {
        console.error("Variant not found for", size, color);
        setCartError(`Variant not found: ${size} / ${color}`);
        return null;
      }
    } catch(e) {
      console.error("Add to cart failed", e);
      setCartError("Connection failed. Please try again.");
      return null;
    } finally {
      setIsCartLoading(false);
    }
  };

  const updateQuantity = async (id: string, size: string, color: string, delta: number) => {
    if (!checkoutId || !shopify) return;

    try {
        const item = cartItems.find(i => i.id === id);
        if (item) {
           const newQty = item.quantity + delta;
           if (newQty < 1) return;

           const lineItemsToUpdate = [{ id: id, quantity: newQty }];
           const checkout = await shopify.checkout.updateLineItems(checkoutId, lineItemsToUpdate);
           applyCartCheckout(checkout);
        }
    } catch (e) {
        setCartItems(prev => prev.map(item => {
        if (item.id === id && item.selectedSize === size && item.selectedColor === color) {
            return { ...item, quantity: Math.max(1, item.quantity + delta) };
        }
        return item;
        }));
    }
  };

  const removeItem = async (id: string, size: string, color: string) => {
     if (!checkoutId || !shopify) return;
     try {
         const checkout = await shopify.checkout.removeLineItems(checkoutId, [id]);
         applyCartCheckout(checkout);
     } catch (e) {
        setCartItems(prev => prev.filter(item => !(item.id === id && item.selectedSize === size && item.selectedColor === color)));
     }
  };

  const applyPromoCode = useCallback(
    async (rawCode: string) => {
      const code = rawCode.trim();
      if (!checkoutId || !shopify || !code) return;
      setPromoApplyError(null);
      setIsCartLoading(true);
      try {
        const checkout = await shopify.checkout.addDiscount(checkoutId, code);
        if (checkout.userErrors?.length) {
          setPromoApplyError(
            checkout.userErrors
              .map((u: { message?: string }) => u.message)
              .filter(Boolean)
              .join(' ') || 'Could not apply code.'
          );
          return;
        }
        applyCartCheckout(checkout);
      } catch (e: unknown) {
        let msg = 'Could not apply this code.';
        if (Array.isArray(e)) {
          msg = e.map((x: { message?: string }) => x.message || String(x)).join(' ');
        } else if (e instanceof Error && e.message) {
          msg = e.message;
        }
        setPromoApplyError(msg);
      } finally {
        setIsCartLoading(false);
      }
    },
    [checkoutId, shopify, applyCartCheckout]
  );

  const removePromoCodes = useCallback(async () => {
    if (!checkoutId || !shopify) return;
    setPromoApplyError(null);
    setIsCartLoading(true);
    try {
      const checkout = await shopify.checkout.removeDiscount(checkoutId);
      applyCartCheckout(checkout);
    } catch (e: unknown) {
      let msg = 'Could not remove promo.';
      if (Array.isArray(e)) {
        msg = e.map((x: { message?: string }) => x.message || String(x)).join(' ');
      } else if (e instanceof Error && e.message) {
        msg = e.message;
      }
      setPromoApplyError(msg);
    } finally {
      setIsCartLoading(false);
    }
  }, [checkoutId, shopify, applyCartCheckout]);

  const proceedToHostedCheckout = useCallback(
    (opts?: { lineItems?: CartItem[]; webUrl?: string | null }) => {
      const url = opts?.webUrl ?? checkoutUrl;
      if (!url) {
        console.warn("No checkout URL available");
        setCartError("Checkout link not ready yet. Please try again.");
        return;
      }
      setIsCartLoading(true);
      const items = opts?.lineItems ?? cartItems;
      const totalValue = sumCartFinalSubtotals(items);
      logBeginCheckout(
        items.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        totalValue
      );
      window.location.href = url;
    },
    [checkoutUrl, cartItems]
  );

  const handleCartCheckoutClick = useCallback(() => {
    if (!checkoutUrl || cartItems.length === 0) {
      setCartError("Checkout link not ready yet. Please try again.");
      return;
    }
    if (checkoutUpsellContext) {
      setCheckoutUpsellOpen(true);
      return;
    }
    proceedToHostedCheckout();
  }, [checkoutUrl, cartItems.length, checkoutUpsellContext, proceedToHostedCheckout]);

  const handleBuyNow = async (prod: Product, size: string, col: string, qty = 1) => {
    const result = await handleAddToCart(prod, size, col, qty, false);
    const finalUrl = result?.webUrl || checkoutUrl;

    if (finalUrl) {
      window.location.href = finalUrl;
      return;
    }

    setCartError("Checkout link not ready yet. Please try again.");
  };

  const handleAddKitToCart = (kit: BundleKit, quantity = 1) => {
    const kitAsProduct: Product = {
      id: kit.id,
      name: kit.name,
      price: kit.price,
      image: kit.image,
      description: kit.items.join(', '),
      features: kit.items,
      rating: 5,
      reviews: 0,
      tagline: 'Bundle Kit'
    };
    handleAddToCart(kitAsProduct, 'Standard', 'One Size', quantity);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        cartCount={cartItems.reduce((a,c) => a + c.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
        onNavigate={(page, category) => {
          if (page === Page.CATEGORY && category) {
            navigate(page, { category });
          } else {
            navigate(page);
          }
        }}
        onSearch={(query) => {
          navigate(Page.SEARCH, {}, { q: query });
        }}
        searchQuery={searchQuery}
        transparentMode={page === Page.HOME}
        forceWhite={page === Page.SUPPORT || page === Page.ORDER_STATUS || page === Page.RETURNS_EXCHANGE || page === Page.SIZE_GUIDE || page === Page.WARRANTY}
      />

      <SalesBanner />

      <main className="flex-grow">
        {page === Page.HOME && (
          <LandingPage
            onProductSelect={handleProductSelect}
            onQuickAddToCart={handleQuickAddToCart}
            onCategorySelect={(cat) => navigate(Page.CATEGORY, { category: cat })}
            onShopSaleClick={() => navigate(Page.SHOP)}
            onKitSelect={(kit) => navigate(Page.KIT_PRODUCT, { kitId: kit.id })}
            onAddKitToCart={handleAddKitToCart}
          />
        )}

        {page === Page.PRODUCT && (
          selectedProduct ? (
            isMassageRollerProduct(selectedProduct) ? (
              <MassageRollerPage
                product={selectedProduct}
                onAddToCart={handleAddToCart}
                onBack={() => navigate(Page.SHOP)}
                onProductSelect={handleProductSelect}
                isLoading={isCartLoading}
                error={cartError}
              />
            ) : isSecondaryProduct(selectedProduct) ? (
              <SecondaryProductPage
                product={selectedProduct}
                onAddToCart={handleAddToCart}
                onBack={() => navigate(Page.SHOP)}
                onProductSelect={handleProductSelect}
                isLoading={isCartLoading}
                error={cartError}
              />
            ) : (
              <ProductPage
                product={selectedProduct}
                onAddToCart={handleAddToCart}
                onBack={() => navigate(Page.SHOP)}
                onProductSelect={handleProductSelect}
                onNavigateToBlog={() => navigate(Page.BLOG)}
                isLoading={isCartLoading}
                error={cartError}
                onBuyNow={handleBuyNow}
              />
            )
          ) : productError ? (
            <div className="min-h-screen flex flex-col items-center justify-center">
              <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
              <button onClick={() => navigate(Page.SHOP)} className="btn btn-primary">
                Back to Shop
              </button>
            </div>
          ) : (
            <ProductPageSkeleton />
          )
        )}

        {page === Page.SHOP && (
          <ShopPage
            onProductSelect={handleProductSelect}
            onQuickAddToCart={handleQuickAddToCart}
          />
        )}

        {page === Page.SEARCH && (
          <SearchResultsPage
            searchQuery={searchQuery}
            onProductSelect={handleProductSelect}
            onQuickAddToCart={handleQuickAddToCart}
          />
        )}

        {page === Page.CATEGORY && (
          <CategoryPage
            category={category || 'All'}
            onProductSelect={handleProductSelect}
            onQuickAddToCart={handleQuickAddToCart}
            onNavigateToBlog={() => navigate(Page.BLOG)}
          />
        )}

        {page === Page.BEST_SELLERS && (
          <BestSellersPage
            onProductSelect={handleProductSelect}
            onQuickAddToCart={handleQuickAddToCart}
          />
        )}

        {page === Page.TECHNOLOGY && (
          <TechnologyPage
            onShopNow={() => navigate(Page.SHOP)}
          />
        )}

        {page === Page.BLOG && (
          <BlogPage onPostSelect={(post) => navigate(Page.BLOG_POST, { slug: post.id })} />
        )}

        {page === Page.BLOG_POST && (
          selectedBlogPost ? (
            <BlogPostPage
              post={selectedBlogPost}
              onBack={() => navigate(Page.BLOG)}
            />
          ) : (
            <div className="min-h-screen flex items-center justify-center">Blog post not found</div>
          )
        )}

        {page === Page.SUPPORT && (
          <SupportPage onNavigate={(page, category) => navigate(page, category ? { category } : {})} />
        )}

        {page === Page.ACCOUNT && (
          <AccountPage />
        )}

        {page === Page.TRACK_ORDER && (
          <TrackOrderPage />
        )}

        {page === Page.ORDER_STATUS && (
          <OrderStatusPage />
        )}

        {page === Page.RETURNS_EXCHANGE && (
          <ReturnsExchangePage />
        )}

        {page === Page.SIZE_GUIDE && (
          <SizeGuidePage />
        )}

        {page === Page.WARRANTY && (
          <WarrantyPage />
        )}

        {page === Page.BUNDLE_KITS && (
          <BundleKitsPage
            onBack={() => navigate(Page.HOME)}
            onKitSelect={(kit) => navigate(Page.KIT_PRODUCT, { kitId: kit.id })}
            onAddKitToCart={handleAddKitToCart}
          />
        )}

        {page === Page.KIT_PRODUCT && (
          selectedKit ? (
            <KitProductPage
              kit={selectedKit}
              onBack={() => navigate(Page.BUNDLE_KITS)}
              onAddToCart={handleAddKitToCart}
            />
          ) : (
            <div className="min-h-screen flex items-center justify-center">Kit not found</div>
          )
        )}

        {page === Page.ACCESSORIES && (
          <AccessoriesPage
            onProductSelect={handleProductSelect}
            onQuickAddToCart={handleQuickAddToCart}
            onNavigateToBlog={() => navigate(Page.BLOG)}
          />
        )}

        {page === Page.NOT_FOUND && (
          <div className="min-h-screen flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold mb-4">404</h1>
            <p className="text-lg mb-8">Page not found</p>
            <button onClick={() => navigate(Page.HOME)} className="btn btn-primary">
              Go Home
            </button>
          </div>
        )}
      </main>

      <Footer />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onCheckout={handleCartCheckoutClick}
        onMakeItAKit={() => {
          setIsCartOpen(false);
          navigate(Page.HOME);
          setTimeout(() => document.getElementById('recovery-kits')?.scrollIntoView({ behavior: 'smooth' }), 100);
        }}
        isLoading={isCartLoading}
        shopProducts={shopCatalogProducts}
        onUpsellAdd={handleQuickAddToCart}
        onUpsellView={product => {
          setIsCartOpen(false);
          handleProductSelect(product);
        }}
        appliedPromoCodes={appliedPromoCodes}
        promoApplyError={promoApplyError}
        onApplyPromoCode={applyPromoCode}
        onRemovePromoCodes={removePromoCodes}
        onDismissPromoError={() => setPromoApplyError(null)}
      />

      {checkoutUpsellContext && (
        <CheckoutUpsellModal
          isOpen={checkoutUpsellOpen}
          onClose={() => {
            setCheckoutUpsellOpen(false);
            proceedToHostedCheckout();
          }}
          upsellProduct={checkoutUpsellContext.product}
          cartTotalItemCount={cartTotalItemCount}
          defaultSize={checkoutUpsellContext.defaultSize}
          defaultColor={checkoutUpsellContext.defaultColor}
          isLoading={isCartLoading}
          onAddPairs={async (product, size, color) => {
            const result = await handleAddToCart(product, size, color, 2, false);
            setCheckoutUpsellOpen(false);
            if (result) {
              proceedToHostedCheckout({ lineItems: result.lineItems, webUrl: result.webUrl });
            } else {
              proceedToHostedCheckout();
            }
          }}
          onDecline={() => {
            setCheckoutUpsellOpen(false);
            proceedToHostedCheckout();
          }}
        />
      )}

      <DiscountPopup />
      <ReferralPopup />
      <LivePurchaseNotification onCtaClick={() => {
        // Use the handle from mapping for SEO-friendly URL
        const handle = getShopifyHandle('massage-insoles');
        navigate(Page.PRODUCT, { handle });
      }} />

      {quickAddProduct && (
        <SizeSelectorModal
          product={quickAddProduct}
          isOpen={!!quickAddProduct}
          onClose={() => setQuickAddProduct(null)}
          onConfirm={handleSizeSelectConfirm}
          isLoading={isCartLoading}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <AppShell />
    </RouterProvider>
  );
}

// Helper to check if a product is main product or accessory
function isMainProduct(product: Product): boolean {
  return !isSecondaryProduct(product);
}
