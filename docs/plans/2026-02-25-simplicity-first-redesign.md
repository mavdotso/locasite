# Simplicity-First Redesign

## Goal

Redesign Locasite so a busy small business owner can go from zero to a live website in under 5 minutes — and never need to come back. Every screen, flow, and interaction is optimized for speed to publish, not ongoing management.

## Target User

Small business owners who already have a Google Business listing. They are not necessarily non-technical — they are **busy**. They don't have time to learn an app. The product should feel like a task to finish, not a tool to learn.

## Core Constraint

**"Set it and forget it."** The setup flow IS the product. The dashboard, editor, and all secondary screens exist only as fallbacks. Most users should go live without ever opening the editor.

---

## Design Principles

| Principle | Implementation |
|-----------|---------------|
| One primary action per screen | Every screen has exactly one thing the user should do. It's always the biggest button. |
| No navigation during setup | No sidebar, no top nav, no hamburger menu. Just a back arrow and step dots. |
| Big text, big buttons | Scannable in 2 seconds. Primary buttons are full-width on mobile. |
| Calm, muted palette | White backgrounds, soft grays, one accent color. No gradients, no dark mode during setup. |
| System-level typography | Inter or system sans-serif stack. Nothing fancy. |
| Generous whitespace | Screens feel half-empty. That communicates simplicity. |
| No jargon | "Web address" not "subdomain." "Go Live" not "Publish." "Your site" not "domain." |
| Progress is always visible | Step dots or progress bar. The user always knows how close they are to done. |
| Confirmation at every milestone | Checkmarks, green highlights. Reassurance they haven't broken anything. |

### What's Removed From Setup

- Dashboard (only for returning users)
- Sidebar navigation
- Settings pages
- SEO fields
- Analytics
- Billing (until custom domain)
- "Draft" status concept
- Multiple competing CTAs

---

## Entry Points

### Entry A: Outreach (Primary for MVP)

Users receive a direct link to their pre-built site (e.g., `locasite.com/claim/[businessId]`). They land on a full preview of their auto-generated website with a claim banner on top.

### Entry B: Organic (Landing Page)

Users visit locasite.com and paste their Google Maps URL. We scrape the data and show them a preview.

Both entry points converge on Screen 2 ("Your website is ready").

---

## Setup Flow (3 Screens)

### Screen 1A: Landing Page (Organic Visitors)

```
┌─────────────────────────────────────────────┐
│  [Locasite]                                 │
│                                             │
│     Your business deserves a website.       │
│     Get one in 2 minutes.                   │
│                                             │
│  Paste your Google Maps link:               │
│  ┌─────────────────────────────────────┐    │
│  │ https://maps.google.com/...         │    │
│  └─────────────────────────────────────┘    │
│  ┌─────────────────────────────────────┐    │
│  │         See Your Website →          │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  Don't have your link?                      │
│  [Search for your business instead →]       │
│                                             │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │
│                                             │
│  How it works:                              │
│  1. Paste your Google Maps link             │
│  2. We build your site instantly            │
│  3. Go live in one click                    │
│                                             │
└─────────────────────────────────────────────┘
```

**Behavior:**
- User pastes Google Maps URL
- We scrape business data (name, photos, reviews, hours, address, phone)
- Auto-select theme based on business category
- Auto-generate all sections with real data
- Redirect to Screen 2

**Fallback:** "Search for your business instead" link opens a search input for users who don't have their Google Maps URL handy.

### Screen 1B: Claim Page (Outreach Users)

Users click a link sent during outreach. They land directly on a preview of their pre-built site with a claim banner.

```
┌─────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────┐ │
│ │  This is your business, right?          │ │
│ │  [Claim This Site — Sign in with Google]│ │
│ └─────────────────────────────────────────┘ │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │                                     │    │
│  │   [Full scrollable preview of the   │    │
│  │    auto-generated website with      │    │
│  │    real business data]              │    │
│  │                                     │    │
│  └─────────────────────────────────────┘    │
│                                             │
└─────────────────────────────────────────────┘
```

**Behavior:**
- User sees their website already built
- "Claim This Site" triggers Google sign-in
- After sign-in, auto-verify ownership (match Google account to Google Business listing)
- Redirect to Screen 2

**Auth:** Google sign-in only. No email/password. Simplest possible auth flow.

**Verification:** Automated. Compare Google account to Google Business listing owner. Should be a single API call, not a manual process.

### Screen 2: "Your Website is Ready"

Both entry points converge here. The user is authenticated and verified.

```
┌─────────────────────────────────────────────┐
│  ← Back                ✓ Verified owner     │
│─────────────────────────────────────────────│
│                                             │
│     Your website is ready                   │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │                                     │    │
│  │   [Full scrollable preview of       │    │
│  │    their website with real data,    │    │
│  │    auto-selected theme]             │    │
│  │                                     │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │         Go Live                     │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  [Edit details]          [Change look]      │
│                                             │
│  Your site will be at:                      │
│  joes-bakery.locasite.com                   │
│                                             │
└─────────────────────────────────────────────┘
```

