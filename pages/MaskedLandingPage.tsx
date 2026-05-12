import React, { useEffect } from 'react';
import { getMaskedDomain } from '../utils/maskedDomains';
import { BLOG_POSTS } from './BlogPage';

export const MaskedLandingPage: React.FC = () => {
  const config = getMaskedDomain();
  const post = config ? BLOG_POSTS.find((p) => p.id === config.slug) : null;

  useEffect(() => {
    if (!config) return;
    document.title = config.title;
    let metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = config.description;
  }, [config]);

  if (!config || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <p>Article not found.</p>
      </div>
    );
  }

  const paragraphs = (post.body ?? post.excerpt).split('\n\n').filter(Boolean);

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero */}
      <div className="relative w-full h-72 md:h-96 overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-3xl mx-auto px-6 pb-8 w-full">
            <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
              {post.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              {config.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Article */}
      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Byline */}
        <div className="flex items-center gap-3 text-sm text-gray-500 mb-8 pb-6 border-b border-gray-100">
          <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-sm">
            {post.author.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-gray-700">{post.author}</p>
            <p>{post.date} &middot; {post.readTime}</p>
          </div>
        </div>

        {/* Body */}
        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-5">
          {paragraphs.map((para, i) =>
            para.startsWith('•') ? (
              <p key={i} className="pl-4 border-l-4 border-gray-300 text-gray-600">
                {para}
              </p>
            ) : (
              <p key={i}>{para}</p>
            )
          )}
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-2xl bg-gray-950 text-white p-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-2">
            Recommended by our team
          </p>
          <h2 className="text-2xl font-bold mb-3">
            AeroTouch Performance Insoles
          </h2>
          <p className="text-gray-300 mb-6 max-w-md mx-auto">
            Engineered to reduce foot pain, improve alignment, and keep you moving — backed by a 30-day guarantee.
          </p>
          <a
            href={config.ctaUrl}
            className="inline-block bg-white text-gray-950 font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors"
          >
            {config.ctaText}
          </a>
        </div>

        {/* Minimal footer */}
        <p className="mt-10 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} AeroTouch &middot;{' '}
          <a href="https://aerotouch.shop/privacy" className="hover:underline">Privacy</a>
        </p>
      </div>
    </div>
  );
};
