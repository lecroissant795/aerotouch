import React, { useState } from 'react';
import { Receipt, Printer, AlertCircle, Search } from 'lucide-react';

interface Money {
  amount?: string;
  currencyCode?: string;
}

interface ReceiptItem {
  title: string;
  variant: string | null;
  quantity: number;
  unitPrice: number;
  image: string | null;
}

interface ReceiptData {
  orderNumber: string;
  date: string;
  email: string;
  status: string;
  currency: string;
  items: ReceiptItem[];
  subtotal: number | null;
  shipping: number | null;
  tax: number | null;
  discounts: number | null;
  total: number | null;
  shipTo: string[];
}

const pick = (set?: { presentmentMoney?: Money; shopMoney?: Money } | null): Money | null =>
  set?.presentmentMoney || set?.shopMoney || null;

const toNumber = (money: Money | null): number | null => {
  if (!money?.amount) return null;
  const n = Number(money.amount);
  return Number.isNaN(n) ? null : n;
};

const formatMoney = (amount: number, currency: string) => {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
};

const Row: React.FC<{ label: string; value: string; strong?: boolean }> = ({ label, value, strong }) => (
  <div className={`flex justify-between ${strong ? 'text-base font-bold text-brand-dark' : 'text-sm text-slate-600'}`}>
    <span>{label}</span>
    <span className="tabular-nums">{value}</span>
  </div>
);

