# Personalized Discount Popup - Implementation Plan

## Overview
Transform the DiscountPopup from a lead-capture placeholder into a fully functional system that generates unique personalized discount codes in Shopify and emails them to customers.

---

## Architecture

```
┌─────────────────┐
│  DiscountPopup  │
│   (Frontend)    │
└────────┬────────┘
         │ POST {firstName, email}
         ▼
┌─────────────────────────────────────┐
│   Supabase Edge Function            │
│   /functions/generate-discount      │
├─────────────────────────────────────┤
│ 1. Validate input                   │
│ 2. Generate code: NAME20            │
│ 3. Create Shopify price rule        │
│ 4. Create discount code             │
│ 5. Send email via Resend            │
│ 6. Save lead to Supabase            │
│ 7. Return {code, success}           │
└────────┬────────────────────────────┘
         │
    ┌────┴─────┐
    ▼          ▼
┌──────┐  ┌─────────┐
│Shopify│  │  Email  │
│ Admin │  │  Sent   │
│  API  │  │         │
└──────┘  └─────────┘
```

---

## Phase 1: Prerequisites & Setup

### 1.1 Shopify Admin API Access
- [ ] Log into Shopify Admin (aerotuch.myshopify.com)
- [ ] Go to **Settings → Apps and sales channels → Develop apps**
- [ ] Create new app "AeroTouch Discount Codes"
- [ ] Configure scopes:
  - `price_rules` (read/write)
  - `discount_codes` (read/write)
- [ ] Install app and generate **API token**
- [ ] Add to `.env`:
  ```
  VITE_SHOPIFY_ADMIN_DOMAIN=aerotuch.myshopify.com
  VITE_SHOPIFY_ADMIN_API_TOKEN=shpat_xxxxxxxxxxxxx
  ```

