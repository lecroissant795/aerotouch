import React, { useEffect, useState } from 'react';

export const SalesBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.scrollY > 20;
  });

  useEffect(() => {
    const handleScroll = () => {
      // Sync with Navbar scroll threshold (20px) to show when navbar turns white
      setIsVisible(window.scrollY > 20);
    };

    // Ensure correct state on mount (including refresh at scrolled position).
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const BannerContent = ({ suffix }: { suffix: string }) => (
    <div className="flex items-center min-w-max">
      {[1, 2, 3, 4].map((item) => (
        <span key={`${suffix}-${item}`} className="flex items-center mx-8 font-bold uppercase tracking-widest text-xs md:text-sm">
          <span className="mr-2">SALE</span>
          Summer Seasonal Sale ☀️
          <span className="mx-2">•</span>
          Limited-Time Offers Across Best Sellers
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={`fixed left-0 right-0 top-[64px] z-40 transition-all duration-300 ease-out transform ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0 pointer-events-none'
      }`}
    >
      <div className="bg-brand-lime text-brand-dark py-2.5 overflow-hidden whitespace-nowrap">
        <div className="flex animate-marquee">
          <BannerContent suffix="a" />
          <BannerContent suffix="b" />
        </div>
      </div>
    </div>
  );
};
