import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Menu, X, Search, ChevronDown } from 'lucide-react';
import { Page } from '../types';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
  onNavigate: (page: Page, category?: string) => void;
  onSearch?: (query: string) => void;
  searchQuery?: string;
  transparentMode?: boolean;
  forceWhite?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ cartCount, onCartClick, onNavigate, onSearch, searchQuery = '', transparentMode = false, forceWhite = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShopHovered, setIsShopHovered] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchQuery);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const q = searchInput.trim();
    if (onSearch && q) {
      onSearch(q);
      onNavigate(Page.SEARCH);
      setIsSearchOpen(false);
      setIsMobileMenuOpen(false);
    } else if (q) {
      onNavigate(Page.SEARCH);
      setIsSearchOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getTextColor = () => {
    if (isMobileMenuOpen) return 'text-brand-dark'; 
    if (isShopHovered) return 'text-brand-dark'; 
    if (forceWhite) return 'text-brand-dark';
    if (isScrolled) return 'text-brand-dark';
    if (transparentMode) return 'text-white';
    return 'text-brand-dark';
  };

  const getBgColor = () => {
    if (isMobileMenuOpen) return 'bg-white shadow-sm py-4'; 
    if (isShopHovered) return 'bg-white shadow-sm py-4'; 
    if (forceWhite) return 'bg-white shadow-sm py-4';
    if (isScrolled) return 'bg-white/90 backdrop-blur-md shadow-sm py-4';
    return 'bg-transparent py-6';
  };

  const textColorClass = getTextColor();
  const isTransparentState = !isScrolled && transparentMode && !isShopHovered && !isMobileMenuOpen;

  const handleNavClick = (item: string) => {
    if (item === 'Blog') {
      onNavigate(Page.BLOG);
      setIsMobileMenuOpen(false);
    } else if (item === 'Support') {
      onNavigate(Page.SUPPORT);
      setIsMobileMenuOpen(false);
    } else if (item === 'Track Your Order') {
      onNavigate(Page.TRACK_ORDER);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${getBgColor()}`}
      onMouseLeave={() => setIsShopHovered(false)}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer group"
            onClick={() => onNavigate(Page.HOME)}
          >
            <span className={`text-2xl font-bold tracking-tight ${textColorClass}`}>
              Aero<span className={isTransparentState ? 'text-brand-lime' : 'text-brand-orange'}>Touch</span>
            </span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8 h-full">
            <div 
                className="h-full flex items-center"
                onMouseEnter={() => setIsShopHovered(true)}
            >
                <button 
                    className={`text-sm font-medium transition-colors flex items-center gap-1 py-2 ${textColorClass} ${isTransparentState ? 'hover:text-brand-lime' : 'hover:text-brand-orange'}`}
                    onClick={() => { onSearch?.(''); onNavigate(Page.SHOP); }}
                >
                    Shop
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isShopHovered ? 'rotate-180' : ''}`} />
                </button>
            </div>

            {['Blog', 'Support', 'Track Your Order'].map((item) => (
              <a 
                key={item} 
                href="#" 
                className={`text-sm font-medium transition-colors ${textColorClass} ${isTransparentState ? 'hover:text-brand-lime' : 'hover:text-brand-orange'}`}
                onClick={(e) => { e.preventDefault(); handleNavClick(item); }}
              >
                {item}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className={`flex items-center space-x-4 ${textColorClass}`}>
            {/* Desktop search: expandable bar */}
            <div className="hidden md:flex items-center">
              {isSearchOpen ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center gap-1 bg-white/90 rounded-full pl-4 pr-2 py-1.5 min-w-[200px] shadow-sm border border-slate-200">
                  <input
                    ref={searchInputRef}
                    type="search"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onBlur={() => { if (!searchInput.trim()) setIsSearchOpen(false); }}
                    onKeyDown={(e) => e.key === 'Escape' && (setIsSearchOpen(false), searchInputRef.current?.blur())}
                    placeholder="Search products..."
                    className="bg-transparent border-0 outline-none text-brand-dark text-sm w-full placeholder:text-slate-400"
                    aria-label="Search products"
                  />
                  <button type="submit" className={`p-1.5 rounded-full ${isTransparentState ? 'hover:bg-brand-lime/20 text-brand-lime' : 'hover:bg-brand-orange/20 text-brand-orange'}`} aria-label="Submit search">
                    <Search className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(true)}
                  className={`p-2 transition-colors ${isTransparentState ? 'hover:text-brand-lime' : 'hover:text-brand-orange'}`}
                  aria-label="Open search"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>
            
            <button 
              className={`relative p-2 transition-colors ${isTransparentState ? 'hover:text-brand-lime' : 'hover:text-brand-orange'}`}
              onClick={onCartClick}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className={`absolute top-0 right-0 w-4 h-4 text-xs flex items-center justify-center rounded-full ${isTransparentState ? 'bg-brand-lime text-brand-dark' : 'bg-brand-orange text-white'}`}>
                  {cartCount}
                </span>
              )}
            </button>

            <button 
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mega Menu Dropdown */}
      <div 
        className={`absolute top-full left-0 w-full bg-white border-t border-slate-100 shadow-xl transition-all duration-300 origin-top ${isShopHovered ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}
        onMouseEnter={() => setIsShopHovered(true)}
        onMouseLeave={() => setIsShopHovered(false)}
      >
         <div className="container mx-auto px-4 md:px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Column 1: By Activity */}


                {/* Column 1: Categories */}
                 <div className="col-span-3">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Categories</h3>
                    <ul className="space-y-3">
                        {['Shop All', 'Bundle Kits', 'Insoles', 'Footwear', 'Tools', 'Pads', 'Socks', 'Accessories & Recovery', 'Gift Cards'].map(item => (
                            <li key={item}>
                                <a
                                    href="#"
                                    className="text-slate-700 hover:text-brand-orange font-medium text-sm transition-colors block"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (item === 'Shop All') {
                                        onSearch?.('');
                                        onNavigate(Page.SHOP);
                                    } else if (item === 'Bundle Kits') {
                                        onNavigate(Page.BUNDLE_KITS);
                                    } else if (item === 'Accessories & Recovery') {
                                        onNavigate(Page.ACCESSORIES);
                                    } else if (item === 'Gift Cards') {
                                        onNavigate(Page.CATEGORY, 'Gift Cards');
                                    } else {
                                        onNavigate(Page.CATEGORY, item);
                                    }
                                    setIsShopHovered(false);
                                    }}
                                >
                                    {item}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="col-span-3">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Everyday</h3>
                    <ul className="space-y-3 mb-8">
                        {['All Purpose', 'Casual & Dress', 'Work'].map(item => (
                            <li key={item}>
                                <a 
                                    href="#" 
                                    className="text-slate-700 hover:text-brand-orange font-medium text-sm transition-colors block"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onNavigate(Page.CATEGORY, item);
                                        setIsShopHovered(false);
                                    }}
                                >
                                    {item}
                                </a>
                            </li>
                        ))}
                    </ul>
                    
                    <div className="group cursor-pointer">
                        <h3 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-brand-orange transition-colors">Pain Relief</h3>
                        <div className="flex flex-col gap-1">
                            {['Plantar Fasciitis', 'High Arches', 'Flat Feet', 'Metatarsalgia'].map(condition => (
                                <a 
                                    key={condition}
                                    href="#"
                                    className="text-xs text-slate-500 hover:text-brand-orange transition-colors block"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onNavigate(Page.CATEGORY, condition);
                                        setIsShopHovered(false);
                                    }}
                                >
                                    {condition}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="col-span-4 col-start-8">
                    <div className="group cursor-pointer" onClick={() => { onNavigate(Page.BEST_SELLERS); setIsShopHovered(false); }}>
                        <div className="aspect-[16/10] rounded-xl overflow-hidden mb-4 relative bg-slate-100">
                            <img 
                                src="https://images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=800&auto=format&fit=crop" 
                                alt="Best Sellers" 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                            <div className="absolute top-4 left-4">
                                <span className="bg-brand-lime text-brand-dark text-xs font-bold px-2 py-1 uppercase tracking-wider rounded-sm">
                                    Best Sellers
                                </span>
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-brand-orange transition-colors">Shop Best Sellers</h3>
                        <p className="text-sm text-slate-500">Discover the insoles trusted by pros.</p>
                    </div>
                </div>
            </div>
         </div>
      </div>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 top-16 bg-brand-dark/15 z-40 md:hidden animate-in fade-in duration-200"
          aria-hidden
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu — minimal */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 z-50 md:hidden overflow-hidden">
          <div className="bg-white overflow-y-auto max-h-[calc(100vh-4rem)] animate-in slide-in-from-top-2 duration-300">
            <nav className="px-5 py-8">
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 bg-slate-100 rounded-xl px-4 py-3 mb-6">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 bg-transparent border-0 outline-none text-brand-dark placeholder:text-slate-400"
                  aria-label="Search products"
                />
                <button type="submit" className="text-brand-orange font-medium text-sm">Search</button>
              </form>
              <ul className="space-y-0">
                {['Blog', 'Support', 'Track Your Order'].map((label) => (
                  <li key={label}>
                    <a
                      href="#"
                      className="block py-3.5 text-brand-dark font-medium text-[15px] tracking-tight active:text-brand-orange"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(label);
                      }}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="h-px bg-slate-100 my-5" />
              <ul className="space-y-0">
                <li>
                  <a
                    href="#"
                    className="block py-3 text-brand-orange text-[15px] font-medium"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(Page.BUNDLE_KITS);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Bundle Kits
                  </a>
                </li>
                {['Insoles', 'Footwear', 'Tools', 'Socks', 'Accessories & Recovery'].map((subItem) => (
                  <li key={subItem}>
                    <a
                      href="#"
                      className="block py-3 text-slate-600 text-[15px] active:text-brand-dark"
                      onClick={(e) => {
                        e.preventDefault();
                        if (subItem === 'Accessories & Recovery') {
                          onNavigate(Page.ACCESSORIES);
                        } else {
                          onNavigate(Page.CATEGORY, subItem);
                        }
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      {subItem}
                    </a>
                  </li>
                ))}
                <li>
                  <a 
                    href="#" 
                    className="block py-3 text-brand-orange text-[15px] font-medium"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(Page.SHOP);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    View all
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </nav>
  );
};
