import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { ProductPage } from './pages/ProductPage';
import { TechnologyPage } from './pages/TechnologyPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { SupportPage } from './pages/SupportPage';
import { CartDrawer } from './components/CartDrawer';
import { SalesBanner } from './components/SalesBanner';
import { DiscountPopup } from './components/DiscountPopup';
import { ReferralPopup } from './components/ReferralPopup';
import { LivePurchaseNotification } from './components/LivePurchaseNotification';
import { Product, CartItem, Page, BlogPost, BundleKit } from './types';
import { shopify } from './utils/shopify';
import { mapShopifyLineItem } from './utils/mapper';
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
import { initGA, logPageView, logAddToCart, logBeginCheckout } from './utils/analytics';
import { isSecondaryProduct } from './utils/productDetection';
import { SizeSelectorModal } from './components/SizeSelectorModal';
import { useRouter } from './utils/router';
import {
  getShopifyHandle,
  getShopifyId,
  getFallbackProduct,
  hasShopifyMapping,
  buildProductFromShopify,
  KNOWN_PRODUCT_IDS
} from './utils/productMapping';

// Import static data for blog posts and bundle kits
import { BLOG_POSTS } from './pages/BlogPage';
import { BUNDLE_KITS } from './pages/BundleKitsPage';

function App() {
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

  // Diagnostic: Log all Shopify products on startup
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
            setCheckoutUrl(checkout.webUrl);
            setCartItems(checkout.lineItems.map(mapShopifyLineItem));
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
        setCheckoutUrl(checkout.webUrl);
      } catch (e) {
        console.error("Failed to create checkout", e);
        setCartError("Failed to initialize checkout. Please refresh.");
      }
    };

    initCheckout();
  }, [checkoutId]);

  // Fetch product when handle changes
  useEffect(() => {
    const fetchProduct = async () => {
      console.log('[App] ============ FETCH PRODUCT START ============');
      console.log('[App] URL param productHandle:', productHandle);

      if (!productHandle) {
        console.log('[App] No product handle, clearing selectedProduct');
        setSelectedProduct(null);
        return;
      }

      // Check if Shopify client is available
      if (!shopify) {
        console.error('[App] Shopify client is not initialized. Check .env file.');
        setProductError('Store configuration error. Please contact support.');
        setIsProductLoading(false);
        return;
      }

      setIsProductLoading(true);
      setProductError(null);

      try {
        // Strategy 1: Use fetchByHandle with handle from mapping or direct
        const shopifyHandle = getShopifyHandle(productHandle);
        console.log('[App] Strategy 1: fetchByHandle with:', shopifyHandle);
        let shopifyProduct = await shopify.product.fetchByHandle(shopifyHandle);
        console.log('[App] fetchByHandle result:', shopifyProduct ? 'SUCCESS' : 'NULL');

        // Strategy 2: If failed and we have a numeric Shopify ID, try fetch(ID)
        if (!shopifyProduct) {
          const shopifyId = getShopifyId(productHandle);
          if (shopifyId) {
            console.log('[App] Strategy 2: fetch with Shopify ID:', shopifyId);
            try {
              shopifyProduct = await shopify.product.fetch(shopifyId);
              console.log('[App] fetch(ID) result:', shopifyProduct ? 'SUCCESS' : 'NULL');
            } catch (e) {
              console.log('[App] fetch(ID) threw error:', e);
            }
          }
        }

        // Strategy 3: Try direct fetch with the param (works if param IS the numeric ID)
        if (!shopifyProduct) {
          console.log('[App] Strategy 3: direct fetch with param:', productHandle);
          try {
            shopifyProduct = await shopify.product.fetch(productHandle);
            console.log('[App] direct fetch result:', shopifyProduct ? 'SUCCESS' : 'NULL');
          } catch (e) {
            console.log('[App] direct fetch threw error:', e);
          }
        }

        if (shopifyProduct) {
          // Build complete product with both ID (Shopify ID) and handle
          const product = buildProductFromShopify(shopifyProduct, productHandle);
          console.log('[App] ✅ Product loaded from Shopify:', product.name);
          console.log('[App]   → product.id:', product.id);
          console.log('[App]   → product.handle:', product.handle);
          console.log('[App]   → productHandle (URL param):', productHandle);
          setSelectedProduct(product);
        } else {
          // Fallback to local data
          console.log('[App] ❌ All Shopify strategies failed, trying fallback...');
          const fallbackProduct = getFallbackProduct(productHandle);
          if (fallbackProduct) {
            console.log('[App] ✅ Using fallback product:', fallbackProduct.name);
            setSelectedProduct(fallbackProduct);
          } else {
            console.log('[App] ❌ Product not found. Known IDs:', KNOWN_PRODUCT_IDS);
            setProductError('Product not found');
            setSelectedProduct(null);
          }
        }
      } catch (error) {
        console.error('[App] Failed to fetch product:', error);
        setProductError('Failed to load product. Please try again.');
        setSelectedProduct(null);
      } finally {
        setIsProductLoading(false);
        console.log('[App] ============ FETCH PRODUCT END ============');
      }
    };

    fetchProduct();
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
      // Use mapped handle for Shopify fetch
      const shopifyHandle = getShopifyHandle(product.id);
      console.log('[Cart] Using handle:', shopifyHandle, 'for product:', product.name);

      let shopifyProduct = await shopify.product.fetchByHandle(shopifyHandle);
      if (!shopifyProduct && hasShopifyMapping(product.id)) {
        shopifyProduct = await shopify.product.fetchByHandle(product.id);
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

      setCartItems(checkout.lineItems.map(mapShopifyLineItem));
      setCheckoutUrl(checkout.webUrl);
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

  const handleAddToCart = async (product: Product, size: string, color: string, quantity = 1, openCart = true): Promise<string | null> => {
    if (!checkoutId || !shopify) return null;
    setIsCartLoading(true);
    setCartError(null);

    try {
      // Use mapped handle for Shopify fetch
      const shopifyHandle = getShopifyHandle(product.id);
      console.log('[Cart] Adding to cart - using handle:', shopifyHandle, 'for product:', product.name);

      let shopifyProduct = await shopify.product.fetchByHandle(shopifyHandle);
      if (!shopifyProduct && hasShopifyMapping(product.id)) {
        shopifyProduct = await shopify.product.fetchByHandle(product.id);
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

      const variant = shopifyProduct.variants.find((v: any) => {
        const vSize = v.selectedOptions.find((o: any) => o.name === 'Size')?.value;
        const vColor = v.selectedOptions.find((o: any) => o.name === 'Color')?.value;
        return vSize === size && vColor === color;
      });

      if (variant) {
        const lineItemsToAdd = [{
          variantId: variant.id,
          quantity: quantity
        }];

        const checkout = await shopify.checkout.addLineItems(checkoutId, lineItemsToAdd);
        setCartItems(checkout.lineItems.map(mapShopifyLineItem));
        setCheckoutUrl(checkout.webUrl);
        logAddToCart(product.name, product.price * quantity);

        if (openCart) {
          setIsCartOpen(true);
        }
        return checkout.webUrl || null;
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
           setCartItems(checkout.lineItems.map(mapShopifyLineItem));
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
         setCartItems(checkout.lineItems.map(mapShopifyLineItem));
     } catch (e) {
        setCartItems(prev => prev.filter(item => !(item.id === id && item.selectedSize === size && item.selectedColor === color)));
     }
  };

  const handleCheckout = () => {
      if (checkoutUrl) {
            setIsCartLoading(true);

            const totalValue = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
            logBeginCheckout(
                cartItems.map(item => ({
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                })),
                totalValue
            );

            window.location.href = checkoutUrl;
        } else {
            console.warn("No checkout URL available");
            setCartError("Checkout link not ready yet. Please try again.");
        }
    };

  const handleBuyNow = async (prod: Product, size: string, col: string, qty = 1) => {
      const directUrl = await handleAddToCart(prod, size, col, qty, false);
      const finalUrl = directUrl || checkoutUrl;

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
            isSecondaryProduct(selectedProduct) ? (
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
          ) : (
            isProductLoading ? (
              <div className="min-h-screen flex items-center justify-center">Loading product...</div>
            ) : productError ? (
              <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
                <button onClick={() => navigate(Page.SHOP)} className="btn btn-primary">
                  Back to Shop
                </button>
              </div>
            ) : null
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
        onCheckout={handleCheckout}
        onMakeItAKit={() => {
          setIsCartOpen(false);
          navigate(Page.HOME);
          setTimeout(() => document.getElementById('recovery-kits')?.scrollIntoView({ behavior: 'smooth' }), 100);
        }}
        isLoading={isCartLoading}
      />

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

export default App;

// Helper to check if a product is main product or accessory
function isMainProduct(product: Product): boolean {
  return !isSecondaryProduct(product);
}
