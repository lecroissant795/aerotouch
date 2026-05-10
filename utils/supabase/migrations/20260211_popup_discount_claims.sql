-- Run in Supabase SQL editor (or via CLI) before relying on popup deduplication.
-- Requires SUPABASE_SERVICE_ROLE_KEY on the server for /api/send-popup-email.

create table if not exists public.popup_discount_claims (
  id uuid default gen_random_uuid() primary key,
  email_normalized text not null,
  first_name text not null,
  discount_code text not null,
  status text not null default 'sent',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create unique index if not exists popup_discount_claims_email_normalized_key
  on public.popup_discount_claims (email_normalized);

alter table public.popup_discount_claims enable row level security;
