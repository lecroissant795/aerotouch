-- Run in Supabase SQL editor (or via CLI) before deploying the welcome series cron.
-- Adds tracking for welcome-series sends, redemption status, and one-click unsubscribe.

alter table public.popup_discount_claims
  add column if not exists reminder_sent_at timestamptz,
  add column if not exists story_sent_at timestamptz,
  add column if not exists expiry_warning_sent_at timestamptz,
  add column if not exists redeemed_at timestamptz,
  add column if not exists unsubscribed_at timestamptz,
  add column if not exists unsubscribe_token text;

create unique index if not exists popup_discount_claims_unsub_token_key
  on public.popup_discount_claims (unsubscribe_token)
  where unsubscribe_token is not null;

create index if not exists popup_discount_claims_pending_idx
  on public.popup_discount_claims (created_at)
  where unsubscribed_at is null and redeemed_at is null;
