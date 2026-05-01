import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ShoppingBag, Menu, X, Search, ChevronDown } from 'lucide-react';
import { Page } from '../types';
import { MegaMenuTestimonials } from './MegaMenuTestimonials';
import { createUrl } from '../utils/router';

const SUGGESTION_PRODUCTS = [
  'AeroTouch Elite Insoles',
  'AeroTouch Massage Insoles',
  'Massage Roller',
  'Heel Cushion Pad',
  'Compression Socks',
  'Fascilites Relief Kit',
  'Height Insoles',
  'Arch Support Insoles',
  'Plantar Fasciitis Insoles',
  'Sport Insoles',
];

const SUGGESTION_CATEGORIES = [
  'Insoles',
  'Footwear',
  'Tools',
  'Socks',
  'Bundle Kits',
  'Accessories & Recovery',
];

interface Suggestion {
  label: string;
  type: 'product' | 'category' | 'search';
}

function getSuggestions(input: string): Suggestion[] {
  const q = input.trim().toLowerCase();
  if (!q) return [];
  const results: Suggestion[] = [];
  SUGGESTION_PRODUCTS.forEach((p) => {
    if (p.toLowerCase().includes(q)) results.push({ label: p, type: 'product' });
  });
  SUGGESTION_CATEGORIES.forEach((c) => {
    if (c.toLowerCase().includes(q)) results.push({ label: c, type: 'category' });
  });
  if (results.length === 0 || !results.some((r) => r.label.toLowerCase() === q)) {
    results.unshift({ label: input.trim(), type: 'search' });
  }
  return results.slice(0, 6);
}

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
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen]);

  const commitSearch = useCallback((query: string) => {
    if (!query.trim()) return;
    if (onSearch) {
      onSearch(query.trim());
    } else {
      onNavigate(Page.SEARCH);
    }
    setShowSuggestions(false);
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
  }, [onSearch, onNavigate]);

  const handleSuggestionSelect = useCallback((suggestion: Suggestion) => {
    if (suggestion.type === 'category') {
      const cat = suggestion.label;
      if (cat === 'Bundle Kits') {
        onNavigate(Page.BUNDLE_KITS);
      } else if (cat === 'Accessories & Recovery') {
        onNavigate(Page.ACCESSORIES);
      } else {
        onNavigate(Page.CATEGORY, cat);
      }
      setShowSuggestions(false);
      setIsSearchOpen(false);
      setIsMobileMenuOpen(false);
    } else {
      setSearchInput(suggestion.label);
      commitSearch(suggestion.label);
    }
  }, [onNavigate, commitSearch]);

  const handleSearchInputChange = (val: string) => {
    setSearchInput(val);
    setActiveSuggestion(-1);
    const s = getSuggestions(val);
    setSuggestions(s);
    setShowSuggestions(s.length > 0);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      setIsSearchOpen(false);
      searchInputRef.current?.blur();
      return;
    }
    if (!showSuggestions || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestion((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestion((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1));
    } else if (e.key === 'Enter' && activeSuggestion >= 0) {
      e.preventDefault();
      handleSuggestionSelect(suggestions[activeSuggestion]);
    }
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (activeSuggestion >= 0 && showSuggestions) {
      handleSuggestionSelect(suggestions[activeSuggestion]);
      return;
    }
    commitSearch(searchInput);
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
    if (transparentMode) return 'bg-gradient-to-b from-black/60 via-black/20 to-transparent py-6';
    return 'bg-white shadow-sm py-4';
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
          <a
            href={createUrl(Page.HOME)}
            className="flex items-center cursor-pointer group"
            onClick={(e) => { e.preventDefault(); onNavigate(Page.HOME); }}
          >
            <span className={`text-2xl font-bold tracking-tight ${textColorClass}`}>
              Aero<span className={isTransparentState ? 'text-brand-lime' : 'text-brand-orange'}>Touch</span>
            </span>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8 h-full">
            <div
                className="h-full flex items-center"
                onMouseEnter={() => setIsShopHovered(true)}
            >
                <a
                    href={createUrl(Page.SHOP)}
                    className={`text-sm font-medium transition-colors flex items-center gap-1 py-2 ${textColorClass} ${isTransparentState ? 'hover:text-brand-lime' : 'hover:text-brand-orange'}`}
                    onClick={(e) => { e.preventDefault(); onSearch?.(''); onNavigate(Page.SHOP); }}
                >
                    Shop
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isShopHovered ? 'rotate-180' : ''}`} />
                </a>
            </div>

            {['Blog', 'Support', 'Track Your Order'].map((item) => {
              const getHref = () => {
                if (item === 'Blog') return createUrl(Page.BLOG);
                if (item === 'Support') return createUrl(Page.SUPPORT);
                if (item === 'Track Your Order') return createUrl(Page.TRACK_ORDER);
                return '#';
              };
              return (
                <a
                  key={item}
                  href={getHref()}
                  className={`text-sm font-medium transition-colors ${textColorClass} ${isTransparentState ? 'hover:text-brand-lime' : 'hover:text-brand-orange'}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item);
                  }}
                >
                  {item}
                </a>
              );
            })}
          </div>

          {/* Actions */}
          <div className={`flex items-center space-x-4 ${textColorClass}`}>
            {/* Desktop search: expandable bar */}
            <div className="hidden md:flex items-center relative">
              {isSearchOpen ? (
                <div className="relative">
                  <form onSubmit={handleSearchSubmit} className="flex items-center gap-1 bg-white/90 rounded-full pl-4 pr-2 py-1.5 min-w-[240px] shadow-sm border border-slate-200">
                    <input
                      ref={searchInputRef}
                      type="search"
                      value={searchInput}
                      onChange={(e) => handleSearchInputChange(e.target.value)}
                      onBlur={() => { setTimeout(() => { if (!searchInput.trim()) setIsSearchOpen(false); setShowSuggestions(false); }, 150); }}
                      onFocus={() => { if (searchInput.trim()) setShowSuggestions(suggestions.length > 0); }}
                      onKeyDown={handleSearchKeyDown}
                      placeholder="Search products..."
                      className="bg-transparent border-0 outline-none text-brand-dark text-sm w-full placeholder:text-slate-400"
                      aria-label="Search products"
                      autoComplete="off"
                    />
                    <button type="submit" className={`p-1.5 rounded-full ${isTransparentState ? 'hover:bg-brand-lime/20 text-brand-lime' : 'hover:bg-brand-orange/20 text-brand-orange'}`} aria-label="Submit search">
                      <Search className="w-4 h-4" />
                    </button>
                  </form>
                  {showSuggestions && suggestions.length > 0 && (
                    <div ref={suggestionsRef} className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-[60]">
                      {suggestions.map((s, i) => (
                        <button
                          key={i}
                          type="button"
                          onMouseDown={(e) => { e.preventDefault(); handleSuggestionSelect(s); }}
                          className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 transition-colors ${activeSuggestion === i ? 'bg-slate-50 text-brand-orange' : 'text-slate-700 hover:bg-slate-50 hover:text-brand-orange'}`}
                        >
                          {s.type === 'category' ? (
                            <ChevronDown className="w-3.5 h-3.5 rotate-[-90deg] text-slate-400 shrink-0" />
                          ) : (
                            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          )}
                          <span>{s.label}</span>
                          {s.type === 'category' && <span className="ml-auto text-xs text-slate-400">Category</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
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
                        {['Shop All', 'Bundle Kits', 'Insoles', 'Footwear', 'Tools', 'Pads', 'Socks', 'Accessories & Recovery', 'Gift Cards'].map(item => {
                          const getHref = () => {
                            if (item === 'Shop All') return createUrl(Page.SHOP);
                            if (item === 'Bundle Kits') return createUrl(Page.BUNDLE_KITS);
                            if (item === 'Accessories & Recovery') return createUrl(Page.ACCESSORIES);
                            if (item === 'Gift Cards') return createUrl(Page.CATEGORY, { category: 'Gift Cards' });
                            return createUrl(Page.CATEGORY, { category: item });
                          };
                          const handleClick = (e: React.MouseEvent) => {
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
                          };
                          return (
                            <li key={item}>
                              <a
                                href={getHref()}
                                className="text-slate-700 hover:text-brand-orange font-medium text-sm transition-colors block"
                                onClick={handleClick}
                              >
                                {item}
                              </a>
                            </li>
                          );
                        })}
                    </ul>
                </div>

                <div className="col-span-3">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Everyday</h3>
                    <ul className="space-y-3 mb-8">
                        {['All Purpose', 'Casual & Dress', 'Work'].map(item => {
                          const href = createUrl(Page.CATEGORY, { category: item });
                          return (
                            <li key={item}>
                              <a
                                href={href}
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
                          );
                        })}
                    </ul>
                    
                    <div className="group cursor-pointer">
                        <h3 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-brand-orange transition-colors">Pain Relief</h3>
                        <div className="flex flex-col gap-1">
                            {['Plantar Fasciitis', 'High Arches', 'Flat Feet', 'Metatarsalgia'].map(condition => {
                              const href = createUrl(Page.CATEGORY, { category: condition });
                              return (
                                <a
                                  key={condition}
                                  href={href}
                                  className="text-xs text-slate-500 hover:text-brand-orange transition-colors block"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    onNavigate(Page.CATEGORY, condition);
                                    setIsShopHovered(false);
                                  }}
                                >
                                  {condition}
                                </a>
                              );
                            })}
                        </div>
                    </div>
                </div>

                {/* Testimonial Carousel */}
                <div className="col-span-5 col-start-8 border-l border-slate-100 pl-8">
                    <MegaMenuTestimonials />
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
              <div className="mb-6">
                <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 bg-slate-100 rounded-xl px-4 py-3">
                  <Search className="w-5 h-5 text-slate-400 shrink-0" />
                  <input
                    type="search"
                    value={searchInput}
                    onChange={(e) => handleSearchInputChange(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    placeholder="Search products..."
                    className="flex-1 bg-transparent border-0 outline-none text-brand-dark placeholder:text-slate-400"
                    aria-label="Search products"
                    autoComplete="off"
                  />
                  <button type="submit" className="text-brand-orange font-medium text-sm">Search</button>
                </form>
                {showSuggestions && suggestions.length > 0 && (
                  <div className="mt-1.5 bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        type="button"
                        onMouseDown={(e) => { e.preventDefault(); handleSuggestionSelect(s); }}
                        className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors ${activeSuggestion === i ? 'bg-slate-50 text-brand-orange' : 'text-slate-700 hover:bg-slate-50 hover:text-brand-orange'}`}
                      >
                        {s.type === 'category' ? (
                          <ChevronDown className="w-3.5 h-3.5 rotate-[-90deg] text-slate-400 shrink-0" />
                        ) : (
                          <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        )}
                        <span>{s.label}</span>
                        {s.type === 'category' && <span className="ml-auto text-xs text-slate-400">Category</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <ul className="space-y-0">
                {['Blog', 'Support', 'Track Your Order'].map((label) => {
                  const getHref = () => {
                    if (label === 'Blog') return createUrl(Page.BLOG);
                    if (label === 'Support') return createUrl(Page.SUPPORT);
                    if (label === 'Track Your Order') return createUrl(Page.TRACK_ORDER);
                    return '#';
                  };
                  return (
                    <li key={label}>
                      <a
                        href={getHref()}
                        className="block py-3.5 text-brand-dark font-medium text-[15px] tracking-tight active:text-brand-orange"
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavClick(label);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        {label}
                      </a>
                    </li>
                  );
                })}
              </ul>
              <div className="h-px bg-slate-100 my-5" />
              <ul className="space-y-0">
                <li>
                  <a
                    href={createUrl(Page.BUNDLE_KITS)}
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
                {['Insoles', 'Footwear', 'Tools', 'Socks', 'Accessories & Recovery'].map((subItem) => {
                  const getHref = () => {
                    if (subItem === 'Accessories & Recovery') return createUrl(Page.ACCESSORIES);
                    return createUrl(Page.CATEGORY, { category: subItem });
                  };
                  const handleClick = (e: React.MouseEvent) => {
                    e.preventDefault();
                    if (subItem === 'Accessories & Recovery') {
                      onNavigate(Page.ACCESSORIES);
                    } else {
                      onNavigate(Page.CATEGORY, subItem);
                    }
                    setIsMobileMenuOpen(false);
                  };
                  return (
                    <li key={subItem}>
                      <a
                        href={getHref()}
                        className="block py-3 text-slate-600 text-[15px] active:text-brand-dark"
                        onClick={handleClick}
                      >
                        {subItem}
                      </a>
                    </li>
                  );
                })}
                <li>
                  <a
                    href={createUrl(Page.SHOP)}
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
