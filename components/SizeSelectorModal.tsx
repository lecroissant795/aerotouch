import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Star, Ruler } from 'lucide-react';
import { Product } from '../types';
import { getCartProductLookupKey, getShopifyHandle } from '../utils/productMapping';
import { fetchProductByHandle } from '../utils/productFetcher';
import { useCurrency } from '../utils/CurrencyContext';
import { DEFAULT_CURRENCY } from '../utils/currency';

const DEFAULT_SIZES = [
  { label: 'M 5 / W 6', detail: 'US Men 5 / US Women 6' },
  { label: 'M 6 / W 7', detail: 'US Men 6 / US Women 7' },
  { label: 'M 7 / W 8', detail: 'US Men 7 / US Women 8' },
  { label: 'M 8 / W 9', detail: 'US Men 8 / US Women 9' },
  { label: 'M 9 / W 10', detail: 'US Men 9 / US Women 10' },
  { label: 'M 10 / W 11', detail: 'US Men 10 / US Women 11' },
  { label: 'M 11 / W 12', detail: 'US Men 11 / US Women 12' },
  { label: 'M 12 / W 13', detail: 'US Men 12 / US Women 13' },
  { label: 'M 13 / W 14', detail: 'US Men 13 / US Women 14' },
  { label: 'M 14 / W 15', detail: 'US Men 14 / US Women 15' },
  { label: 'M 15 / W 16', detail: 'US Men 15 / US Women 16' },
];

interface SizeSelectorModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (product: Product, size: string, color: string, quantity: number) => void;
  isLoading?: boolean;
}

export const SizeSelectorModal: React.FC<SizeSelectorModalProps> = ({
  product,
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  const { currency, formatMoney } = useCurrency();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [availableSizes, setAvailableSizes] = useState(DEFAULT_SIZES);
  /** First Color option from Shopify (insoles use Color + Size; "One Size" breaks variant match). */
  const [defaultColorForCart, setDefaultColorForCart] = useState<string>('Default');
  const [isClosing, setIsClosing] = useState(false);

  // Fetch real sizes from Shopify when product changes
  useEffect(() => {
    if (!isOpen || !product) return;
    setSelectedSize(null);
    setDefaultColorForCart('Default');

    const fetchSizes = async () => {
      try {
        const lookupKey = getCartProductLookupKey(product);
        const handle = getShopifyHandle(lookupKey);
        const shopifyProduct = await fetchProductByHandle(handle, currency);
        const sizeOption = shopifyProduct?.options?.find(
          (o: any) => o.name === 'Size'
        );
        if (sizeOption?.values?.length) {
          setAvailableSizes(
            sizeOption.values.map((v: any) => {
              const label = typeof v === 'string' ? v : v?.value ?? v?.name ?? String(v);
              return { label, detail: label };
            })
          );
        }
        const colorOption = shopifyProduct?.options?.find(
          (o: any) => o.name === 'Color'
        );
        const colors: string[] =
          colorOption?.values?.map((v: any) => typeof v === 'string' ? v : v?.value ?? v?.name).filter(Boolean) || [];
        if (colors.length) {
          const preferred =
            colors.find((c) => /^orange$/i.test(c)) ||
            colors.find((c) => /orange/i.test(c)) ||
            colors[0];
          setDefaultColorForCart(preferred);
        } else {
          setDefaultColorForCart('Default');
        }
      } catch {
        // Keep defaults
      }
    };

    fetchSizes();
  }, [isOpen, product, currency]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200);
  };

  const handleConfirm = () => {
    if (!selectedSize) return;
    onConfirm(product, selectedSize, defaultColorForCart, 1);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-end sm:items-center justify-center transition-all duration-200 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className={`relative w-full sm:max-w-lg bg-white rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl overflow-hidden transition-transform duration-300 ${
          isClosing
            ? 'translate-y-full sm:translate-y-0 sm:scale-95'
            : 'translate-y-0 sm:scale-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-slate-600" />
        </button>

        {/* Product summary */}
        <div className="flex items-center gap-4 p-6 pb-4 border-b border-slate-100">
          <div className="w-20 h-20 rounded-xl bg-slate-50 overflow-hidden flex-shrink-0 border border-slate-100">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-black text-slate-900 leading-tight line-clamp-2 uppercase tracking-tight">
              {product.name}
            </h3>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-3 h-3 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <span className="text-xs text-slate-400">
                ({product.reviews.toLocaleString()})
              </span>
            </div>
            <p className="text-lg font-black text-slate-900 mt-1">
              {formatMoney(product.price, (product.currencyCode || DEFAULT_CURRENCY) as any)}
            </p>
          </div>
        </div>

        {/* Size selector */}
        <div className="p-6 pt-5">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-black text-slate-900 uppercase tracking-widest">
              Select Your Size
            </span>
            <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <Ruler className="w-3 h-3" />
              Size Guide
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-4">
            {availableSizes.map((size) => (
              <button
                key={size.label}
                type="button"
                onClick={() => setSelectedSize(size.label)}
                className={`h-11 rounded-xl border-2 font-bold text-xs uppercase tracking-tight transition-all duration-150 ${
                  selectedSize === size.label
                    ? 'border-brand-orange bg-brand-orange text-white shadow-md shadow-brand-orange/25'
                    : 'border-slate-200 text-slate-700 hover:border-slate-900 bg-white'
                }`}
              >
                {size.label}
              </button>
            ))}
          </div>

          {/* Fit detail */}
          {selectedSize && (
            <div className="text-xs font-bold text-slate-500 bg-slate-50 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg mb-4 animate-in fade-in duration-150">
              Fits:{' '}
              {availableSizes.find((s) => s.label === selectedSize)?.detail ||
                selectedSize}
            </div>
          )}

          {/* Add to Cart button */}
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!selectedSize || isLoading}
            className={`w-full flex items-center justify-center gap-2.5 py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all duration-200 ${
              selectedSize
                ? 'bg-slate-900 text-white hover:bg-brand-orange hover:shadow-lg hover:shadow-brand-orange/25 active:scale-[0.98]'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            {isLoading
              ? 'Adding...'
              : selectedSize
              ? 'Add to Cart'
              : 'Select a Size'}
          </button>
        </div>
      </div>
    </div>
  );
};
