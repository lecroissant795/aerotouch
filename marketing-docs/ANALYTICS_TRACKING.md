# AeroTouch Analytics & Tracking Setup

## Google Analytics 4 (GA4) Configuration

### Key Events to Track

#### E-commerce Events
```javascript
// Page View
gtag('event', 'page_view', {
  page_title: document.title,
  page_location: window.location.href,
  page_path: window.location.pathname
});

// View Item (Product Page)
gtag('event', 'view_item', {
  currency: 'USD',
  value: 34.00,
  items: [{
    item_id: 'massage-insoles',
    item_name: 'AeroTouch Massage Insoles',
    item_category: 'Insoles',
    price: 34.00,
    quantity: 1
  }]
});

// Add to Cart
gtag('event', 'add_to_cart', {
  currency: 'USD',
  value: 34.00,
  items: [{
    item_id: 'massage-insoles',
    item_name: 'AeroTouch Massage Insoles',
    item_category: 'Insoles',
    price: 34.00,
    quantity: 1
  }]
});

// Begin Checkout
gtag('event', 'begin_checkout', {
  currency: 'USD',
  value: 68.00,
  items: [{
    item_id: 'massage-insoles',
    item_name: 'AeroTouch Massage Insoles',
    item_category: 'Insoles',
    price: 34.00,
    quantity: 2
  }]
});

// Purchase
gtag('event', 'purchase', {
  transaction_id: 'T_12345',
  value: 68.00,
  tax: 5.44,
  shipping: 0.00,
  currency: 'USD',
  coupon: 'WELCOME10',
  items: [{
    item_id: 'massage-insoles',
    item_name: 'AeroTouch Massage Insoles',
    item_category: 'Insoles',
    price: 34.00,
    quantity: 2
  }]
});
```

#### Custom Events
```javascript
// Size Guide Viewed
gtag('event', 'size_guide_viewed', {
  product_id: 'massage-insoles',
  product_name: 'AeroTouch Massage Insoles'
});

// Video Played
gtag('event', 'video_play', {
  video_title: 'Product Demo',
  video_url: '/videos/product-demo.mp4',
  video_duration: 30
});

// Review Submitted
gtag('event', 'review_submitted', {
  product_id: 'massage-insoles',
  rating: 5,
  review_text_length: 150
});

// Discount Code Applied
gtag('event', 'discount_applied', {
  code: 'WELCOME10',
  discount_amount: 6.80
});

// Live Chat Opened
gtag('event', 'live_chat_opened', {
  page: window.location.pathname
});

// Email Signup
gtag('event', 'email_signup', {
  method: 'discount_popup',
  location: 'homepage'
});

// Referral Link Clicked
gtag('event', 'referral_clicked', {
  referrer_id: 'USER123'
});
```

---

## Meta Pixel Configuration

### Standard Events
```javascript
// Page View
fbq('track', 'PageView');

// View Content (Product Page)
fbq('track', 'ViewContent', {
  content_name: 'AeroTouch Massage Insoles',
  content_category: 'Insoles',
  content_ids: ['massage-insoles'],
  content_type: 'product',
  value: 34.00,
  currency: 'USD'
});

// Add to Cart
fbq('track', 'AddToCart', {
  content_name: 'AeroTouch Massage Insoles',
  content_ids: ['massage-insoles'],
  content_type: 'product',
  value: 34.00,
  currency: 'USD'
});

// Initiate Checkout
fbq('track', 'InitiateCheckout', {
  content_category: 'Insoles',
  content_ids: ['massage-insoles'],
  contents: [{
    id: 'massage-insoles',
    quantity: 2
  }],
  value: 68.00,
  currency: 'USD'
});

// Purchase
fbq('track', 'Purchase', {
  content_ids: ['massage-insoles'],
  content_type: 'product',
  value: 68.00,
  currency: 'USD',
  num_items: 2
});
```

### Custom Events
```javascript
// Lead (Email Signup)
fbq('track', 'Lead', {
  content_name: 'Discount Popup',
  value: 0.00,
  currency: 'USD'
});

// Search
fbq('track', 'Search', {
  search_string: 'plantar fasciitis',
  content_category: 'Insoles'
});

// Custom Event: Size Guide Viewed
fbq('trackCustom', 'SizeGuideViewed', {
  product_id: 'massage-insoles'
});

// Custom Event: Video Watched
fbq('trackCustom', 'VideoWatched', {
  video_title: 'Product Demo',
  watch_percentage: 75
});
```

---

## TikTok Pixel Configuration

