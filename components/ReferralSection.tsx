import React, { useState } from 'react';
import { Users, Gift, Share2, Copy, Check } from 'lucide-react';

const REFERRAL_CODE = 'FRIEND15';
const SHARE_URL = 'https://aerotouch.com';
const SHARE_TEXT = `Use my code ${REFERRAL_CODE} to get 15% off your first AeroTouch order! ${SHARE_URL}`;

export const ReferralSection: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(REFERRAL_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = REFERRAL_CODE;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AeroTouch — Give 15%, Get 15%',
          text: SHARE_TEXT,
          url: SHARE_URL,
        });
        return;
      } catch {
        // User cancelled or share failed — fall through to clipboard
      }
    }

    // Fallback: copy the full share message to clipboard
    try {
      await navigator.clipboard.writeText(SHARE_TEXT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <section className="bg-brand-orange py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-multiply"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center text-white">
        <span className="inline-flex items-center gap-2 bg-white/20 text-white text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-6 backdrop-blur-sm">
            <Users className="w-3.5 h-3.5" /> Refer a Friend
        </span>
        
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-none mb-4">
            Give 15%. Get 15%.
        </h2>
        <p className="text-white/95 text-base md:text-xl font-medium max-w-2xl mx-auto mb-8 leading-relaxed">
            Invite friends and family with your code. <strong>You both get 15% off</strong> your next order — share the relief.
        </p>

        {/* Referral code block */}
        <div className="max-w-md mx-auto mb-8">
            <p className="text-white/80 text-sm font-bold uppercase tracking-widest mb-3">Your referral code</p>
            <div className="flex items-center justify-center gap-2 bg-white/15 backdrop-blur-sm rounded-xl border-2 border-white/30 px-4 py-4">
                <span className="font-mono text-2xl md:text-3xl font-black tracking-[0.3em] text-white">{REFERRAL_CODE}</span>
                <button
                    type="button"
                    onClick={handleCopy}
                    className="flex-shrink-0 p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-200"
                    aria-label="Copy code"
                >
                    {copied ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                </button>
            </div>
            <div className={`mt-2 text-sm font-bold text-white transition-all duration-300 ${copied ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'}`}>
              Copied to clipboard!
            </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-2 bg-white text-brand-orange text-lg font-black uppercase tracking-wider px-8 py-4 rounded-full shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] hover:scale-105 hover:shadow-xl transition-all duration-300 w-full sm:w-auto justify-center"
            >
                <Share2 className="w-5 h-5" />
                Share with Friends
            </button>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/90">
                <Gift className="w-4 h-4" />
                You & your friend each get 15% off
            </div>
        </div>
        
        <p className="mt-6 text-xs text-white/70 font-medium">
            Code valid for new customers. One use per person. Terms apply.
        </p>
        </div>
    </section>
  );
};
