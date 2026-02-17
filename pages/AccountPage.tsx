import React, { useState } from 'react';
import { customer } from '../utils/customer';
import { Button } from '../components/Button';

export const AccountPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (isLogin) {
        const result = await customer.login(email, password);
        if (result?.accessToken) {
            setToken(result.accessToken);
        }
      } else {
        await customer.register(email, password);
        setIsLogin(true); // Switch to login after register
        alert("Registration successful! Please log in.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    }
  };

  if (token) {
      return (
          <div className="container mx-auto px-4 py-24 text-center">
              <h1 className="text-3xl font-bold mb-4">My Account</h1>
              <p className="mb-4">You are logged in.</p>
              <p className="text-sm text-gray-500 break-all mb-8">Token: {token}</p>
              <Button onClick={() => setToken(null)} variant="outline">Logout</Button>
          </div>
      )
  }

  return (
    <div className="container mx-auto px-4 py-24 max-w-md">
      <h1 className="text-3xl font-bold mb-8 text-center">{isLogin ? 'Login' : 'Create Account'}</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
           <label className="block text-sm font-medium mb-1">Email</label>
           <input 
             type="email" 
             className="w-full p-2 border rounded" 
             value={email}
             onChange={e => setEmail(e.target.value)}
             required
           />
        </div>
        <div>
           <label className="block text-sm font-medium mb-1">Password</label>
           <input 
             type="password" 
             className="w-full p-2 border rounded" 
             value={password}
             onChange={e => setPassword(e.target.value)}
             required
           />
        </div>
        
        {error && <div className="text-red-500 text-sm">{error}</div>}

        <Button fullWidth type="submit" size="lg">
            {isLogin ? 'Sign In' : 'Register'}
        </Button>
      </form>

      <div className="mt-4 text-center">
          <button 
            type="button"
            className="text-sm text-brand-dark underline"
            onClick={() => setIsLogin(!isLogin)}
          >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
      </div>
    </div>
  );
};
