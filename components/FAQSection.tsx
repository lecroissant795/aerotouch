import React, { useState } from 'react';
import { Truck, Smile, Headphones, Ruler, Activity, Star, Wrench, Tag, Box, CircleDollarSign, ChevronUp, ChevronDown } from 'lucide-react';

export const FAQSection: React.FC = () => {
    const [activeFaq, setActiveFaq] = useState<string | null>(null);

    return (
        <div className="w-full">
            {/* Trust Badges Grid */}
            <div className="grid grid-cols-3 gap-2 mb-10">
                <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 flex items-center justify-center mb-2">
                        <Truck className="w-8 h-8 text-brand-dark" strokeWidth={1.5} />
                    </div>
                    <span className="text-[10px] md:text-xs font-black uppercase leading-tight tracking-tight">Tracked Insured Shipping</span>
                </div>
                <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 flex items-center justify-center mb-2">
                        <Smile className="w-8 h-8 text-brand-dark" strokeWidth={1.5} />
                    </div>
                    <span className="text-[10px] md:text-xs font-black uppercase leading-tight tracking-tight">Try Risk-Free for 60 Days</span>
                </div>
                <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 flex items-center justify-center mb-2">
                        <Headphones className="w-8 h-8 text-brand-dark" strokeWidth={1.5} />
                    </div>
                    <span className="text-[10px] md:text-xs font-black uppercase leading-tight tracking-tight">24/7 Customer Support</span>
                </div>
            </div>

            <div className="space-y-0 border-t border-slate-100">
                {[
                    { 
                        id: 'size', 
                        q: 'Smaller? In-Between Sizes?', 
                        icon: Ruler,
                        answer: (
                            <>
                                <p className="mb-2">If you’re in between sizes, we recommend choosing the larger size for the best fit.</p>
                                <p className="mb-2">Our insoles are fully trimmable, so you can easily cut them to match your exact shoe size using the guide lines on the back.</p>
                                <p className="font-bold">👉 This ensures a perfect custom fit for any shoe.</p>
                            </>
                        )
                    },
                    { 
                        id: 'fit', 
                        q: 'Will AeroTouch Fit My Shoes?', 
                        icon: Activity,
                        answer: (
                            <>
                                <p className="mb-2">Yes — AeroTouch insoles are designed to fit most types of footwear, including:</p>
                                <ul className="list-disc pl-5 mb-2 space-y-1">
                                    <li>Sneakers</li>
                                    <li>Running shoes</li>
                                    <li>Work boots</li>
                                    <li>Casual shoes</li>
                                </ul>
                                <p className="mb-2">Simply remove your existing insoles and replace them with AeroTouch insoles.</p>
                                <p className="font-bold">👉 For best results, use in shoes with removable insoles.</p>
                            </>
                        )
                    },
                    { 
                        id: 'condition', 
                        q: 'Help My Foot Condition?', 
                        icon: Star,
                        answer: (
                            <>
                                <p className="mb-2">AeroTouch insoles are designed to provide enhanced arch support, shock absorption, and stability, which can help relieve discomfort from:</p>
                                <ul className="list-disc pl-5 mb-2 space-y-1">
                                    <li>Plantar fasciitis</li>
                                    <li>Flat feet</li>
                                    <li>Heel pain</li>
                                    <li>General foot fatigue</li>
                                </ul>
                                <p className="mb-2">While many customers experience significant relief, AeroTouch insoles are not a medical device. For severe conditions, consult a healthcare professional.</p>
                                <p className="font-bold">👉 Our goal is to help you move comfortably every day.</p>
                            </>
                        )
                    },
                    { 
                        id: 'last', 
                        q: 'How Long Do AeroTouch Insoles Last?', 
                        icon: Wrench,
                        answer: (
                            <>
                                <p className="mb-2">They typically last 5–8 months, depending on usage and activity level.</p>
                                <p className="mb-2">For optimal comfort and support, we recommend replacing them once you notice:</p>
                                <ul className="list-disc pl-5 mb-2 space-y-1">
                                    <li>Reduced cushioning</li>
                                    <li>Loss of support</li>
                                </ul>
                                <p className="font-bold">👉 Active users (running, long shifts) may need to replace them sooner.</p>
                            </>
                        )
                    },
                    { 
                        id: 'discount', 
                        q: 'Discount Different Sizes', 
                        icon: Tag,
                        answer: (
                            <>
                                <p className="mb-2">Yes — you can mix and match sizes in our bundle offers.</p>
                                <p className="mb-2">Perfect if you’re:</p>
                                <ul className="list-disc pl-5 mb-2 space-y-1">
                                    <li>Buying for family or friends</li>
                                    <li>Using different shoe sizes</li>
                                </ul>
                                <p className="font-bold">👉 The discount still applies — just select your sizes before checkout.</p>
                            </>
                        )
                    },
                    { 
                        id: 'shipping', 
                        q: 'Shipping & Delivery', 
                        icon: Box,
                        answer: (
                            <>
                                <p className="mb-2">We offer fast, tracked shipping worldwide.</p>
                                <ul className="list-disc pl-5 mb-2 space-y-1">
                                    <li>Processing time: 1–3 business days</li>
                                    <li>Delivery time: 5–12 business days (varies by location)</li>
                                </ul>
                                <p>You will receive a tracking number once your order is shipped.</p>
                            </>
                        )
                    },
                    { 
                        id: 'return', 
                        q: 'Return & Refund Policy', 
                        icon: CircleDollarSign,
                        answer: (
                            <>
                                <p className="mb-2">We offer a 60-day risk-free guarantee.</p>
                                <p className="mb-2">If you’re not satisfied, you can:</p>
                                <ul className="list-disc pl-5 mb-2 space-y-1">
                                    <li>Request a return or exchange within 30 days</li>
                                    <li>Receive a refund or replacement</li>
                                </ul>
                                <p className="font-bold">👉 Your comfort is our priority — no stress, no risk.</p>
                            </>
                        )
                    },
                ].map((item) => (
                    <div key={item.id} className="border-b border-slate-100">
                        <button 
                            className="w-full py-4 flex items-center justify-between text-left group"
                            onClick={() => setActiveFaq(activeFaq === item.id ? null : item.id)}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className="w-5 h-5 text-brand-dark" strokeWidth={2.5} />
                                <span className="font-black text-sm md:text-base uppercase tracking-tight group-hover:text-brand-orange transition-colors">{item.q}</span>
                            </div>
                            {activeFaq === item.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                        {activeFaq === item.id && (
                            <div className="pb-4 text-sm text-slate-600 leading-relaxed animate-in slide-in-from-top-2 duration-200">
                                {item.answer}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