export const ViewOrderPage: React.FC = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setReceipt(null);

    try {
      const response = await fetch('/api/track-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber, email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to find your order.');

      const order = data.rawData;
      const totalMoney = pick(order.currentTotalPriceSet);
      const currency = totalMoney?.currencyCode || 'USD';
      const addr = order.shippingAddress;

      setReceipt({
        orderNumber: data.orderNumber,
        date: new Date(order.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        email: data.email,
        status: data.status,
        currency,
        items: (order.lineItems?.edges || []).map((edge: any) => {
          const node = edge.node;
          const variant = node.variantTitle && node.variantTitle !== 'Default Title' ? node.variantTitle : null;
          return {
            title: node.title,
            variant,
            quantity: node.quantity,
            unitPrice: toNumber(pick(node.originalUnitPriceSet)) ?? 0,
            image: node.image?.url || null,
          };
        }),
        subtotal: toNumber(pick(order.currentSubtotalPriceSet)),
        shipping: toNumber(pick(order.totalShippingPriceSet)),
        tax: toNumber(pick(order.currentTotalTaxSet)),
        discounts: toNumber(pick(order.currentTotalDiscountsSet)),
        total: toNumber(totalMoney),
        shipTo: addr
          ? [
              addr.name,
              addr.address1,
              addr.address2,
              [addr.city, addr.province, addr.zip].filter(Boolean).join(', '),
              addr.country,
            ].filter(Boolean)
          : [],
      });
    } catch (err: any) {
      setError(err.message || 'Unable to find your order. Please check your details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-brand-light min-h-screen pt-24 pb-16">
      <style>{`
        @media print {
          header, nav, footer, .no-print { display: none !important; }
          body, .receipt-wrap { background: #fff !important; }
          .receipt-paper { box-shadow: none !important; border: none !important; }
        }
      `}</style>
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-md mx-auto receipt-wrap">
          <div className="text-center mb-8 no-print">
            <h1 className="text-3xl font-bold text-brand-dark mb-3">View Your Order</h1>
            <p className="text-slate-600 text-sm">Enter your order number and email to see your receipt.</p>
          </div>

          <form
            onSubmit={handleLookup}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8 space-y-4 no-print"
          >
            <div>
              <label htmlFor="vo-order" className="block text-sm font-medium text-brand-dark mb-2">Order Number</label>
              <input
                id="vo-order"
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="e.g. #1234"
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange"
              />
            </div>
            <div>
              <label htmlFor="vo-email" className="block text-sm font-medium text-brand-dark mb-2">Email Address</label>
              <input
                id="vo-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-dark text-white font-bold py-3.5 rounded-lg hover:bg-brand-orange transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Finding order...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  View Order
                </>
              )}
            </button>
            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </form>

          {receipt && (
            <>
              <div
                className="receipt-paper bg-white shadow-xl shadow-slate-200/70 border border-slate-100 px-6 pt-8 pb-10 font-mono"
                style={{
                  // Torn-paper zigzag along the bottom edge
                  WebkitMaskImage:
                    'conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) 50% / 14px 100%',
                  maskImage:
                    'conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) 50% / 14px 100%',
                }}
              >
                <div className="text-center">
                  <Receipt className="w-7 h-7 mx-auto text-brand-dark mb-2" />
                  <h2 className="text-xl font-black tracking-widest text-brand-dark">AEROTOUCH</h2>
                  <p className="text-xs text-slate-500 mt-1">Order Receipt</p>
                </div>

                <div className="border-t border-dashed border-slate-300 my-5" />

                <div className="space-y-1 text-xs text-slate-600">
                  <div className="flex justify-between"><span>Order</span><span className="font-bold text-brand-dark">{receipt.orderNumber}</span></div>
                  <div className="flex justify-between"><span>Date</span><span>{receipt.date}</span></div>
                  <div className="flex justify-between gap-4"><span>Email</span><span className="truncate">{receipt.email}</span></div>
                  <div className="flex justify-between"><span>Status</span><span>{receipt.status}</span></div>
                </div>

                <div className="border-t border-dashed border-slate-300 my-5" />

                <ul className="space-y-4">
                  {receipt.items.map((item, i) => (
                    <li key={i} className="flex gap-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-12 h-12 rounded object-cover bg-slate-50 border border-slate-100 shrink-0 grayscale-[30%]"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-brand-dark leading-snug">{item.title}</p>
                        {item.variant && <p className="text-xs text-slate-500">{item.variant}</p>}
                        <p className="text-xs text-slate-500 mt-0.5">
                          {item.quantity} × {formatMoney(item.unitPrice, receipt.currency)}
                        </p>
                      </div>
                      <p className="text-sm text-brand-dark tabular-nums shrink-0">
                        {formatMoney(item.unitPrice * item.quantity, receipt.currency)}
                      </p>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-dashed border-slate-300 my-5" />

                <div className="space-y-1.5">
                  {receipt.subtotal !== null && <Row label="Subtotal" value={formatMoney(receipt.subtotal, receipt.currency)} />}
                  {receipt.discounts !== null && receipt.discounts > 0 && (
                    <Row label="Discounts" value={`-${formatMoney(receipt.discounts, receipt.currency)}`} />
                  )}
                  {receipt.shipping !== null && (
                    <Row label="Shipping" value={receipt.shipping === 0 ? 'Free' : formatMoney(receipt.shipping, receipt.currency)} />
                  )}
                  {receipt.tax !== null && receipt.tax > 0 && <Row label="Tax" value={formatMoney(receipt.tax, receipt.currency)} />}
                </div>

                {receipt.total !== null && (
                  <>
                    <div className="border-t-2 border-double border-slate-400 my-4" />
                    <Row label="TOTAL" value={formatMoney(receipt.total, receipt.currency)} strong />
                  </>
                )}

                {receipt.shipTo.length > 0 && (
                  <>
                    <div className="border-t border-dashed border-slate-300 my-5" />
                    <p className="text-xs font-bold text-brand-dark mb-1.5 tracking-wider">SHIPPED TO</p>
                    <div className="text-xs text-slate-600 leading-relaxed">
                      {receipt.shipTo.map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </div>
                  </>
                )}

                <div className="border-t border-dashed border-slate-300 my-5" />
                <p className="text-center text-xs text-slate-500">Thank you for your order!</p>
              </div>

              <div className="text-center mt-6 no-print">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 text-sm font-medium text-brand-dark hover:text-brand-orange transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  Print receipt
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
