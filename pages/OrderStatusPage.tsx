import React, { useState } from 'react';
import { Button } from '../components/Button';
import { 
  Search,
  Truck, 
  Package, 
  CheckCircle, 
  Clock, 
  MapPin,
  Mail,
  User,
  Calendar,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  Box
} from 'lucide-react';

interface OrderStep {
  label: string;
  date: string | null;
  location?: string;
  completed: boolean;
  icon: React.ElementType;
}

interface OrderDetails {
  orderNumber: string;
  status: string;
  estimatedDelivery: string;
  carrier: string;
  trackingNumber: string;
  trackingUrl?: string;
  orderDate: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    image?: string;
  }>;
  shippingAddress: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
  };
  steps: OrderStep[];
}

export const OrderStatusPage: React.FC = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setOrderDetails(null);

    // Basic validation
    if (!orderNumber.trim() || !email.trim()) {
      setError('Please enter both order number and email address.');
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
      const order = data.rawData;
      
      // Handle GraphQL edges/nodes structure for line items
      const lineItems = order.lineItems?.edges?.map((edge: any) => ({
        name: edge.node.title,
        quantity: edge.node.quantity,
        price: parseFloat(edge.node.originalUnitPriceSet?.shopMoney?.amount || '0'),
        image: edge.node.variant?.image?.url
      })) || [];

      const mappedResult: OrderDetails = {
        orderNumber: orderNumber,
        status: data.status || 'Processing',
        estimatedDelivery: data.estimatedDelivery || 'Calculating...',
        carrier: order.fulfillments?.[0]?.trackingInfo?.[0]?.company || 'Pending',
        trackingNumber: order.fulfillments?.[0]?.trackingInfo?.[0]?.number || 'N/A',
        trackingUrl: order.fulfillments?.[0]?.trackingInfo?.[0]?.url,
        orderDate: new Date(order.createdAt).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        items: lineItems,
        shippingAddress: {
          name: order.shippingAddress?.name || 'N/A',
          line1: order.shippingAddress?.address1 || '',
          line2: order.shippingAddress?.address2,
          city: order.shippingAddress?.city || '',
          state: order.shippingAddress?.province || '',
          zip: order.shippingAddress?.zip || ''
        },
        steps: [
          { 
            label: 'Order Placed', 
            date: new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            completed: true, 
            icon: CheckCircle 
          },
          { 
            label: 'Processing', 
            date: data.status !== 'Order Placed' ? 'In progress' : null,
            completed: data.status !== 'Order Placed', 
            icon: Package 
          },
          { 
            label: 'Shipped', 
            date: data.status === 'Shipped' || data.status === 'Delivered' ? 'Shipped' : null,
            completed: data.status === 'Shipped' || data.status === 'Delivered', 
            icon: Truck 
          },
          { 
            label: 'Out for Delivery', 
            date: data.status === 'Out for Delivery' || data.status === 'Delivered' ? 'Today' : null,
            completed: data.status === 'Out for Delivery' || data.status === 'Delivered', 
            icon: Truck 
          },
          { 
            label: 'Delivered', 
            date: data.status === 'Delivered' ? new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : null,
            completed: data.status === 'Delivered', 
            icon: CheckCircle 
          },
        ]
      };

      setOrderDetails(mappedResult);
    } catch (err: any) {
      setError(err.message || 'Unable to find your order. Please check your order number and email.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('delivered')) return 'text-green-600 bg-green-50 border-green-200';
    if (statusLower.includes('shipped') || statusLower.includes('delivery')) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (statusLower.includes('processing')) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-slate-600 bg-slate-50 border-slate-200';
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* Hero Section - Modern Deep Dark Theme */}
      <section className="relative pt-32 pb-28 bg-brand-dark overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-orange/10 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-lime/5 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-brand-orange text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
            <Package className="w-3 h-3" />
            Order Tracking
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 text-white tracking-tight leading-tight">
            Track Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-red-400">Order</span>
          </h1>
          <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
            Enter your order details below to check your shipment status and estimated delivery.
          </p>
        </div>
      </section>

      {/* Search Form */}
      <section className="relative z-20 -mt-10 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 p-8 md:p-10">
            <form onSubmit={handleTrack} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="orderNumber" className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-3">
                    <Box className="w-4 h-4 text-brand-orange" />
                    Order Number
                  </label>
                  <input
                    type="text"
                    id="orderNumber"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="e.g. #AT12345"
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all text-slate-900 placeholder:text-slate-400"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-3">
                    <Mail className="w-4 h-4 text-brand-orange" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all text-slate-900 placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>
              
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl py-4 text-base font-bold flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Track Order
                  </>
                )}
              </Button>
            </form>
            
            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-sm">Error</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Order Details */}
      {orderDetails && (
        <section className="pb-20">
          <div className="container mx-auto px-4 md:px-6 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column - Order Info & Status */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Status Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-10">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-8 border-b border-slate-100">
                    <div>
                      <div className="text-sm text-slate-500 mb-2 font-medium">Order #{orderDetails.orderNumber}</div>
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-lg ${getStatusColor(orderDetails.status)}`}>
                        <Truck className="w-5 h-5" />
                        {orderDetails.status}
                      </div>
                    </div>
                    <div className="text-left md:text-right">
                      <div className="text-sm text-slate-500 mb-1 font-medium">Estimated Delivery</div>
                      <div className="text-2xl font-black text-brand-dark flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-brand-orange" />
                        {orderDetails.estimatedDelivery}
                      </div>
                    </div>
                  </div>

                  {/* Progress Steps */}
                  <div className="relative">
                    {/* Progress Line */}
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200 md:hidden"></div>
                    <div className="hidden md:block absolute top-6 left-0 right-0 h-0.5 bg-slate-200"></div>
                    
                    {/* Active Progress Line */}
                    <div 
                      className="absolute left-6 top-0 w-0.5 bg-brand-orange md:hidden transition-all duration-1000"
                      style={{ height: `${(orderDetails.steps.filter(s => s.completed).length / orderDetails.steps.length) * 100}%` }}
                    ></div>
                    <div 
                      className="hidden md:block absolute top-6 left-0 h-0.5 bg-brand-orange transition-all duration-1000"
                      style={{ width: `${(orderDetails.steps.filter(s => s.completed).length / orderDetails.steps.length) * 100}%` }}
                    ></div>

                    <div className="flex flex-col md:flex-row justify-between relative space-y-6 md:space-y-0">
                      {orderDetails.steps.map((step, index) => {
                        const StepIcon = step.icon;
                        const isCompleted = step.completed;
                        const isCurrent = !step.completed && index > 0 && orderDetails.steps[index - 1].completed;
                        
                        return (
                          <div key={index} className="flex md:flex-col items-start md:items-center gap-4 md:gap-3 relative z-10 md:flex-1">
                            <div 
                              className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 shrink-0
                                ${isCompleted ? 'bg-brand-orange border-brand-orange text-white shadow-lg shadow-brand-orange/30 scale-110' : 
                                isCurrent ? 'bg-white border-brand-orange text-brand-orange shadow-lg shadow-brand-orange/20 scale-105' : 
                                'bg-white border-slate-200 text-slate-300'}`}
                            >
                              <StepIcon className="w-5 h-5" />
                            </div>
                            <div className="text-left md:text-center">
                              <p className={`font-bold text-sm ${isCompleted || isCurrent ? 'text-brand-dark' : 'text-slate-400'}`}>
                                {step.label}
                              </p>
                              {step.date && (
                                <p className="text-xs text-slate-500 mt-1 font-medium">{step.date}</p>
                              )}
                              {step.location && (
                                <p className="text-xs text-slate-400 mt-0.5">{step.location}</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Tracking Details */}
                <div className="bg-gradient-to-br from-slate-50 to-white rounded-3xl shadow-sm border border-slate-100 p-8">
                  <h3 className="text-xl font-black text-brand-dark mb-6 flex items-center gap-3">
                    <Truck className="w-6 h-6 text-brand-orange" />
                    Shipment Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Carrier</p>
                        <p className="text-base font-bold text-brand-dark">{orderDetails.carrier}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Tracking Number</p>
                        <div className="flex items-center gap-2">
                          <p className="text-base font-mono font-bold text-brand-dark">{orderDetails.trackingNumber}</p>
                          {orderDetails.trackingUrl && (
                            <a 
                              href={orderDetails.trackingUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-brand-orange hover:text-orange-600 transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Order Date</p>
                        <p className="text-base font-bold text-brand-dark">{orderDetails.orderDate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Shipping To</p>
                        <p className="text-base font-bold text-brand-dark">
                          {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Order Items & Address */}
              <div className="space-y-6">
                
                {/* Order Items */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                  <h3 className="text-lg font-black text-brand-dark mb-6 flex items-center gap-2">
                    <Package className="w-5 h-5 text-brand-orange" />
                    Order Items
                  </h3>
                  <div className="space-y-4">
                    {orderDetails.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                        ) : (
                          <div className="w-16 h-16 bg-slate-200 rounded-lg flex items-center justify-center">
                            <Package className="w-6 h-6 text-slate-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-brand-dark truncate">{item.name}</p>
                          <p className="text-xs text-slate-500 mt-1">Qty: {item.quantity}</p>
                          <p className="text-sm font-bold text-brand-orange mt-1">${item.price.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                  <h3 className="text-lg font-black text-brand-dark mb-6 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-brand-orange" />
                    Delivery Address
                  </h3>
                  <div className="space-y-2 text-sm text-slate-700">
                    <p className="font-bold text-brand-dark">{orderDetails.shippingAddress.name}</p>
                    <p>{orderDetails.shippingAddress.line1}</p>
                    {orderDetails.shippingAddress.line2 && <p>{orderDetails.shippingAddress.line2}</p>}
                    <p>
                      {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.zip}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Help Section */}
      {!orderDetails && !isLoading && (
        <section className="pb-20">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-10">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-black text-brand-dark mb-3">Need Help?</h3>
                <p className="text-slate-600">Can't find your order or need assistance?</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a href="#" className="group flex items-center gap-3 p-4 rounded-xl border-2 border-slate-100 hover:border-brand-orange hover:bg-orange-50/50 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-brand-orange text-slate-600 group-hover:text-white flex items-center justify-center transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-bold text-sm text-brand-dark">Email Us</p>
                    <p className="text-xs text-slate-500">Get support</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-brand-orange transition-colors" />
                </a>
                <a href="#" className="group flex items-center gap-3 p-4 rounded-xl border-2 border-slate-100 hover:border-brand-orange hover:bg-orange-50/50 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-brand-orange text-slate-600 group-hover:text-white flex items-center justify-center transition-colors">
                    <Package className="w-5 h-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-bold text-sm text-brand-dark">View FAQ</p>
                    <p className="text-xs text-slate-500">Quick answers</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-brand-orange transition-colors" />
                </a>
                <a href="#" className="group flex items-center gap-3 p-4 rounded-xl border-2 border-slate-100 hover:border-brand-orange hover:bg-orange-50/50 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-brand-orange text-slate-600 group-hover:text-white flex items-center justify-center transition-colors">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-bold text-sm text-brand-dark">Live Chat</p>
                    <p className="text-xs text-slate-500">Chat now</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-brand-orange transition-colors" />
                </a>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
