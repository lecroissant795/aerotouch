import React from 'react';
import { Instagram, Twitter, Facebook } from 'lucide-react';
import { useRouter, createUrl } from '../utils/router';
import { Page } from '../types';

export const Footer: React.FC = () => {
  const { navigate } = useRouter();

  const handleClick = (page: Page, params?: Record<string, string>) => {
    return (e: React.MouseEvent) => {
      e.preventDefault();
      navigate(page, params);
    };
  };

  return (
    <footer className="bg-white border-t border-slate-100 pt-16 pb-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="mb-6">
            <a href={createUrl(Page.HOME)} className="cursor-pointer">
              <span className="text-2xl font-bold text-slate-900">AeroTouch</span>
            </a>
          </div>
          <p className="text-slate-500 max-w-md mb-8">
            Engineering the future of footwear comfort and performance.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-brand-orange hover:text-white transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-brand-orange hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-brand-orange hover:text-white transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 text-center">
          <div>
            <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-wider text-sm">Shop</h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li><a href={createUrl(Page.CATEGORY, { category: 'Insoles' })} className="hover:text-brand-orange transition-colors" onClick={handleClick(Page.CATEGORY, { category: 'Insoles' })}>Insoles</a></li>
              <li><a href={createUrl(Page.CATEGORY, { category: 'Footwear' })} className="hover:text-brand-orange transition-colors" onClick={handleClick(Page.CATEGORY, { category: 'Footwear' })}>Footwear</a></li>
              <li><a href={createUrl(Page.CATEGORY, { category: 'Tools' })} className="hover:text-brand-orange transition-colors" onClick={handleClick(Page.CATEGORY, { category: 'Tools' })}>Tools</a></li>
              <li><a href={createUrl(Page.CATEGORY, { category: 'Pads' })} className="hover:text-brand-orange transition-colors" onClick={handleClick(Page.CATEGORY, { category: 'Pads' })}>Pads</a></li>
              <li><a href={createUrl(Page.CATEGORY, { category: 'Socks' })} className="hover:text-brand-orange transition-colors" onClick={handleClick(Page.CATEGORY, { category: 'Socks' })}>Socks</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-wider text-sm">Support</h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li><a href={createUrl(Page.SIZE_GUIDE)} className="hover:text-brand-orange transition-colors" onClick={handleClick(Page.SIZE_GUIDE)}>Fit Guide</a></li>
              <li><a href={createUrl(Page.RETURNS_EXCHANGE)} className="hover:text-brand-orange transition-colors" onClick={handleClick(Page.RETURNS_EXCHANGE)}>Shipping & Returns</a></li>
              <li><a href={createUrl(Page.TRACK_ORDER)} className="hover:text-brand-orange transition-colors" onClick={handleClick(Page.TRACK_ORDER)}>Track Your Order</a></li>
              <li><a href={createUrl(Page.SUPPORT)} className="hover:text-brand-orange transition-colors" onClick={handleClick(Page.SUPPORT)}>FAQ</a></li>
              <li><a href={createUrl(Page.SUPPORT)} className="hover:text-brand-orange transition-colors" onClick={handleClick(Page.SUPPORT)}>Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-10 flex flex-col items-center gap-6 text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} AeroTouch Inc. All rights reserved.</p>
          <div className="flex space-x-8">
            <a href="#" className="hover:text-brand-dark transition-colors">Terms</a>
            <a href="#" className="hover:text-brand-dark transition-colors">Privacy</a>
            <a href="#" className="hover:text-brand-dark transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