### Standard Events
```javascript
// Page View
ttq.track('PageView');

// View Content
ttq.track('ViewContent', {
  content_id: 'massage-insoles',
  content_type: 'product',
  content_name: 'AeroTouch Massage Insoles',
  price: 34.00,
  currency: 'USD'
});

// Add to Cart
ttq.track('AddToCart', {
  content_id: 'massage-insoles',
  content_type: 'product',
  content_name: 'AeroTouch Massage Insoles',
  price: 34.00,
  quantity: 1,
  currency: 'USD'
});

// Initiate Checkout
ttq.track('InitiateCheckout', {
  content_id: 'massage-insoles',
  content_type: 'product',
  value: 68.00,
  currency: 'USD'
});

// Complete Payment
ttq.track('CompletePayment', {
  content_id: 'massage-insoles',
  content_type: 'product',
  value: 68.00,
  currency: 'USD'
});
```

---

## UTM Parameter Strategy

### Campaign Naming Convention
```
utm_source: [platform] (facebook, google, tiktok, email, instagram)
utm_medium: [type] (cpc, social, email, organic, referral)
utm_campaign: [campaign-name] (spring-sale, plantar-fasciitis, nurse-appreciation)
utm_content: [ad-variation] (video-testimonial, carousel-product, image-lifestyle)
utm_term: [keyword] (for paid search only)
```

### Examples
```
Facebook Ad Campaign:
https://aerotouch.com?utm_source=facebook&utm_medium=cpc&utm_campaign=plantar-fasciitis&utm_content=video-testimonial

Google Search Ad:
https://aerotouch.com?utm_source=google&utm_medium=cpc&utm_campaign=foot-pain-relief&utm_term=best-insoles-plantar-fasciitis

Email Newsletter:
https://aerotouch.com?utm_source=email&utm_medium=newsletter&utm_campaign=weekly-digest&utm_content=hero-cta

Instagram Bio Link:
https://aerotouch.com?utm_source=instagram&utm_medium=social&utm_campaign=bio-link

Influencer Partnership:
https://aerotouch.com?utm_source=instagram&utm_medium=influencer&utm_campaign=fitness-mike&utm_content=story-swipeup
```

---

## Key Metrics Dashboard

### Acquisition Metrics
| Metric | Definition | Target | Current |
|--------|------------|--------|---------|
| **Traffic Sources** | Where visitors come from | Diversified | - |
| **Cost Per Click (CPC)** | Average cost per ad click | < $1.50 | - |
| **Click-Through Rate (CTR)** | % of people who click ads | > 2% | - |
| **Cost Per Acquisition (CPA)** | Cost to acquire one customer | < $25 | - |
| **Return on Ad Spend (ROAS)** | Revenue / Ad Spend | > 3x | - |

### Engagement Metrics
| Metric | Definition | Target | Current |
|--------|------------|--------|---------|
| **Bounce Rate** | % who leave after one page | < 40% | - |
| **Pages Per Session** | Avg pages viewed per visit | > 3 | - |
| **Avg Session Duration** | Time spent on site | > 2 min | - |
| **Product Page Views** | Views of product pages | Track trend | - |
| **Video Completion Rate** | % who watch full video | > 50% | - |

### Conversion Metrics
| Metric | Definition | Target | Current |
|--------|------------|--------|---------|
| **Conversion Rate** | % of visitors who purchase | > 3% | - |
| **Add-to-Cart Rate** | % who add items to cart | > 10% | - |
| **Cart Abandonment Rate** | % who abandon cart | < 60% | - |
| **Checkout Completion** | % who complete checkout | > 70% | - |
| **Average Order Value (AOV)** | Average purchase amount | > $50 | - |

### Retention Metrics
| Metric | Definition | Target | Current |
|--------|------------|--------|---------|
| **Repeat Purchase Rate** | % who buy again | > 25% | - |
| **Customer Lifetime Value (LTV)** | Total revenue per customer | > $100 | - |
| **Churn Rate** | % of customers who don't return | < 50% | - |
| **Email Open Rate** | % who open emails | > 25% | - |
| **Email Click Rate** | % who click email links | > 4% | - |

### Revenue Metrics
| Metric | Definition | Target | Current |
|--------|------------|--------|---------|
| **Monthly Revenue** | Total revenue per month | Growth | - |
| **Revenue Per Visitor (RPV)** | Revenue / Total Visitors | > $1.50 | - |
| **LTV:CAC Ratio** | Lifetime Value / Acquisition Cost | > 3:1 | - |
| **Gross Margin** | (Revenue - COGS) / Revenue | > 60% | - |
| **Net Profit Margin** | Net Profit / Revenue | > 20% | - |

---

## Conversion Funnel Tracking

### Funnel Stages
```
1. Landing Page View
   ↓ (30% conversion)
2. Product Page View
   ↓ (12% conversion)
3. Add to Cart
   ↓ (50% conversion)
4. Checkout Initiated
   ↓ (70% conversion)
5. Purchase Completed
```

### Funnel Drop-Off Analysis
Track where users are leaving:
- **Landing → Product:** Are visitors finding what they need?
- **Product → Cart:** Is the product compelling enough?
- **Cart → Checkout:** Are there friction points in the cart?
- **Checkout → Purchase:** Is checkout too complicated?

