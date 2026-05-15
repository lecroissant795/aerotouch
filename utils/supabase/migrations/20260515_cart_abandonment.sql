-- Cart abandonment popup claims — stores email captures from exit-intent popup.
-- Mirrors popup_discount_claims but with cart-specific fields and hour-based drip.

create table if not exists cart_abandonment_claims (
  id            uuid primary key default gen_random_uuid(),
  email_normalized text not null,
  first_name    text,
  discount_code text,
  cart_snapshot  jsonb,
  cart_total     numeric,
  checkout_url   text,

  -- Drip step timestamps (hour-based: 1h, 24h, 72h)
  reminder_sent_at        timestamptz,
  social_proof_sent_at    timestamptz,
  final_nudge_sent_at     timestamptz,

  -- Lifecycle
  redeemed_at       timestamptz,
  unsubscribed_at   timestamptz,
  unsubscribe_token text unique,

  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- One active claim per email (refresh cart snapshot if drip hasn't started)
create unique index if not exists cart_abandonment_claims_email_idx
  on cart_abandonment_claims (email_normalized);

-- Drip runner: find candidates for each step
create index if not exists cart_abandonment_reminder_pending_idx
  on cart_abandonment_claims (created_at)
  where reminder_sent_at is null
    and unsubscribed_at is null
    and redeemed_at is null;

create index if not exists cart_abandonment_social_proof_pending_idx
  on cart_abandonment_claims (created_at)
  where reminder_sent_at is not null
    and social_proof_sent_at is null
    and unsubscribed_at is null
    and redeemed_at is null;

create index if not exists cart_abandonment_final_nudge_pending_idx
  on cart_abandonment_claims (created_at)
  where social_proof_sent_at is not null
    and final_nudge_sent_at is null
    and unsubscribed_at is null
    and redeemed_at is null;
