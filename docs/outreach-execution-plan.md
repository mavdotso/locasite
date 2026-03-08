# Locosite Outreach Execution Plan — Batch 1 (60 Orlando Businesses)

**Prepared by**: Maya Patel (Growth)
**Date**: March 8, 2026
**Status**: Ready to execute — pending Jordan's enriched list
**Parent**: MAV-661

---

## Overview

Jordan has scraped 60 Orlando businesses from Google Maps and is enriching email addresses now. This document is the step-by-step execution guide for the board to run the first outreach batch manually, evaluate results, and plan Batch 2.

**The goal of Batch 1 is simple**: Get 1–3 paying customers. Every piece of this plan is oriented toward that.

---

## 1. Email Sequencing

We run a 3-email sequence per lead over 8 days. Alex's email templates (at `docs/locasite/outreach-email-sequence-google-maps.md`) are the source of truth for copy — use them exactly as written, substituting the personalization variables below.

### Sequence Structure

| Email | Day | Purpose | Tone |
|-------|-----|---------|------|
| Email 1 | Day 1 | Reveal — "your site is live and ready to claim" | Friendly surprise |
| Email 2 | Day 4 | First-mover urgency — others in Orlando are moving | Light social proof |
| Email 3 | Day 8 | Last chance — slot expires, no pressure | Low-pressure close |

### Automatic Stop Rules

Stop sending further emails to a lead the moment any of the following happen:
- They reply (any reply — positive, negative, confused — stops the sequence)
- They click the claim link and complete the claim flow
- They say "remove me," "unsubscribe," or equivalent → suppress permanently

**Do not email a lead more than 3 times ever.** After Email 3, the sequence is done regardless of outcome.

---

## 2. Segmentation

### Recommended Approach: Two Variants, Not Per-Category

Segment by **two major groups** only — restaurants vs. home services (contractors). Do not create per-category variants (no separate "plumber" vs. "HVAC" vs. "landscaping" versions). The two-variant approach is the sweet spot:

- Enough personalization to feel relevant ("homeowners searching for a plumber" vs. "diners looking up your menu")
- Low enough operational complexity for a manual send process

**Variant assignment logic:**

| Business category | Use variant |
|-------------------|------------|
| Restaurants, cafes, diners, pizza, taquerias, BBQ, food trucks | Variant A — Restaurants |
| Plumbers, HVAC, landscapers, electricians, cleaners, roofers | Variant B — Home Services |

If a business is ambiguous (e.g., a food truck that also does catering), use Variant A.

### Personalization Variables (Required for Every Email)

Before sending any email, fill in all four variables for that lead:

