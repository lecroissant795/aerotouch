import React from 'react';
import { Button } from '../components/Button';
import { useRouter } from '../utils/router';

export const NotFoundPage: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-4">404</h1>
      <p className="text-xl text-slate-600 mb-8 max-w-md">
        Oops! The page you're looking for seems to have taken a detour.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={() => navigate('/')} size="lg">
          Go Home
        </Button>
        <Button onClick={() => navigate('/shop')} variant="outline" size="lg">
          Browse Shop
        </Button>
      </div>
    </div>
  );
};