---

## Cohort Analysis Template

### Monthly Cohort Retention
```
         Month 0  Month 1  Month 2  Month 3  Month 4  Month 5  Month 6
Jan 2026   100%     25%      18%      15%      12%      10%       9%
Feb 2026   100%     28%      20%      16%      13%      11%       -
Mar 2026   100%     30%      22%      17%      14%       -        -
Apr 2026   100%     27%      19%      15%       -        -        -
May 2026   100%     29%      21%       -        -        -        -
Jun 2026   100%     26%       -        -        -        -        -
```

**Analysis:**
- Month 0 = First purchase (100% by definition)
- Month 1 = % who purchase again within 30 days
- Month 2 = % who purchase again within 60 days
- etc.

**Goal:** Increase retention in each subsequent month

---

## Attribution Modeling

### Attribution Models to Use

**1. Last-Click Attribution (Default)**
- Credit goes to the last touchpoint before purchase
- Simple but ignores earlier touchpoints

**2. First-Click Attribution**
- Credit goes to the first touchpoint
- Good for understanding awareness channels

**3. Linear Attribution**
- Credit split equally across all touchpoints
- Fair but doesn't account for importance

**4. Time-Decay Attribution**
- More credit to touchpoints closer to purchase
- Balances awareness and conversion channels

**5. Data-Driven Attribution (GA4)**
- Uses machine learning to assign credit
- Most accurate but requires sufficient data

### Recommended Approach
- Use **Last-Click** for day-to-day optimization
- Use **Data-Driven** for strategic budget allocation
- Compare models monthly to understand full customer journey

---

## Customer Segmentation

### RFM Analysis (Recency, Frequency, Monetary)

**Recency:** How recently did they purchase?
- 0-30 days: Hot
- 31-90 days: Warm
- 91-180 days: Cool
- 180+ days: Cold

**Frequency:** How often do they purchase?
- 1 purchase: One-time
- 2-3 purchases: Repeat
- 4+ purchases: Loyal

**Monetary:** How much do they spend?
- $0-50: Low
- $51-100: Medium
- $101-200: High
- $201+: VIP

### Segment Actions
| Segment | Description | Action |
|---------|-------------|--------|
| **Champions** | Recent, frequent, high-value | VIP program, early access, referral incentives |
| **Loyal Customers** | Frequent, high-value | Loyalty rewards, exclusive offers |
| **Potential Loyalists** | Recent, frequent, medium-value | Upsell, cross-sell, loyalty program |
| **New Customers** | Recent, one-time, any value | Welcome series, education, second purchase incentive |
| **At Risk** | Not recent, frequent, high-value | Win-back campaign, special discount |
| **Can't Lose Them** | Not recent, frequent, highest value | Personalized outreach, VIP treatment |
| **Hibernating** | Not recent, infrequent, low-value | Re-engagement campaign or suppress |

---

## Reporting Schedule

### Daily Reports (Automated)
- Revenue and orders
- Traffic sources
- Conversion rate
- Top products
- Ad spend and ROAS

### Weekly Reports (Manual Review)
- Funnel performance
- Campaign performance by channel
- Email metrics
- Customer acquisition cost
- Inventory levels

### Monthly Reports (Deep Dive)
- Full P&L analysis
- Cohort retention analysis
- LTV:CAC ratio
- Channel attribution comparison
- A/B test results summary
- Customer feedback themes

### Quarterly Reports (Strategic)
- Market trends and opportunities
- Competitive analysis
- Product performance review
- Customer satisfaction (NPS)
- Annual projections update

---

## Tools & Integrations

### Analytics Platforms
- **Google Analytics 4** - Web analytics
- **Shopify Analytics** - E-commerce metrics
- **Hotjar** - Heatmaps and session recordings
- **Mixpanel** - Product analytics (optional)

### Marketing Platforms
- **Meta Business Suite** - Facebook/Instagram ads
- **Google Ads** - Search and display ads
- **TikTok Ads Manager** - TikTok ads
- **Klaviyo** - Email marketing and automation

### Attribution & Tracking
- **Google Tag Manager** - Tag management
- **Triple Whale** - Attribution and analytics (optional)
- **Northbeam** - Multi-touch attribution (optional)

### Customer Data
- **Shopify Customer Data** - Purchase history
- **Klaviyo CDP** - Customer profiles
- **Gorgias** - Customer support tickets

---

## Privacy & Compliance

### GDPR Compliance
- Cookie consent banner
- Privacy policy page
- Data deletion requests
- Opt-out mechanisms

### CCPA Compliance
- "Do Not Sell My Info" link
- Privacy policy disclosure
- Data access requests

### Cookie Categories
- **Necessary:** Required for site function
- **Analytics:** Track site usage (opt-in)
- **Marketing:** Track ad performance (opt-in)
- **Preferences:** Remember user settings

---

*Track everything, optimize relentlessly, grow sustainably.*