| Variable | Source | Example |
|----------|--------|---------|
| `[First name]` | Owner name from Google Maps listing or Jordan's enrichment data | Maria |
| `[Business Name]` | Exact business name from Google Maps | Maria's Kitchen |
| `[City]` / `[Neighborhood]` | From Google Maps listing | Orlando / Thornton Park |
| `[CLAIM_LINK]` | Unique claim URL for this business (from locosite's site generation) | locosite.io/claim/marias-kitchen-orlando |

**If first name is unknown**: Use "Hi there," — never "Hi [First name]," with brackets showing.

---

## 3. Timing Schedule

### Day-by-Day Execution

| Day | Action |
|-----|--------|
| **Day 0** (prep) | Jordan delivers enriched list → board reviews and assigns claim links → list is segmented |
| **Day 1** | Send Email 1 to all 60 leads (split A/B by category) |
| **Day 4** | Send Email 2 to all leads who have NOT replied and NOT claimed |
| **Day 8** | Send Email 3 to all leads who have NOT replied and NOT claimed |
| **Day 9+** | No further contact. Monitor replies, track conversions |

### Before Each Send — Suppression Check

Before sending Email 2 (Day 4) and Email 3 (Day 8), remove from the send list:
- Anyone who replied to a prior email
- Anyone who clicked the claim link
- Anyone who asked to be removed

Maintain a running suppression list (a simple column in the tracking spreadsheet works fine).

---

## 4. Manual Send Process — Board Execution Guide

Since the Resend API key isn't configured yet, the board will send from their personal or company email. Follow this guide exactly.

### Step 1: Prepare the Send Day

1. Open the enriched lead list (Jordan's deliverable — CSV or Google Sheet)
2. Filter for the current send day (Day 1, 4, or 8)
3. Remove any suppressed leads (replied, claimed, unsubscribed)
4. Split remaining leads into two groups: Restaurants (Variant A) and Home Services (Variant B)

### Step 2: For Each Lead — Compose the Email

Open a new email draft. Fill in:

**From name**: Use your real first name, not "Locosite Team"
Example: `Kai at Locosite <kai@locosite.io>`

**To**: The lead's email address (one per email — do NOT BCC the full list, see Step 3)

**Subject line**: Use the recommended subject line from the email template for that email number and variant. Substitute `[Business Name]` with the actual name.

**Body**: Paste the email body from the template. Substitute all four personalization variables.

**Footer** (required by CAN-SPAM — paste at the bottom of every email):
```
---
You're receiving this because we found [Business Name] on Google Maps
and created a free website preview for you.

To opt out of future emails, reply with "remove me" and we'll take care of it immediately.

Locosite Corp | [Physical Address]
```

### Step 3: BCC List Format for Efficiency

For leads within the same variant where personalization is minimal (e.g., only business name and claim link differ), you can batch-send — BUT only if you use mail merge. **Do not BCC a group of recipients.** Every lead must receive an individually addressed email with their own name and claim link.

**Recommended workflow for 60 sends:**
- Use Gmail's mail merge via Google Sheets + a free mail merge add-on (e.g., Yet Another Mail Merge / YAMM)
- OR send individually (60 emails takes ~45 minutes if you paste+edit a template for each)
- Import the CSV into YAMM with column mapping: `email`, `first_name`, `business_name`, `city`, `claim_link`

**YAMM send checklist:**
1. Create Gmail draft with `{{first_name}}`, `{{business_name}}`, `{{city}}`, `{{claim_link}}` variables
2. Open YAMM → select your Google Sheet → map columns to variables
3. Send test email to your own address first — verify all variables resolve correctly
4. Send to full list

### Step 4: Log Each Send

After each send day, update the tracking sheet:

| Column | What to log |
|--------|------------|
| `email_1_sent_at` | Timestamp when Email 1 was sent |
| `email_2_sent_at` | Timestamp when Email 2 was sent (or "skipped - replied") |
| `email_3_sent_at` | Timestamp when Email 3 was sent (or "skipped - claimed") |
| `status` | `queued` → `e1_sent` → `e2_sent` → `e3_sent` → `replied` / `claimed` / `paid` |

---

## 5. Response Handling

Replies fall into four categories. Here's how to handle each.

### Category 1: Positive Interest ("How does this work?" / "I'm interested" / "Tell me more")

Respond same day. Template:

---
**Subject**: Re: [original subject]

Hi [First name],

Great to hear from you! Here's the short version:

We built a preview website for [Business Name] using your Google listing — your menu/services, hours, photos, and contact info are already on it. You can preview it here: [CLAIM_LINK]

To make it officially yours:
- Claim it (takes 60 seconds)
- Pay the one-time setup fee ($149) — that gets it published
- After that, $9/month to keep it live

Happy to answer any questions. What would be most helpful to know?

[Your first name]

---

### Category 2: Ready to Pay ("How do I claim it?" / "I want it")

Respond immediately. Send them directly to the claim link and confirm it worked:

---
**Subject**: Re: [original subject]

[First name] — perfect! Here's your link:

[CLAIM_LINK]

Click it, follow the steps, and you'll be live within minutes. If anything looks off or you have trouble, just reply here and I'll sort it out.

[Your first name]

---

### Category 3: Not Interested ("No thanks" / "Not right now" / "We're good")

Acknowledge and close gracefully. Do not push back:

---
**Subject**: Re: [original subject]

No problem at all, [First name]. Thanks for letting me know — I'll make sure you don't hear from us again.

Good luck with [Business Name].

[Your first name]

---

→ Mark this lead as `opt_out` in tracking sheet. Do not contact again.

### Category 4: Confused or Suspicious ("How did you get my email?" / "Is this spam?")

Respond transparently and calmly:

---
**Subject**: Re: [original subject]

Hi [First name],

Totally fair question. We found [Business Name] on Google Maps while building a website for businesses in Orlando that don't have one yet. Your email came from your public business listing.

We built a preview site using your Google info — it's not live to anyone yet, just a preview for you to review. You can see it here: [CLAIM_LINK]

If you'd prefer not to hear from us, just say the word and we'll remove you immediately.

[Your first name]

---

---

## 6. Success Metrics for Batch 1

### Targets

| Metric | Floor (Acceptable) | Target | Strong |
|--------|-------------------|--------|--------|
| Open rate | 15% (9 opens) | 25% (15 opens) | 35%+ (21+ opens) |
| Reply rate | 2% (1–2 replies) | 5% (3 replies) | 10%+ (6+ replies) |
| Claim link clicks | 3% (2 clicks) | 6% (4 clicks) | 10%+ (6+ clicks) |
| Paid conversions | 1 customer ($149) | 3 customers ($447) | 5+ customers ($745+) |
| Monthly recurring | $9/mo | $27/mo | $45/mo |

### What Constitutes a Successful Batch

**Minimum viable**: 1 paying customer. The product-market fit signal is real. Run Batch 2.
**Target**: 3 paying customers. Open rate >20%. Scale to 100 businesses in Batch 2.
**Strong**: 5+ customers, >25% open rate, multiple positive replies. Accelerate — expand to Jacksonville FL.

### Red Flags — Pause and Diagnose Before Continuing

If any of the following happen after Email 1 sends, **stop Email 2** and investigate:

| Red flag | Threshold | Likely cause |
|----------|-----------|-------------|
| Bounce rate | >8% (5+ bounces from 60 sends) | Bad email data — verify list before continuing |
| Zero opens after 48h | 0 opens | Spam folder placement — check with Mail-Tester |
| Spam complaint | Any | Email content or from-address triggering filters — review before proceeding |

### Tracking Sheet Columns

Maintain one row per lead with these columns:

```
business_name | category | email | claim_link | email_1_sent_at | email_2_sent_at | email_3_sent_at | replied_at | reply_type | claimed_at | paid_at | status | notes
```

Status values: `queued` → `e1_sent` → `e2_sent` → `e3_sent` → `replied` / `claimed` / `paid` / `opt_out`

---

## 7. Batch 2 Planning

### When to Plan Batch 2

Start planning Batch 2 after Email 3 has been sent to all Batch 1 leads (Day 8 or later). Do not wait for full conversion data — leads often convert slowly over 2–4 weeks.

### Batch 2 Decision Matrix

| Batch 1 outcome | Batch 2 recommendation |
|----------------|------------------------|
| ≥1 paying customer + open rate >15% | Expand to 150–200 businesses; same city (Orlando), same process |
| ≥1 customer but open rate <15% | Fix deliverability first (set up dedicated sending domain); then expand |
| 0 customers but replies >5% | Copy is working, claim flow may have friction — review claim UX before Batch 2 |
| 0 customers, 0 replies, <10% open rate | Full audit: subject lines, from address, category targeting. Do NOT scale yet. |

### Batch 2 Size and Timing

- **Size**: 150–200 businesses (if Batch 1 is successful)
- **Cities**: Orlando only until we have 5+ paying customers; add Jacksonville FL after that
- **Timing**: Begin enrichment process 1 week before you want to send Email 1
- **Infrastructure note**: If Batch 2 > 100 sends, set up Resend API key or Instantly.ai — manual sends at 150+ are operationally painful

### Batch 2 Improvements to Test

After reviewing Batch 1 data, consider testing:
1. **Subject line variant**: If open rate <20%, A/B test a different subject (e.g., "Homeowners in Orlando searched for you last week" vs. the current reveal subject)
2. **Category expansion**: Add cleaning services and roofers if Batch 1 shows good home services conversion
3. **Personalization depth**: If time allows, add neighborhood-level personalization ("I see you're in Thornton Park...")
4. **Claim link placement**: Move claim link higher in Email 2 body if click rate is low

---

## Quick Reference

### Pre-Send Checklist (Every Send Day)

- [ ] Suppression list updated (removed replies, claims, opt-outs)
- [ ] Claim links verified (spot-check 3 links work and go to the right page)
- [ ] Personalization variables filled in correctly (test email sent to self first)
- [ ] CAN-SPAM footer included with physical address
- [ ] Send logged in tracking sheet

### Key Links

| Resource | Location |
|----------|---------|
| Email templates (copy) | `docs/locasite/outreach-email-sequence-google-maps.md` |
| Tracking sheet | TBD — board to create in Google Sheets |
| Locosite claim flow | locosite.io/claim |
| Sending infrastructure plan | `docs/locasite/sending-infrastructure-plan.md` |
| Campaign tracking doc | `docs/locasite/google-maps-campaign-tracking.md` |

---

*This plan covers Batch 1 only. Update with Batch 1 results before expanding.*
