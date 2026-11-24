import React, { useState } from 'react';
import { Truck, Package, CheckCircle, Clock, MapPin } from 'lucide-react';

export const TrackOrderPage: React.FC = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [trackingResult, setTrackingResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setTrackingResult(null);

    // Basic validation
    if (!orderNumber.trim() || !email.trim()) {
      setError('Please enter both order number and email.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/track-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderNumber, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to track order');
      }

      // Transform API data to component state format
      // Note: Some fields like dimensions/weight might need to be calculated or fetched from meta-fields if not in standard order data
      const order = data.rawData;
      const status: string = data.status || 'Processing';
      const tracking = order.fulfillments?.[0]?.trackingInfo?.[0];
      const addr = order.shippingAddress;
      const inactive = status === 'Cancelled' || status === 'Refunded';
      const shippedOrBeyond = ['Shipped', 'Out for Delivery', 'Delivered'].includes(status);
      const outOrDelivered = status === 'Out for Delivery' || status === 'Delivered';

      const formatMoney = (money?: { amount?: string; currencyCode?: string } | null) => {
        if (!money?.amount) return null;
        const value = Number(money.amount);
        if (Number.isNaN(value)) return null;
        try {
          return new Intl.NumberFormat('en-US', { style: 'currency', currency: money.currencyCode || 'USD' }).format(value);
        } catch {
          return `${value.toFixed(2)} ${money.currencyCode || ''}`.trim();
        }
      };
      const items = (order.lineItems?.edges || []).map((edge: any) => {
        const node = edge.node;
        const unit = node.originalUnitPriceSet?.presentmentMoney || node.originalUnitPriceSet?.shopMoney;
        return {
          title: node.title,
          quantity: node.quantity,
          image: node.image?.url || null,
          imageAlt: node.image?.altText || node.title,
          unitPrice: formatMoney(unit),
        };
      });
      const totalMoney = order.currentTotalPriceSet?.presentmentMoney || order.currentTotalPriceSet?.shopMoney;

      const mappedResult = {
        items,
        total: formatMoney(totalMoney),
        status,
        estimatedDelivery: data.estimatedDelivery || 'See carrier tracking',
        carrier: tracking?.company || 'Pending',
        trackingNumber: tracking?.number || 'Pending',
        trackingUrl: tracking?.url || null,
        destination: addr ? [addr.city, addr.province, addr.country].filter(Boolean).join(', ') : null,
        steps: [
          { label: 'Order Placed', date: new Date(order.createdAt).toLocaleDateString(), completed: true, icon: CheckCircle },
          { label: 'Processing', date: null, completed: !inactive, icon: Package },
          { label: 'Shipped', date: null, completed: shippedOrBeyond, icon: Truck },
          { label: 'Out for Delivery', date: null, completed: outOrDelivered, icon: Truck },
          { label: 'Delivered', date: null, completed: status === 'Delivered', icon: CheckCircle },
        ],
      };

      setTrackingResult(mappedResult);
    } catch (err: any) {
      setError(err.message || 'An error occurred while tracking your order.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-brand-light min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">Track Your Order</h1>
            <p className="text-slate-600">Enter your order details below to check the status of your shipment.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 mb-8">
            <form onSubmit={handleTrack} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="orderNumber" className="block text-sm font-medium text-brand-dark mb-2">Order Number</label>
                  <input
                    type="text"
                    id="orderNumber"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="e.g. #12345"
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-brand-dark mb-2">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-dark text-white font-bold py-4 rounded-lg hover:bg-brand-orange transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Tracking...
                  </>
                ) : (
                  <>
                    <Truck className="w-5 h-5" />
                    Track Order
                  </>
                )}
              </button>
            </form>
            
            {error && (
              <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm text-center">
                {error}
              </div>
            )}
          </div>

          {trackingResult && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Status and Steps */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-8 border-b border-slate-100 gap-4">
                    <div>
                    <div className="text-sm text-slate-500 mb-1">Status</div>
                    <div className="text-2xl font-bold text-brand-dark flex items-center gap-2">
                        {trackingResult.status}
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600">
                        <Truck className="w-3 h-3" />
                        </span>
                    </div>
                    </div>
                    <div className="text-left md:text-right">
                    <div className="text-sm text-slate-500 mb-1">Estimated Delivery</div>
                    <div className="text-lg font-bold text-brand-dark">{trackingResult.estimatedDelivery}</div>
                    </div>
                </div>

                <style>{`
                  @keyframes march-horizontal {
                    0% { background-position: 0 0; }
                    100% { background-position: 20px 0; }
                  }
                  @keyframes march-vertical {
                    0% { background-position: 0 0; }
                    100% { background-position: 0 20px; }
                  }
                  .marching-ants-h {
                    background-image: linear-gradient(to right, #cbd5e1 50%, rgba(255, 255, 255, 0) 0%);
                    background-size: 12px 2px;
                    background-repeat: repeat-x;
                    animation: march-horizontal 1s linear infinite;
                  }
                  .marching-ants-v {
                    background-image: linear-gradient(to bottom, #cbd5e1 50%, rgba(255, 255, 255, 0) 0%);
                    background-size: 2px 12px;
                    background-repeat: repeat-y;
                    animation: march-vertical 1s linear infinite;
                  }
                  @keyframes breathe {
                    0% { box-shadow: 0 0 0 0 rgba(255, 87, 34, 0.4); transform: scale(1.1); }
                    70% { box-shadow: 0 0 0 10px rgba(255, 87, 34, 0); transform: scale(1.15); }
                    100% { box-shadow: 0 0 0 0 rgba(255, 87, 34, 0); transform: scale(1.1); }
                  }
                  .animate-breathe {
                    animation: breathe 2s infinite;
                  }
                `}</style>
                <div className="relative">
                    {/* Vertical Line for Mobile */}
                    <div className="absolute left-6 top-6 bottom-6 w-0.5 md:hidden marching-ants-v"></div>
                    
                    {/* Horizontal Line for Desktop */}
                    <div className="hidden md:block absolute left-0 right-0 top-6 h-0.5 marching-ants-h"></div>

                    <div className="flex flex-col md:flex-row justify-between relative space-y-8 md:space-y-0">
                    {trackingResult.steps.map((step: any, index: number) => {
                        const isCompleted = step.completed;
                        const isCurrent = !step.completed && index > 0 && trackingResult.steps[index - 1].completed;
                        const StepIcon = step.icon || CheckCircle;
                        
                        return (
                        <div key={index} className="flex md:flex-col items-center gap-4 md:gap-4 relative z-10 w-full md:w-auto md:flex-1">
                            <div 
                            className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 shrink-0
                                ${isCompleted ? 'bg-brand-green border-brand-green text-white shadow-md shadow-brand-green/20' : 
                                isCurrent ? 'bg-white border-brand-orange text-brand-orange animate-breathe' : 'bg-white border-slate-200 text-slate-300'}
                            `}
                            style={{ 
                                backgroundColor: isCompleted ? '#10b981' : '#fff', 
                                borderColor: isCompleted ? '#10b981' : isCurrent ? '#FF5722' : '#e2e8f0',
                                color: isCompleted ? '#fff' : isCurrent ? '#FF5722' : '#cbd5e1'
                            }}
                            >
                                <StepIcon className="w-5 h-5" />
                            </div>
                            <div className="text-left md:text-center">
                            <p className={`font-bold text-sm ${isCompleted || isCurrent ? 'text-brand-dark' : 'text-slate-400'}`}>{step.label}</p>
                            {step.date && <p className="text-xs text-slate-500 mt-0.5">{step.date}</p>}
                            </div>
                        </div>
                        );
                    })}
                    </div>
                </div>
                </div>

              {trackingResult.items.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
                  <h4 className="font-bold text-brand-dark text-sm mb-4">Items in Your Order</h4>
                  <ul className="divide-y divide-slate-100">
                    {trackingResult.items.map((item: any, index: number) => (
                      <li key={index} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                        {item.image ? (
                          <img src={item.image} alt={item.imageAlt} className="w-16 h-16 rounded-lg object-cover bg-slate-50 border border-slate-100 shrink-0" />
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                            <Package className="w-6 h-6 text-slate-300" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-brand-dark text-sm">{item.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5">Qty: {item.quantity}</p>
                        </div>
                        {item.unitPrice && (
                          <p className="text-sm text-slate-600 shrink-0">{item.unitPrice}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                  {trackingResult.total && (
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
                      <span className="text-sm text-slate-500">Order total</span>
                      <span className="font-bold text-brand-dark">{trackingResult.total}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="p-4 bg-slate-50 rounded-lg flex items-start gap-3 border border-slate-100">
                 <Package className="w-5 h-5 text-slate-400 mt-0.5" />
                 <div>
                    <h4 className="font-bold text-brand-dark text-sm mb-3">Shipment Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                        <p className="text-sm text-slate-600"><span className="font-medium text-slate-900">Carrier:</span> {trackingResult.carrier}</p>
                        <p className="text-sm text-slate-600"><span className="font-medium text-slate-900">Tracking #:</span> <span className="font-mono text-brand-dark">{trackingResult.trackingNumber}</span></p>
                        {trackingResult.trackingUrl && (
                          <p className="text-sm text-slate-600 md:col-span-2">
                            <a href={trackingResult.trackingUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-brand-orange hover:underline">Track with carrier →</a>
                          </p>
                        )}
                        {trackingResult.destination && (
                          <p className="text-sm text-slate-600 md:col-span-2"><span className="font-medium text-slate-900">Destination:</span> {trackingResult.destination}</p>
                        )}
                    </div>
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
