import React from 'react';
import { ChevronLeft, Clock, User } from 'lucide-react';
import { Button } from '../components/Button';
import type { BlogPost } from '../types';

interface BlogPostPageProps {
  post: BlogPost;
  onBack: () => void;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({ post, onBack }) => {
  const body = post.body ?? post.excerpt;

  return (
    <div className="animate-in fade-in duration-500 bg-white min-h-screen">
      <article className="pt-28 pb-24">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="mb-8 -ml-2 inline-flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to The Edge
          </Button>

          <header className="mb-10">
            <span className="inline-block bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded mb-4">
              {post.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-6">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center">
                <User className="w-4 h-4 mr-2 text-slate-400" />
                {post.author}
                {post.authorRole && (
                  <span className="text-slate-400 ml-1">· {post.authorRole}</span>
                )}
              </span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-slate-400" />
                {post.date} · {post.readTime}
              </span>
            </div>
          </header>

          <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100 mb-12">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="prose prose-slate prose-lg max-w-none">
            {body.split('\n\n').map((paragraph, i) => {
              const trimmed = paragraph.trimStart();
              const isBullet = trimmed.startsWith('•');
              return (
                <p
                  key={i}
                  className={`text-slate-600 leading-relaxed mb-6 ${
                    isBullet ? 'pl-5 border-l-2 border-brand-orange/35 -ml-1' : ''
                  }`}
                >
                  {paragraph}
                </p>
              );
            })}
          </div>

          <footer className="mt-16 pt-8 border-t border-slate-200">
            <Button variant="outline" onClick={onBack}>
              Back to The Edge
            </Button>
          </footer>
        </div>
      </article>
    </div>
  );
};
