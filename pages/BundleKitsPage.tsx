import React from 'react';
import { Zap, ShieldCheck } from 'lucide-react';
import { BundleKit } from '../types';
import { useShopifyBundleKits } from '../hooks/useShopifyBundleKits';
import { KitBundleCard } from '../components/KitBundleCard';
import { BUNDLE_KITS } from '../utils/bundleKits';

export { BUNDLE_KITS };

interface BundleKitsPageProps {
  onBack?: () => void;
  onAddKitToCart?: (kit: BundleKit) => void;
  onKitSelect?: (kit: BundleKit) => void;
}

export const BundleKitsPage: React.FC<BundleKitsPageProps> = ({ onAddKitToCart, onKitSelect }) => {
  const kits = useShopifyBundleKits();
  return (
    <div className="min-h-screen bg-brand-light pt-24">
      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <p className="text-brand-orange font-bold tracking-widest uppercase text-sm mb-2">Limited Edition</p>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
            Recovery & relief kits designed for real results
          </h2>
          <p className="text-slate-600">
            Each kit combines our best-selling insoles and accessories so you can target your specific needs and save.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {kits.map((kit) => (
            <KitBundleCard key={kit.id} kit={kit} onKitSelect={onKitSelect} onAddKitToCart={onAddKitToCart} />
          ))}
        </div>

        <div className="mt-16 flex flex-wrap justify-center gap-x-12 gap-y-6">
          {[
            { icon: ShieldCheck, text: '60-Day Performance Guarantee' },
            { icon: Zap, text: 'Instant Recovery Support' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <item.icon className="w-5 h-5 text-brand-orange" />
              <span className="text-sm font-bold text-slate-600">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