**Behavior:**
- Shows full preview with auto-selected theme and real data
- **"Go Live"** is the primary action — big, full-width, unmissable
- Subdomain auto-assigned from business name slug, shown as info (not editable here)
- Secondary links: "Edit details" and "Change look"
- Most users just hit Go Live

**"Change look" behavior:** Opens a bottom sheet/modal with 6 theme cards. Each shows a mini-preview with the user's actual business data. Auto-recommended theme has a "Best match" badge. Tapping a theme instantly updates the preview behind the sheet. No "Apply" button — just tap and close.

**"Edit details" behavior:** Transitions to inline editing mode (see Editor section below).

### Screen 3: "You're Live!"

```
┌─────────────────────────────────────────────┐
│                                             │
│              ✓                              │
│                                             │
│        Your site is live!                   │
│                                             │
│    joes-bakery.locasite.com                 │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │       Visit Your Site →             │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  [Copy link]        [Share]                 │
│                                             │
│─────────────────────────────────────────────│
│                                             │
│  Want joesbakery.com instead?               │
│  [Set up your own domain →]                 │
│                                             │
└─────────────────────────────────────────────┘
```

**Behavior:**
- Celebration moment: big checkmark, "Your site is live!"
- URL front and center
- "Visit Your Site" is primary action — they should go see it
- Copy link and Share for quick distribution
- Soft upsell for custom domain (paid feature)
- This is the end of the flow for most users

---

## Secondary Screens

### Dashboard (Returning Users Only)

The dashboard only appears when a signed-in user visits the app after initial setup. It is not part of the setup flow.

```
┌─────────────────────────────────────────────┐
│  [Locasite]                    [Joe ▾]      │
│─────────────────────────────────────────────│
│                                             │
│  Your Sites                                 │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │  [Business photo]                   │    │
│  │                                     │    │
│  │  Joe's Bakery                       │    │
│  │  🟢 Live · joes-bakery.locasite.com │    │
│  │                                     │    │
│  │  [Visit Site]         [Edit Site]   │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  [+ Add another business]                   │
│                                             │
└─────────────────────────────────────────────┘
```

**Rules:**
- One card per business. Most users have exactly one.
- Card shows: photo, name, status (Live/Draft), URL, two buttons (Visit, Edit).
- No overflow menus, settings icons, or message counts.
- "Add another business" at the bottom for multi-location owners.
- If site is Draft (abandoned before publishing): card shows "Finish setup →" instead, linking back to Screen 2.
- Messages, domain settings, and other options are accessed from within the editor — not from the dashboard.

### Editor

Two progressive modes:

#### Mode 1: Inline Edit (Default)

When user taps "Edit details" from the preview or "Edit Site" from dashboard.

```
┌─────────────────────────────────────────────┐
│  ← Done                    [Go Live]        │
│─────────────────────────────────────────────│
│                                             │
│  [Website preview with dashed outlines      │
│   around each section and pencil icons]     │
│                                             │
│  ┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┐    │
│  │  Welcome Banner            [✏️]     │    │
│  │  JOE'S BAKERY                      │    │
│  │  Fresh baked daily since 1985      │    │
│  └─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┘    │
│                                             │
│  ┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┐    │
│  │  About Your Business       [✏️]     │    │
│  │  Family-owned bakery...            │    │
│  └─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┘    │
│                                             │
│  ┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┐    │
│  │  What You Offer            [✏️]     │    │
│  │  Bread · Pastries · Cakes         │    │
│  └─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┘    │
│                                             │
│  [+ Add a section]                          │
│                                             │
│  [🎨 Change look]    [⚙️ More options]      │
│                                             │
└─────────────────────────────────────────────┘
```

**Tapping a pencil icon** opens a slide-up panel:

```
┌─────────────────────────────────────────────┐
│  Edit: Welcome Banner              [✕]      │
│─────────────────────────────────────────────│
│                                             │
│  Title                                      │
│  ┌─────────────────────────────────────┐    │
│  │ Joe's Bakery                        │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  Subtitle                                   │
│  ┌─────────────────────────────────────┐    │
│  │ Fresh baked daily since 1985        │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  Photo                                      │
│  ┌──────────┐                               │
│  │ [photo]  │  [Change photo]               │
│  └──────────┘                               │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │            Save                     │    │
│  └─────────────────────────────────────┘    │
│                                             │
└─────────────────────────────────────────────┘
```

**Rules:**
- Only content fields (text, photos). No layout, colors, or spacing controls.
- Plain English field labels ("Title", "Subtitle", "Photo").
- Save immediately applies changes to the preview.
- "Add a section" shows a simple list of section types with friendly names:
  - Welcome Banner, About Your Business, What You Offer, Photo Gallery, Customer Reviews, Contact Info

#### Mode 2: Advanced Editor (Power Users)

Accessed via "More options" at the bottom of inline edit mode. Opens the existing Simple Builder with sidebar, drag-and-drop, layout/style controls. This is never the default path — only for users who explicitly want full control.

