# Locosite WhatsApp Outreach Package — Batch 1 (Orlando FL)

**Prepared by**: Flora Natsumi (Head of Product)
**Date**: March 8, 2026
**Status**: ✅ COMPLETE — ready to execute immediately
**URL format**: Confirmed from codebase (`locosite.io/claim/{claimToken}`) — no placeholders remain
**Send list**: `locasite/docs/outreach/whatsapp-send-list.csv` — 58 rows, full URLs in `claim_url` column
**Parent**: MAV-728

---

## Why WhatsApp (Not Email)

The board's MAV-726 clarification confirmed the intended claim workflow is WhatsApp-based:
> "they get a WhatsApp message with a ready site made for them automatically → click claim → pay → publish"

WhatsApp eliminates every current email blocker:

| Blocker | Email Path | WhatsApp Path |
|---------|-----------|---------------|
| CAN-SPAM mailing address (MAV-702) | Required | **Not applicable** |
| Email sending infra (Resend/YAMM) | Required | **Not needed** |
| Email deliverability/spam risk | High | **N/A** |
| Open rates | ~20% | **~98%** |
| Setup time | Days (blocked) | **Minutes** |
| Ready now? | ❌ | ✅ |

---

## Phone Number Status

**58 of 61 businesses have confirmed phone numbers.** All sourced from Google Maps listings.

| Category | Count | With Phone |
|----------|-------|-----------|
| Auto repair | 11 | 11 |
| HVAC | 8 | 8 |
| Garage door | 8 | 8 |
| Plumbing | 7 | 7 |
| Electrician | 7 | 7 |
| Restaurant | 5 | 5 |
| Handyman | 3 | 3 |
| Bar | 3 | 2 |
| Painting | 2 | 2 |
| Cleaning | 2 | 2 |
| Pressure washing | 2 | 2 |
| Other | 3 | 1 |
| **Total** | **61** | **58** |

Data file: `locasite/docs/locosite-enriched-emails.csv`

---

## Before You Start — One-Time Setup

**Option A: WhatsApp Business (Recommended)**

