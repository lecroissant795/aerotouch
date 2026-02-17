import React from 'react';
import { Instagram, Twitter, Facebook } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-100 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center mb-4">
              <span className="text-xl font-bold text-slate-900">AeroTouch</span>
            </div>
            <p className="text-slate-500 max-w-xs mb-6">
              Engineering the future of footwear comfort and performance. 
              Based in Portland, OR.
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
          
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><a href="#" className="hover:text-brand-orange">Insoles</a></li>
              <li><a href="#" className="hover:text-brand-orange">Footwear</a></li>
              <li><a href="#" className="hover:text-brand-orange">Tools</a></li>
              <li><a href="#" className="hover:text-brand-orange">Pads</a></li>
              <li><a href="#" className="hover:text-brand-orange">Socks</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><a href="#" className="hover:text-brand-orange">Fit Guide</a></li>
              <li><a href="#" className="hover:text-brand-orange" onClick={(e) => { e.preventDefault(); window.scrollTo(0, 0); }}>Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-brand-orange">Track Your Order</a></li>
              <li><a href="#" className="hover:text-brand-orange">FAQ</a></li>
              <li><a href="#" className="hover:text-brand-orange">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><a href="#" className="hover:text-brand-orange">Our Story</a></li>
              <li><a href="#" className="hover:text-brand-orange">Technology</a></li>
              <li><a href="#" className="hover:text-brand-orange">Careers</a></li>
              <li><a href="#" className="hover:text-brand-orange">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} AeroTouch Inc. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-brand-dark">Terms</a>
            <a href="#" className="hover:text-brand-dark">Privacy</a>
            <a href="#" className="hover:text-brand-dark">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};