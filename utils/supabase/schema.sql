
-- Create the reviews table
create table public.reviews (
  id uuid default gen_random_uuid() primary key,
  product_id text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  author_name text not null,
  content text,
  image_url text, -- Optional URL for user uploaded photo
  is_verified boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.reviews enable row level security;

-- Create policies

-- 1. Allow anyone to read reviews
create policy "Reviews are viewable by everyone" 
  on public.reviews for select 
  using ( true );

-- 2. Allow anyone to insert reviews (you might want to add auth later, but for now open is fine with potential spam moderation)
create policy "Anyone can insert a review" 
  on public.reviews for insert 
  with check ( true );

-- Optional: Create an index on product_id for faster lookups
create index reviews_product_id_idx on public.reviews (product_id);

-- Create the leads table (for Discount Popup)
create table public.leads (
  id uuid default gen_random_uuid() primary key,
  first_name text not null,
  email text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS) for leads
alter table public.leads enable row level security;

-- Policy: Allow anyone (anon) to insert leads
create policy "Anyone can insert a lead" 
  on public.leads for insert 
  with check ( true );