1. Download [WhatsApp Business app](https://www.whatsapp.com/business/) on your phone
2. Register with a phone number you control (can be a second SIM or Google Voice)
3. Set business name to your real name (not "Locosite") — keep it personal
4. Start sending from the app

**Option B: WhatsApp Web with Personal Number**

1. Open [web.whatsapp.com](https://web.whatsapp.com) on your desktop
2. Scan QR code with your phone's WhatsApp
3. For new contacts: click the pencil/compose icon → type the phone number with country code
4. US numbers format: `+1 (407) 628-2333` → enter as `+14076282333`

**Important:** WhatsApp may prompt you to add the number to contacts first. If using a personal number, consider creating contacts in bulk before starting (see tracking sheet).

---

## Message Templates

### Variant A — Restaurants

Use for: restaurants, cafes, bars, diners, food trucks.

---

**How to fill in the template:** Open `whatsapp-send-list.csv`. For each row, copy `claim_url` and append UTM params as shown. Replace `[First name]` and `[Restaurant Name]` with the business name.

**Concrete example (Row 1 — The Ravenous Pig):**
```
Hey Ravenous Pig — I built a website for The Ravenous Pig.

We pulled your menu, photos, and hours from Google Maps and put them on a clean, mobile-friendly site.

Take a look: https://locosite.io/claim/cca44955-bf9b-4ced-a049-d14940cc960c?utm_source=whatsapp&utm_medium=direct&utm_campaign=restaurants-orlando-batch01

$149 to publish, $9/mo to keep it live. Takes 60 seconds to claim.

No worries if it's not for you — just wanted you to see it.
```

---

**Message 1 (Day 1):**

```
Hey [First name] — I built a website for [Restaurant Name].

We pulled your menu, photos, and hours from Google Maps and put them on a clean, mobile-friendly site.

Take a look: [claim_url from CSV]?utm_source=whatsapp&utm_medium=direct&utm_campaign=restaurants-orlando-batch01

$149 to publish, $9/mo to keep it live. Takes 60 seconds to claim.

No worries if it's not for you — just wanted you to see it.
```

---

**Message 2 (Day 3 — no reply):**

```
Hey [First name], following up on the [Restaurant Name] website I sent over.

Still unclaimed: [claim_url from CSV]?utm_source=whatsapp&utm_medium=direct&utm_campaign=restaurants-orlando-batch01&utm_content=msg2

8 in 10 diners look up a restaurant before deciding where to eat. Just wanted to make sure you saw it.
```

---

**Message 3 (Day 6 — no reply):**

```
Last message — wrapping up unclaimed previews for [Restaurant Name] this week. After this I'll move the slot to another business.

Link: [claim_url from CSV]?utm_source=whatsapp&utm_medium=direct&utm_campaign=restaurants-orlando-batch01&utm_content=msg3

No problem if the timing isn't right.
```

---

### Variant B — Home Services

Use for: plumbers, electricians, HVAC, auto repair, garage door, handyman, painters, cleaners, landscapers.

---

**How to fill in the template:** Open `whatsapp-send-list.csv`. For each row, copy `claim_url` and append UTM params. Replace `[First name]` and `[Business Name]` with the business name.

**Concrete example (Row 3 — Express Orlando Plumbing):**
```
Hey Express Orlando Plumbing — I built a website for Express Orlando Plumbing & Drain Clean.

We pulled your services, reviews, and contact info from Google and put them on a clean site homeowners find when searching.

Take a look: https://locosite.io/claim/742b068c-bede-4eac-93a2-d2052a632ead?utm_source=whatsapp&utm_medium=direct&utm_campaign=home-services-orlando-batch01

$149 to publish, $9/mo after. 60 seconds to claim.

Just wanted you to see it — no pressure.
```

---

**Message 1 (Day 1):**

```
Hey [First name] — I built a website for [Business Name].

We pulled your services, reviews, and contact info from Google and put them on a clean site homeowners find when searching.

Take a look: [claim_url from CSV]?utm_source=whatsapp&utm_medium=direct&utm_campaign=home-services-orlando-batch01

$149 to publish, $9/mo after. 60 seconds to claim.

Just wanted you to see it — no pressure.
```

---

**Message 2 (Day 3 — no reply):**

```
Hey [First name], following up on the [Business Name] website.

9 out of 10 homeowners search online before calling a contractor. This is the part where they find you — or don't.

Still available: [claim_url from CSV]?utm_source=whatsapp&utm_medium=direct&utm_campaign=home-services-orlando-batch01&utm_content=msg2
```

---

**Message 3 (Day 6 — no reply):**

```
Last one — closing unclaimed previews for [Business Name] this week.

If the timing's off, no worries. If you want it: [claim_url from CSV]?utm_source=whatsapp&utm_medium=direct&utm_campaign=home-services-orlando-batch01&utm_content=msg3

$149 once, $9/mo. That's it.
```

---

## Send Instructions

### Day 1 — Send to All 58 Leads

Estimated time: **1–2 hours** (message + send per lead, steady pace).

For each lead in `locasite/docs/outreach/whatsapp-send-list.csv`:
1. Open WhatsApp → new chat → enter `whatsapp_number` (already formatted as `+1XXXXXXXXXX`)
2. Copy the Message 1 template for their variant (A = restaurant, B = home services)
3. Fill in: `[First name]` → use business name, `[Business Name]` → `business_name` column, URL → paste `claim_url` + UTM suffix
4. Send
5. Mark `msg1_sent` + timestamp in the CSV (or your Google Sheet copy)

**Tips:**
- Work through the list top-to-bottom. Keep a tab open with this doc + the send list.
- Don't batch-paste to multiple contacts — WhatsApp detects that as spam.
- If a number fails to deliver (red ✕), mark `bad_number` and move on.
- Aim for 30–40 sends per session. Take a break. Finish later.

### Day 3 — Follow-Up

Send Message 2 only to leads where `msg1_sent` is set and no reply received.

### Day 6 — Final

Send Message 3 only to leads who have not replied and have not claimed.

### Stop After Day 6

No further messages. Monitor for replies and conversions. If you get a reply at any point, stop the sequence for that lead immediately.

---

## Response Handling

### "How does it work?"

```
Hey [First name] — glad you asked!

We found [Business Name] on Google Maps and auto-built a preview website using your listing info (services, reviews, hours, contact). It's not live to anyone yet — just a preview for you.

If you want to make it yours:
→ Click the claim link
→ Pay $149 one-time setup
→ $9/mo to keep it running

Happy to answer anything else.
```

### "I want it / how do I claim?"

```
[First name] — great! Here's your link:

[claim_url from CSV — no UTM needed here, keep it clean]

Click it and follow the steps — you'll be live in minutes. If anything looks off, just reply here.
```

### "No thanks / not right now"

```
No problem at all, [First name]. Won't hear from us again. Good luck with [Business Name].
```

### "How did you get my number?"

```
Hey [First name] — fair question. Your number is listed publicly on your Google Maps business profile. We found [Business Name] while building websites for Orlando businesses that don't have one yet.

The preview site isn't live to anyone — just for your eyes. If you'd prefer not to hear from us, just say the word.
```

---

## Tracking Sheet

Create a Google Sheet with these columns:

```
business_name | category | phone | variant | slug | msg1_sent | msg2_sent | msg3_sent | replied_at | reply_type | claimed_at | paid_at | status | notes
```

**Status lifecycle:**
`queued → msg1_sent → msg2_sent → msg3_sent → replied / claimed / paid / opt_out / no-response`

**Status values:**

| Status | Meaning |
|--------|---------|
| `queued` | Not yet messaged |
| `msg1_sent` | Message 1 sent |
| `msg2_sent` | Message 2 sent |
| `msg3_sent` | Sequence complete |
| `replied-interested` | Positive or neutral reply |
| `replied-not-interested` | Declined |
| `claimed` | Completed claim, payment pending |
| `paid` | Paying customer ($149 + $9/mo) |
| `opt_out` | Asked to be left alone — do not contact |
| `bad_number` | WhatsApp delivery failed |
| `no-response` | Sequence complete, no reply |

---

## Full Send List (58 Businesses)

**URLs confirmed.** Full send list with claim URLs is at `locasite/docs/outreach/whatsapp-send-list.csv` — import that directly into Google Sheets. The `claim_url` column has the complete URL for each business (format: `locosite.io/claim/{claimToken}`, verified from the codebase).

The list below is a quick reference (no URLs). Use the CSV for sending.

| # | Business Name | Category | Phone | Variant |
|---|---------------|----------|-------|---------|
| 1 | The Ravenous Pig | restaurant | (407) 628-2333 | A |
| 2 | Mamazzita Gastrobar | restaurant | (689) 867-0201 | A |
| 3 | Express Orlando Plumbing & Drain Clean | plumbing | (407) 214-3024 | B |
| 4 | Orlando Water Heater Pros | plumbing | (407) 710-6272 | B |
| 5 | J&G Plumbing | plumbing | (407) 759-3391 | B |
| 6 | Bryan Plumbing Inc | plumbing | (407) 299-9006 | B |
| 7 | FRED Electrical Residential Services | electrician | (571) 982-9312 | B |
| 8 | Assure Electrical Orlando | electrician | (689) 219-3080 | B |
| 9 | Farina Electric Inc | electrician | (407) 538-2473 | B |
| 10 | 1st Electricians | electrician | (407) 470-1559 | B |
| 11 | Orlando HVAC Air Conditioning | hvac | (689) 698-5010 | B |
| 12 | Orlando HVAC Services | hvac | (321) 326-9050 | B |
| 13 | Premier Orlando HVAC Contractor Crew | hvac | (407) 495-3515 | B |
| 14 | Orlando Air Conditioning | hvac | (239) 539-7986 | B |
| 15 | Orlando Heating And Air Conditioning | hvac | (407) 391-7342 | B |
| 16 | AC Tropical Contractor LLC | hvac | (321) 221-0404 | B |
| 17 | Nations Landscaping LLC | landscaping | (407) 222-4646 | B |
| 18 | Imperial AC Repair Orlando | hvac | (689) 263-9764 | B |
| 19 | City Beautiful Painter | painting | (407) 255-5365 | B |
| 20 | Orlando Residential & Commercial Painters | painting | (407) 777-4010 | B |
| 21 | Orlando Handyman Services / ProHandymanNow | handyman | (407) 346-5405 | B |
| 22 | R&S Handyman Services LLC | handyman | (407) 591-9301 | B |
| 23 | Rescue Automotive | auto_repair | (407) 658-9040 | B |
| 24 | Black Sheep Automotive LLC | auto_repair | (321) 262-4317 | B |
| 25 | Pat's Mobile Auto Repair LLC | auto_repair | (561) 504-5452 | B |
| 26 | Family D Auto Repair | auto_repair | (407) 418-1221 | B |
| 27 | Discount Auto Center & Mufflers Shop | auto_repair | (407) 425-8401 | B |
| 28 | Gibney's Auto Repair Inc | auto_repair | (407) 426-9489 | B |
| 29 | ORLANDO'S MECHANIC | auto_repair | (407) 535-0448 | B |
| 30 | AUTO SERVICE M&M (TIRE SHOP) | auto_repair | (407) 300-1552 | B |
| 31 | Rincon's Auto Shop | auto_repair | (407) 569-5653 | B |
| 32 | High Superior Mobile Care LLC | auto_repair | (515) 422-1206 | B |
| 33 | Evolution Deep Clean | cleaning | (407) 476-8525 | B |
| 34 | 695 Carpet Cleaner Inc | cleaning | (407) 556-5295 | B |
| 35 | Orlando sidewalk & Driveway Inc | pressure_washing | (321) 315-5287 | B |
| 36 | JUNGLE TREE & DEBRIS Outdoor Services | tree_service | (321) 331-3912 | B |
| 37 | Proklean Pressure Washing LLC | pressure_washing | (407) 520-2943 | B |
| 38 | Garage Doctor Of Orlando Inc | garage_door | (407) 796-2349 | B |
| 39 | Lake Nona Garage Door Repair | garage_door | (407) 734-0336 | B |
| 40 | Winter Park GarageDoor Repair | garage_door | (321) 316-3061 | B |
| 41 | Pine Hills Garage Door Repair & Roofing Now | garage_door | (407) 634-3917 | B |
| 42 | NICK GARAGE DOOR REPLACEMENT & SERVICES LLC | garage_door | (941) 777-3618 | B |
| 43 | Mi Dr Phillips Garage Door Repair | garage_door | (407) 974-5700 | B |
| 44 | Infinite Garage Door's Co | garage_door | (407) 459-8562 | B |
| 45 | VortexFix Garage Door's CO | garage_door | (321) 415-8734 | B |
| 46 | Osceola Sewer and Drain Cleaning | plumbing | (407) 325-7883 | B |
| 47 | Best Plumbing Services Orlando FL | plumbing | (689) 262-4314 | B |
| 48 | Chaviano Handyman LLC | handyman | (407) 686-6325 | B |
| 49 | Jim Secretan Plumbing | plumbing | (407) 240-8338 | B |
| 50 | Grace Services and Contracting LLC | electrician | (407) 419-1605 | B |
| 51 | SUMATIME ELECTRIC LLC | electrician | (407) 488-4750 | B |
| 52 | Kissimmee Heating & Cooling | hvac | (407) 565-3933 | B |
| 53 | Jojoto grill | restaurant | (407) 758-6742 | A |
| 54 | Titi Jessica's New Yorican Restaurant | restaurant | (407) 676-3526 | A |
| 55 | Mu Restaurant | bar | (407) 483-8778 | A |
| 56 | Southern Breeze | bar | (407) 397-4004 | A |
| 57 | Miguelo's Ultra Lounge | bar | (689) 296-1208 | A |
| 58 | The Hen & Hog Winter Park FL | restaurant | (407) 637-2863 | A |

*3 businesses had no phone number on record and are excluded from this batch.*

---

## Expected Outcomes

| Metric | Minimum | Target | Strong |
|--------|---------|--------|--------|
| Message delivery | 50/58 | 55/58 | 58/58 |
| Reply rate | 5% (3 replies) | 10% (6 replies) | 20%+ |
| Paid conversions | 1 ($149) | 3–5 | 8+ |
| Time to first reply | 24–48 hrs | Day 1 | Same hour |

**Even 2% conversion = 1 paying customer = first $1.**

---

## Key Files Reference

| Resource | Location |
|----------|---------|
| Business + phone data | `locasite/docs/locosite-enriched-emails.csv` |
| Email outreach package | `locasite/docs/BOARD-OUTREACH-PACKAGE.md` |
| Email templates | `docs/locasite/outreach-email-sequence-google-maps.md` |
| YAMM send sheet | `locasite/docs/outreach/yamm-send-sheet.csv` |

---

*Questions? Comment on MAV-728.*