### Theme Picker (Bottom Sheet)

```
┌─────────────────────────────────────────────┐
│  Pick a look                          [✕]   │
│                                             │
│  ┌───────┐  ┌───────┐  ┌───────┐           │
│  │ Mini  │  │ Mini  │  │ Mini  │           │
│  │preview│  │preview│  │preview│           │
│  │       │  │       │  │       │           │
│  │Modern │  │Classic│  │ Warm  │           │
│  │       │  │       │  │⭐Best │           │
│  │       │  │       │  │ match │           │
│  └───────┘  └───────┘  └───────┘           │
│  ┌───────┐  ┌───────┐  ┌───────┐           │
│  │ Mini  │  │ Mini  │  │ Mini  │           │
│  │preview│  │preview│  │preview│           │
│  │       │  │       │  │       │           │
│  │ Bold  │  │Minimal│  │ Fresh │           │
│  └───────┘  └───────┘  └───────┘           │
│                                             │
└─────────────────────────────────────────────┘
```

**Rules:**
- 6 themes max. Fewer choices = faster decisions.
- Each mini-preview uses the user's actual business name and photo.
- Auto-recommended theme has "Best match" badge (based on business category).
- Tapping a theme instantly updates the preview behind the sheet.
- No "Apply" button. Tap to preview, close to confirm, tap another to compare.

### Custom Domain Setup

Accessed from "You're Live!" screen or "More options" in editor.

**Step 1: Current address**
```
  Your Web Address

  🟢 joes-bakery.locasite.com
     [Copy link]   [Visit]

  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─

  Want to use your own domain?
  Like joesbakery.com

  This is a paid feature.
  Plans start at $X/month.

  [Set Up My Domain →]
```

**Step 2: Enter domain**
```
  Type your domain:
  ┌─────────────────────────────┐
  │ joesbakery.com              │
  └─────────────────────────────┘
  [Next →]
```

**Step 3: Provider selection**
```
  Where did you buy your domain?
  [GoDaddy] [Namecheap] [Google] [Other]
```
Shows provider-specific instructions with plain language. No DNS jargon — just "Go to [provider], find Settings, and paste this value."

**Step 4: Verification**
```
  ⏳ Connecting your domain...
     This can take up to 48 hours.
     We'll email you when it's ready.

  [Check now]
```

No mention of CNAME, TXT records, SSL, or DNS in user-facing UI.

---

## Section Naming (User-Facing)

| Internal Type | User-Facing Name | Description |
|---------------|-----------------|-------------|
| header | Navigation Bar | The menu at the top of your site |
| hero | Welcome Banner | The big eye-catching section visitors see first |
| about | About Your Business | Tell your story |
| services | What You Offer | Your services, menu, or products |
| gallery | Photo Gallery | Photos of your work or space |
| reviews | Customer Reviews | What your customers say |
| contact | Contact Info | How to find and reach you |
| footer | Footer | Links and info at the bottom |

---

## Auto-Generation Rules

When a business is created (from Google Maps data), the site is generated with:

1. **Theme:** Auto-selected based on business category (`getBusinessCategoryTheme()`)
2. **Sections:** Auto-populated in this order:
   - Navigation Bar (business name)
   - Welcome Banner (business name + tagline from category + hero photo from Google)
   - About Your Business (generated from Google description or category-appropriate placeholder)
   - What You Offer (from Google Business categories)
   - Customer Reviews (real Google reviews, top 3 by rating)
   - Contact Info (address, phone, hours from Google)
   - Footer (business name, address)
3. **Subdomain:** Auto-generated slug from business name (e.g., `joes-bakery`)

The goal: the auto-generated site should be good enough to publish without any edits.

---

## What This Design Replaces

| Current | New |
|---------|-----|
| Search for business → create → dashboard → theme → editor → settings → publish | Claim/paste link → preview → Go Live |
| Dashboard as hub with cards, checklists, overflow menus | Minimal dashboard for returning users only |
| Simple Builder as primary editing experience | Inline edit as default, Simple Builder as "advanced" |
| Theme gallery as separate page in setup flow | Bottom sheet overlay, accessible from preview |
| Publish from Settings page | "Go Live" button on preview screen |
| Email + GitHub OAuth | Google sign-in only |
| Manual business verification | Automated verification via Google account matching |
| Subdomain input during setup | Auto-assigned from business name |
| 9 theme options | 6 theme options |

---

## Architecture Notes

- **No schema changes needed** for most of this. Themes, sections, and business records already support what's described.
- **New pages:** Claim page (Screen 1B), "Your website is ready" preview (Screen 2), "You're Live!" confirmation (Screen 3)
- **Modified pages:** Landing page (simplified), dashboard (stripped down), editor (inline edit mode added)
- **Removed from setup flow:** Business dashboard intermediate page, settings page, separate theme gallery page
- **Auth change:** Google sign-in only (remove GitHub OAuth and email/password)
- **New feature:** Auto-verification of business ownership via Google account
- **New feature:** Inline editing mode as a layer on top of the site preview