### 1.2 Email Service (Resend)
- [ ] Sign up at [resend.com](https://resend.com)
- [ ] Verify domain (aerotouch.com) or use resend.dev domain
- [ ] Create API key
- [ ] Add to `.env`:
  ```
  VITE_RESEND_API_KEY=re_xxxxxxxxxxxxx
  VITE_RESEND_FROM_EMAIL=noreply@aerotouch.com
  VITE_RESEND_FROM_NAME=AeroTouch
  ```

### 1.3 Supabase Edge Functions
- [ ] Ensure Supabase CLI installed: `npm install -g supabase`
- [ ] Login: `supabase login`
- [ ] Link project: `supabase link --project-ref mhecgxhcmohbmeimrfud`
- [ ] Initialize functions: `supabase functions init generate-discount`
- [ ] Install dependencies in `functions/generate-discount`:
  ```
  cd functions/generate-discount
  npm install @shopify/shopify-api resend
  ```

---

## Phase 2: Backend Implementation

### 2.1 Create Supabase Edge Function
**File:** `functions/generate-discount/index.ts`

Responsibilities:
- Accept POST request with `{ firstName, email }`
- Validate email format and required fields
- Generate unique discount code (format: `{FIRSTNAME}20`)
- Create Shopify price rule (20% off, single use, 30 day expiry)
- Create discount code under that price rule
- Send email with code via Resend
- Insert lead record into `leads` table with `discount_code`
- Return success/error response

Key Shopify Admin API endpoints:
- `POST /admin/api/2024-01/price_rules.json`
- `POST /admin/api/2024-01/price_rules/{price_rule_id}/discount_codes.json`

### 2.2 Database Schema Update
**File:** `utils/supabase/schema.sql`

Add `discount_code` column to `leads` table:
```sql
alter table public.leads add column discount_code text;
-- Optional: track email sent status
alter table public.leads add column email_sent_at timestamp with time zone;
```

### 2.3 Local Development Setup
- [ ] Create `functions/generate-discount/.env.local`:
  ```
  SUPABASE_URL=https://mhecgxhcmohbmeimrfud.supabase.co
  SUPABASE_ANON_KEY=your_anon_key
  SHOPIFY_ADMIN_DOMAIN=aerotuch.myshopify.com
  SHOPIFY_ADMIN_API_TOKEN=shpat_xxxxx
  RESEND_API_KEY=re_xxxxx
  RESEND_FROM_EMAIL=noreply@aerotouch.com
  RESEND_FROM_NAME=AeroTouch
  ```
- [ ] Test locally: `supabase functions serve generate-discount`

---

## Phase 3: Frontend Updates

### 3.1 Update DiscountPopup Component
**File:** `components/DiscountPopup.tsx`

Changes:
- Replace optimistic success with API call to Supabase Edge Function
- Add loading state during submission
- Show error message if API fails
- Only display discount code after successful response
- Close popup automatically after code display (with delay)
- Store discount code in leads table (already handled by backend)

State additions:
```tsx
const [isSubmitting, setIsSubmitting] = useState(false);
const [error, setError] = useState<string | null>(null);
const [generatedCode, setGeneratedCode] = useState<string | null>(null);
```

API call:
```tsx
const response = await fetch(
  `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-discount`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ firstName, email }),
  }
);
```

### 3.2 Environment Variable
Ensure `.env` has:
```
VITE_SUPABASE_URL=https://mhecgxhcmohbmeimrfud.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

---

## Phase 4: Email Template

### 4.1 Create Email Template
Design HTML email in Resend or within Edge Function:

**Subject:** `[First Name], here's your 20% AeroTouch discount!`

**Body:**
- Personalized greeting with first name
- Show the discount code prominently
- Explain it's 20% off all products
- Include CTA button: "Shop Now" → `https://aerotouch.com`
- Terms: single use, 30 days, excludes sale items
- Unsubscribe link

---

## Phase 5: Testing & Validation

### 5.1 Backend Tests
- [ ] Unit test code generation logic (no duplicate codes)
- [ ] Mock Shopify API to test price rule creation
- [ ] Mock Resend to test email sending
- [ ] Test error handling (Shopify down, email failed, etc.)

### 5.2 End-to-End Tests
- [ ] Submit form with valid data → code generated, email sent, lead saved
- [ ] Submit duplicate email → graceful error (Shopify will reject duplicate codes)
- [ ] Invalid email format → client-side validation
- [ ] Empty fields → form validation
- [ ] Network failure → error message shown
- [ ] Test code actually works at checkout

### 5.3 Manual QA Checklist
- [ ] Popup appears after 5 seconds (if not dismissed)
- [ ] Form validation works (required fields)
- [ ] Loading spinner during submission
- [ ] Success message shows actual code (not fake)
- [ ] Email arrives within 60 seconds
- [ ] Code works in cart checkout
- [ ] Dismissed popup doesn't reappear (sessionStorage)
- [ ] Referral popup timing still works after discount popup

---

## Phase 6: Production Deployment

### 6.1 Deploy Supabase Function
```bash
cd functions/generate-discount
supabase functions deploy generate-discount --project-ref mhecgxhcmohbmeimrfud
```

### 6.2 Configure CORS (if needed)
- [ ] Add CORS headers in function for your domain
- [ ] Test from production URL

### 6.3 Monitoring
- [ ] Set up Supabase logs monitoring
- [ ] Create alert for function errors
- [ ] Track success/failure metrics:
  - Submissions per day
  - Email delivery rate
  - Code redemption rate
  - Conversion from leads

---

## Phase 7: Post-Launch

### 7.1 Analytics Tracking
- Add GA4 event on successful discount code generation
- Track popup impression rate
- Track submission completion rate
- Track email open rate (Resend provides)
- Track code usage at checkout

### 7.2 Rate Limiting (Optional but Recommended)
Add rate limiting to prevent abuse:
- Max 1 code per email (enforced by unique constraint)
- Max 3 codes per IP per day
- Add captcha if spam becomes issue

### 7.3 Discount Code Settings in Shopify
- [ ] Create master price rule template in Shopify admin
- [ ] Set restrictions:
  - Minimum purchase: $0 (or $50 for AOV boost)
  - Customer eligibility: All customers
  - Usage limit: 1 per customer (Shopify tracks by email)
  - Starts: Immediately upon creation
  - Ends: 30 days after creation

---

## File Changes Summary

| File | Change | Type |
|------|--------|------|
| `utils/supabase/schema.sql` | Add `discount_code` & `email_sent_at` columns | Modify |
| `functions/generate-discount/index.ts` | New Edge Function | Create |
| `components/DiscountPopup.tsx` | Call backend, show real code | Modify |
| `.env` | Add Shopify Admin & Resend credentials | Modify |
| `marketing-docs/ANALYTICS_TRACKING.md` | Document new events | Update |

---

## Success Criteria

1. ✅ User submits name/email → receives unique code
2. ✅ Email arrives within 2 minutes with code and shop link
3. ✅ Code applies 20% discount at checkout
4. ✅ Code is single-use and expires after 30 days
5. ✅ All leads saved to Supabase with code attached
6. ✅ No duplicate codes generated
7. ✅ Error handling works (friendly messages)

---

## Estimated Timeline

| Task | Time |
|------|------|
| Shopify Admin API setup | 30 min |
| Resend setup | 20 min |
| Edge Function development | 2-3 hours |
| Frontend updates | 1 hour |
| Testing & debugging | 1-2 hours |
| **Total** | **5-7 hours** |

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Shopify rate limits | Cache price rule templates, retry with backoff |
| Email deliverability issues | Use Resend domain verification, monitor spam score |
| Code collision (NAME20 taken) | Append random suffix: `{NAME}20{XXX}` |
| Abuse (multiple emails) | Rate limit by IP, unique email constraint |
| Edge Function cold starts | Keep function warm (ping every 10 min) if latency critical |

---

## Next Steps

1. Confirm you want to proceed with this plan
2. Provide Shopify Admin API token or create it yourself
3. Choose email service (Resend recommended)
4. I'll implement the code end-to-end
5. Test in development
6. Deploy to production
