import React from 'react';
import { Instagram, Twitter, Facebook } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-100 pt-16 pb-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="mb-6">
            <span className="text-2xl font-bold text-slate-900">AeroTouch</span>
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
              <li><a href="#" className="hover:text-brand-orange transition-colors">Insoles</a></li>
              <li><a href="#" className="hover:text-brand-orange transition-colors">Footwear</a></li>
              <li><a href="#" className="hover:text-brand-orange transition-colors">Tools</a></li>
              <li><a href="#" className="hover:text-brand-orange transition-colors">Pads</a></li>
              <li><a href="#" className="hover:text-brand-orange transition-colors">Socks</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-wider text-sm">Support</h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li><a href="#" className="hover:text-brand-orange transition-colors">Fit Guide</a></li>
              <li><a href="#" className="hover:text-brand-orange transition-colors" onClick={(e) => { e.preventDefault(); window.scrollTo(0, 0); }}>Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-brand-orange transition-colors">Track Your Order</a></li>
              <li><a href="#" className="hover:text-brand-orange transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-brand-orange transition-colors">Contact Us</a></li>
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