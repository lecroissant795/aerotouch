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
import { Product, CartItem, Page, BlogPost, BundleKit } from './types';
import { shopify } from './utils/shopify';
import { mapShopifyLineItem } from './utils/mapper';
import { ShopPage } from './pages/ShopPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { BestSellersPage } from './pages/BestSellersPage';
import { CategoryPage } from './pages/CategoryPage';
import { AccountPage } from './pages/AccountPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { BundleKitsPage } from './pages/BundleKitsPage';
import { KitProductPage } from './pages/KitProductPage';
import { initGA, logPageView, logAddToCart } from './utils/analytics';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);
  const [selectedKit, setSelectedKit] = useState<BundleKit | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutId, setCheckoutId] = useState<string | null>(localStorage.getItem('shopify_checkout_id'));
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

  useEffect(() => {
    initGA();
    logPageView();
  }, []);

  useEffect(() => {
    logPageView();
  }, [currentPage]);


  // Initialize Checkout
  useEffect(() => {
     const initCheckout = async () => {
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
             }
         }
         
         // Create new checkout
         try {
             const checkout = await shopify.checkout.create();
             setCheckoutId(String(checkout.id));
             localStorage.setItem('shopify_checkout_id', String(checkout.id));
             setCheckoutUrl(checkout.webUrl);
         } catch (e) {
             console.error("Failed to create checkout", e);
         }
     };
     
     initCheckout();
  }, [checkoutId]); // Dependency on checkoutId to retry if it changes/clears


  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage(Page.PRODUCT);
    window.scrollTo(0, 0);
  };

  const handleAddToCart = async (product: Product, size: string, color: string, quantity = 1) => {
    if (!checkoutId) return;

    // We need to find the specific variant ID for this combination
    // This assumes we have fetched the product with variants in ProductPage or elsewhere.
    // However, here we only get the 'product' object which might be the mapped one.
    // Ideally, pass the Variant ID directly from ProductPage.
    // Since we don't have it here easily without refetching or passing it, 
    // we will fetch the product again or rely on ProductPage to pass the variant ID ? 
    //
    // BETTER APPROACH: Update ProductPage onAddToCart signature or pass the variant ID.
    // For now, let's fetch the product by ID (which is the handle or ID) and find value.
    // But `product` passed here is the internal type.
    
    // To unblock, we will try to find the variant ID from the product object if it was enriched,
    // OR we do a quick fetch here.
    
    try {
        const shopifyProduct = await shopify.product.fetch(product.id); // Assuming ID is valid
        if (!shopifyProduct) {
             console.error("Product not found");
             return;
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
            setIsCartOpen(true);
            logAddToCart(product.name, product.price * quantity);
        } else {
             // Fallback: Just add first variant or error
             console.error("Variant not found for", size, color);
             // Try adding first variant just to show it works? No, that's bad UX.
             // If local mock data is used, this will fail.
        }
    } catch(e) {
        console.error("Add to cart failed", e);
        // Fallback for local dev/demo
        const qtyToAdd = Math.max(1, Math.floor(quantity));
        setCartItems(prev => {
            const existing = prev.find(item => item.id === product.id && item.selectedSize === size && item.selectedColor === color);
            if (existing) {
                return prev.map(item => 
                item.id === product.id && item.selectedSize === size && item.selectedColor === color
                    ? { ...item, quantity: item.quantity + qtyToAdd } 
                    : item
                );
            }
            return [...prev, { ...product, quantity: qtyToAdd, selectedSize: size, selectedColor: color }];
        });
        setIsCartOpen(true);
    }
  };

  const updateQuantity = async (id: string, size: string, color: string, delta: number) => {
    if (!checkoutId) return;
    
    // id here is the Line Item ID for Shopify items, but Product ID for local items
    // If it's a shopify item, we use updateLineItems
    
    try {
        const item = cartItems.find(i => i.id === id); // id is line item ID for shopify
        if (item) {
           const newQty = item.quantity + delta;
           if (newQty < 1) return; // or remove? usually we have explicit remove.

           const lineItemsToUpdate = [{ id: id, quantity: newQty }];
           const checkout = await shopify.checkout.updateLineItems(checkoutId, lineItemsToUpdate);
           setCartItems(checkout.lineItems.map(mapShopifyLineItem));
        }
    } catch (e) {
        // Fallback
        setCartItems(prev => prev.map(item => {
        if (item.id === id && item.selectedSize === size && item.selectedColor === color) {
            return { ...item, quantity: Math.max(1, item.quantity + delta) };
        }
        return item;
        }));
    }
  };

  const removeItem = async (id: string, size: string, color: string) => {
     if (!checkoutId) return;
     try {
         // id is line Item ID
         const checkout = await shopify.checkout.removeLineItems(checkoutId, [id]);
         setCartItems(checkout.lineItems.map(mapShopifyLineItem));
     } catch (e) {
        setCartItems(prev => prev.filter(item => !(item.id === id && item.selectedSize === size && item.selectedColor === color)));
     }
  };

  const handleCheckout = () => {
      if (checkoutUrl) {
          window.location.href = checkoutUrl;
      } else {
          console.warn("No checkout URL available");
      }
  };

  const handleNavigate = (page: Page, category?: string) => {
    setCurrentPage(page);
    if (category) {
        setSelectedCategory(category);
    }
    window.scrollTo(0, 0);
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
        onNavigate={handleNavigate}
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
        transparentMode={currentPage === Page.HOME || currentPage === Page.TECHNOLOGY}
        forceWhite={currentPage === Page.SUPPORT}
      />
      
      <SalesBanner />
      
      <main className="flex-grow">
        {currentPage === Page.HOME && (
          <LandingPage
            onProductSelect={handleProductSelect}
            onCategorySelect={(cat) => handleNavigate(Page.CATEGORY, cat)}
            onShopSaleClick={() => handleNavigate(Page.SHOP)}
            onKitSelect={(kit) => {
              setSelectedKit(kit);
              setCurrentPage(Page.KIT_PRODUCT);
              window.scrollTo(0, 0);
            }}
            onAddKitToCart={handleAddKitToCart}
          />
        )}
        
        {currentPage === Page.PRODUCT && selectedProduct && (
          <ProductPage 
            product={selectedProduct} 
            onAddToCart={handleAddToCart}
            onBack={() => handleNavigate(Page.SHOP)}
            onProductSelect={handleProductSelect}
            onNavigateToBlog={() => handleNavigate(Page.BLOG)}
          />
        )}

        {currentPage === Page.SHOP && (
          <ShopPage onProductSelect={handleProductSelect} />
        )}

        {currentPage === Page.SEARCH && (
          <SearchResultsPage
            searchQuery={searchQuery}
            onProductSelect={handleProductSelect}
          />
        )}

        {currentPage === Page.CATEGORY && (
          <CategoryPage 
            category={selectedCategory}
            onProductSelect={handleProductSelect}
            onNavigateToBlog={() => handleNavigate(Page.BLOG)}
          />
        )}

        {currentPage === Page.BEST_SELLERS && (
          <BestSellersPage 
            onProductSelect={handleProductSelect}
          />
        )}

        {currentPage === Page.TECHNOLOGY && (
          <TechnologyPage 
            onShopNow={() => handleNavigate(Page.SHOP)}
          />
        )}

        {currentPage === Page.BLOG && (
          <BlogPage onPostSelect={(post) => { setSelectedBlogPost(post); setCurrentPage(Page.BLOG_POST); window.scrollTo(0, 0); }} />
        )}

        {currentPage === Page.BLOG_POST && selectedBlogPost && (
          <BlogPostPage
            post={selectedBlogPost}
            onBack={() => { setCurrentPage(Page.BLOG); setSelectedBlogPost(null); window.scrollTo(0, 0); }}
          />
        )}

        {currentPage === Page.SUPPORT && (
          <SupportPage />
        )}

        {currentPage === Page.ACCOUNT && (
          <AccountPage />
        )}

        {currentPage === Page.TRACK_ORDER && (
          <TrackOrderPage />
        )}

        {currentPage === Page.BUNDLE_KITS && (
          <BundleKitsPage
            onBack={() => handleNavigate(Page.HOME)}
            onKitSelect={(kit) => {
              setSelectedKit(kit);
              setCurrentPage(Page.KIT_PRODUCT);
              window.scrollTo(0, 0);
            }}
            onAddKitToCart={handleAddKitToCart}
          />
        )}

        {currentPage === Page.KIT_PRODUCT && selectedKit && (
          <KitProductPage
            kit={selectedKit}
            onBack={() => {
              setSelectedKit(null);
              handleNavigate(Page.BUNDLE_KITS);
            }}
            onAddToCart={handleAddKitToCart}
          />
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
          handleNavigate(Page.HOME);
          setTimeout(() => document.getElementById('recovery-kits')?.scrollIntoView({ behavior: 'smooth' }), 100);
        }}
      />

      <DiscountPopup />
      <ReferralPopup />
    </div>
  );
}

export default App;
