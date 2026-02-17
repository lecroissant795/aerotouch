
import { createClient } from '@supabase/supabase-js';

// These environment variables should be set in your .env file
// VITE_SUPABASE_URL=your_project_url
// VITE_SUPABASE_ANON_KEY=your_anon_key

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials missing. Real-time reviews will not load.');
}

export const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export interface Review {
    id: string;
    product_id: string;
    rating: number; // 1 to 5
    author_name: string;
    content: string;
    image_url?: string;
    is_verified: boolean;
    created_at: string;
}
