# Locasite Follow-Up Email Sequence — Emails 2 & 3
## Two variants: Restaurants/Bars AND Home Services

*Follow-up to Email 1 (The Reveal), sent when no reply or claim after initial send.*
*Tone: casual, human, no pressure — like a real person checking in, not a drip sequence.*
*Format: plain text only (no HTML). Short. Never pushy.*

---

## VARIANT A — RESTAURANTS / BARS

---

### Email 2 (Day 4) — Casual Check-In

**Subject line options (A/B/C):**
- A: `Quick follow-up on your website` ← **recommended**
- B: `Still here if you want it`
- C: `[Restaurant Name] — site still unclaimed`

**Preview text:** Figured you might've missed it.

---

**Body:**

Hi [First name],

Just wanted to make sure my last email didn't get buried — I built a site for [Restaurant Name] and it's still live and unclaimed: [CLAIM_LINK]

A few restaurants in [City] have claimed theirs this week, and they're already showing up when people search for places to eat nearby.

If you want it, it's yours — 60 seconds to claim.

— [Sender first name]

---

### Email 3 (Day 10) — Breakup Email

**Subject line options (A/B/C):**
- A: `Last one, I promise` ← **recommended**
- B: `Closing out [Restaurant Name]'s site`
- C: `One last note`

**Preview text:** No hard feelings either way.

---

**Body:**

Hi [First name],

This is the last email from me — I don't want to crowd your inbox.

If you ever want to see the site we built for [Restaurant Name], it's at [CLAIM_LINK]. No expiry, no pressure.

Good luck with everything.

— [Sender first name]

---

---

## VARIANT B — HOME SERVICES (Plumbers, HVAC, Landscapers, Electricians)

---

### Email 2 (Day 4) — Casual Check-In

**Subject line options (A/B/C):**
- A: `Quick follow-up on your website` ← **recommended**
- B: `Still here if you want it`
- C: `[Business Name] — site still available`

**Preview text:** Figured you might've missed it.

---

**Body:**

Hi [First name],

Just checking in — I sent over a site preview for [Business Name] a few days ago and wanted to make sure it didn't get lost: [CLAIM_LINK]

Contractors in [City] who've claimed theirs are already getting found when homeowners search for someone to call.

Takes 60 seconds. It's already built.

— [Sender first name]

---

### Email 3 (Day 10) — Breakup Email

**Subject line options (A/B/C):**
- A: `Last one, I promise` ← **recommended**
- B: `Closing out [Business Name]'s site`
- C: `One last note`

**Preview text:** No hard feelings either way.

---

**Body:**

Hi [First name],

Last email from me — promise.

If the timing ever makes sense, the site for [Business Name] is still there: [CLAIM_LINK]. Happy to answer any questions whenever.

Good luck with the season.

— [Sender first name]

---

---

## Implementation Notes

### Cadence (updated)
- Day 1: Email 1 — The Reveal (already sent to 17 businesses per MAV-700)
- Day 4: Email 2 — Casual Check-In (if no reply/claim)
- Day 10: Email 3 — Breakup email (if no reply/claim)
- Day 11+: No further contact

### Tone reminders
- These are the shortest emails in the sequence — do not add more sentences
- Email 3 should feel like a real person closing a loop, not a sales email
- No P.S. lines on Email 3 — the brevity *is* the message
- Plain text only; no HTML, no tracking pixels on these follow-ups
- Sign off with a real first name (same sender as Email 1)

### Personalization variables
- `[First name]` — owner first name
- `[Restaurant Name]` / `[Business Name]` — exact business name from Google Maps
- `[City]` — scraped from listing
- `[CLAIM_LINK]` — unique claim URL for this business

### Social proof note
Email 2 references others claiming their site in [City]. At launch, use this framing only if at least 1–2 claims have actually occurred in that city. If no claims yet, swap "A few restaurants in [City] have claimed theirs this week" for "We're live in [City] now" — keep the first-mover angle without fabricating numbers.

### Reference
Original Email 1 sequence: `docs/locasite/outreach-email-sequence-google-maps.md`
