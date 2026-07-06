# Premium Features — Implementation & QA Checklist

> **Companion to:** [`Premium_Ecommerce_Implementation_Roadmap.md`](../Premium_Ecommerce_Implementation_Roadmap.md)  
> **Purpose:** What was built per roadmap task, where to find it, and step-by-step manual tests.  
> **Update rule:** When a task is marked ✅ in the roadmap, add or extend its section here before moving to the next task.

**Prerequisites (most tests):**

- Backend API running (`make run` in luxe-backend)
- Frontend dev server (`pnpm dev` in luxe-front)
- Demo catalog seeded (`make seed-dev`) for product-heavy flows
- Voice tests (Task 051): Chrome or Edge, microphone allowed

**Test ID format:** `TC-{task}-{nn}` — e.g. `TC-051-01`

---

## Status overview

| Task | Name | Status | Primary URL |
|------|------|--------|-------------|
| 001 | AI Shopping Assistant | ✅ | Site-wide FAB |
| 002 | Intent-Based Search | ✅ | `/search` |
| 003 | Visual Search | ✅ | `/search` |
| 004 | AI Product Summary | ✅ | `/product/[slug]` |
| 005 | Smart Product Comparison | ✅ | `/compare` |
| 006 | Shop the Look | ✅ | `/shop-the-look` |
| 007 | Lifestyle Collections | ✅ | `/lifestyle` |
| 008 | Smart Bundles | ✅ | `/product/[slug]`, `/cart` |
| 009 | Personalized Homepage | ✅ | `/` (signed in) |
| 051 | AI Voice Shopping Assistant | ✅ | `/search` + assistant sheet + `/voice-shopping` |
| 047 | Voice Shopping (flagship page) | ✅ | `/voice-shopping` |
| 010 | AI Gift Finder | ✅ | `/gift-finder` |

---

## Task 001 — AI Shopping Assistant ✅

### Features implemented

- Site-wide floating **“Shop with AI”** FAB (hidden on `/checkout`)
- Side/bottom sheet with conversational chat UI
- Quick prompts (gift, home, trending)
- AI follow-up questions as tappable chips
- Product recommendation cards with links to PDP
- Multi-turn context via `POST /api/v1/ai/shopping-assistant`

### Where to test

- Any storefront page except checkout
- API: `POST /ai/shopping-assistant`

### Test cases

| ID | Steps | Expected result |
|----|-------|-----------------|
| TC-001-01 | Open homepage. Find FAB bottom corner (sparkles / “Shop with AI”). Click it. | Assistant sheet opens with welcome message and quick prompts. |
| TC-001-02 | Tap quick prompt **“Gift ideas under $100”**. | User message sent; assistant replies; product cards may appear. |
| TC-001-03 | Type: *“minimalist desk lamp for a small apartment”* → Send. | AI reply + optional follow-up questions + recommendations. |
| TC-001-04 | Click a recommendation card. | Navigates to product PDP. |
| TC-001-05 | Go to `/checkout`. | FAB is **not** visible. |

---

## Task 002 — Intent-Based Search ✅

### Features implemented

- Natural-language queries parsed into structured search (category, price, etc.)
- Keyword search unchanged as fallback
- **AI understood your search** banner on results when intent was parsed
- Desktop hero, mobile search sheet, ⌘/Ctrl+K shortcut

### Where to test

- `/search`
- API: `POST /ai/search-intent`, `GET /search`

### Test cases

| ID | Steps | Expected result |
|----|-------|-----------------|
| TC-002-01 | On `/search`, type `watch` → Search. | Standard keyword results; no intent banner required. |
| TC-002-02 | Type: *“waterproof hiking jacket under $250”* → Search. | Results load; **intent banner** may show interpreted query/filters. |
| TC-002-03 | Apply a category filter, then search again with keywords only. | Filters + search still work together. |
| TC-002-04 | Press ⌘K (Mac) or Ctrl+K (Windows). | Search input focused or mobile search sheet opens. |

---

## Task 003 — Visual Search ✅

### Features implemented

- Upload or drag product photo from search UI
- AI analyzes image → search results with visual match banner
- Camera icon on desktop search hero and mobile search sheet

### Where to test

- `/search` → camera icon
- API: `POST /ai/visual-search`

### Test cases

| ID | Steps | Expected result |
|----|-------|-----------------|
| TC-003-01 | On `/search`, click **camera** icon. | Visual search dialog opens. |
| TC-003-02 | Upload a product photo (JPG/PNG, &lt; 5 MB). Click find similar. | Redirect to search results; **visual search banner** on results. |
| TC-003-03 | Upload oversized or invalid file. | Inline error message; no crash. |
| TC-003-04 | Dismiss visual banner on results. | Banner closes; results remain. |

---

## Task 004 — AI Product Summary ✅

### Features implemented

- **“AI brief”** button on PDP (pros, cons, ideal buyer, alternatives)
- Sheet UI with loading and error states

### Where to test

- `/product/[slug]` (any product)
- API: `POST /ai/product-brief`

### Test cases

| ID | Steps | Expected result |
|----|-------|-----------------|
| TC-004-01 | Open any PDP. Find **AI brief** button (sparkles) in buy box. Click. | Sheet opens; brief loads or shows loading skeleton. |
| TC-004-02 | When loaded, read sections. | Pros, cons, ideal buyer, alternatives present (when API returns them). |
| TC-004-03 | Close sheet and reopen. | Brief can be fetched again without page reload. |

---

## Task 005 — Smart Product Comparison ✅

### Features implemented

- Compare up to 4 products at `/compare`
- Add from PDP compare icon; user menu link
- AI insight when 2+ products compared

### Where to test

- `/compare` (sign in if required)
- PDP → compare icon
- API: `GET/PUT /compare`, `POST /ai/compare-insight`

### Test cases

| ID | Steps | Expected result |
|----|-------|-----------------|
| TC-005-01 | On PDP, click **compare** (arrows icon). | Product added; toast or navigation to compare. |
| TC-005-02 | Add 2+ products → open `/compare`. | Side-by-side table with specs. |
| TC-005-03 | With ≥2 products, scroll to AI insight section. | AI comparison summary loads. |
| TC-005-04 | Remove a product from compare. | Table updates; insight may refresh. |

---

## Task 006 — Shop the Look ✅

### Features implemented

- Gallery at `/shop-the-look`
- Detail pages with **shoppable hotspots** on lifestyle images
- Homepage carousel section

### Where to test

- `/`, `/shop-the-look`, `/shop-the-look/[slug]`
- API: `GET /shop-looks`, `GET /shop-looks/{slug}`

### Test cases

| ID | Steps | Expected result |
|----|-------|-----------------|
| TC-006-01 | Homepage → **Shop the Look** section → View all. | `/shop-the-look` gallery loads. |
| TC-006-02 | Open a look detail page. | Large image with tappable hotspots. |
| TC-006-03 | Tap a hotspot. | Product preview/link; shoppable product grid below. |
| TC-006-04 | Click product from look. | Navigates to PDP. |

---

## Task 007 — Lifestyle Collections ✅

### Features implemented

- Curated collections (Minimal Workspace, Travel Essentials, etc.)
- Listing page + homepage carousel

### Where to test

- `/lifestyle`, `/` homepage section
- API: `GET /collections?theme=lifestyle`

### Test cases

| ID | Steps | Expected result |
|----|-------|-----------------|
| TC-007-01 | Homepage → **Lifestyle collections** → View all. | `/lifestyle` page with collection cards. |
| TC-007-02 | Click a collection card. | Navigates to shop/collection destination. |
| TC-007-03 | Switch locale (en / fa / es). | Collection titles/descriptions localized where available. |

---

## Task 008 — Smart Bundles ✅

### Features implemented

- PDP **Smart Bundles** section with intent chips (everyday, workspace, travel, gift)
- Cart page bundle upsells based on cart contents

### Where to test

- `/product/[slug]`, `/cart`
- API: `GET /products/{id}/smart-bundles`, `POST /bundles/suggest`

### Test cases

| ID | Steps | Expected result |
|----|-------|-----------------|
| TC-008-01 | Open PDP → scroll to **Smart Bundles**. | Bundle cards load for default intent. |
| TC-008-02 | Tap intent chip (e.g. **Gift**). | Bundles refresh for that intent. |
| TC-008-03 | Add items to cart → `/cart`. | Smart bundle suggestions section appears when cart has products. |
| TC-008-04 | Add bundle to cart from suggestion. | Cart count updates. |

---

## Task 009 — Personalized Homepage ✅

### Features implemented

- **Recommended for you** rail (signed-in users)
- **Recently viewed** rail
- **Favorite categories** with auth-aware API
- PDP view tracking (`POST /products/{id}/view`)

### Where to test

- `/` while **signed in**
- Browse PDPs while logged in, then return home
- API: `GET /home/recommended`, `GET /home/recently-viewed`, `GET /home/categories`, `POST /products/{id}/view`

### Test cases

| ID | Steps | Expected result |
|----|-------|-----------------|
| TC-009-01 | Sign in → open `/`. | **Recommended for you** section visible at top. |
| TC-009-02 | Visit 2–3 PDPs while signed in → return home. | **Recently viewed** rail shows those products. |
| TC-009-03 | Sign out → `/`. | Personalized rails hidden (guest homepage). |
| TC-009-04 | Signed in → scroll **Favorite categories**. | Categories load (personalized when API supports it). |

---

## Task 051 — AI Voice Shopping Assistant ✅

### Features implemented

- Browser **Web Speech API** (client STT — no new backend STT service)
- **VoiceAiChatComposer** in shopping assistant sheet: mic, waveform, live transcript, text refinement, Space hold-to-talk
- **Search page mic** → voice-to-text **into the search field** (waveform in box; does **not** open AI assistant)
- Tap = push-to-talk; hold ~350ms = hold-to-talk
- Locales: `en-US`, `es-ES`, `fa-IR`
- Analytics: `luxe:voice-assistant` window events
- Reuses Task 001 AI backend for recommendations

### Where to test

- `/search` (mic icon in hero — desktop & mobile)
- Shopping assistant sheet (same as Task 001)
- API: `POST /ai/shopping-assistant` (after send)

### Test cases

| ID | Steps | Expected result |
|----|-------|-----------------|
| TC-051-01 | `/search` desktop → mic in search bar. Click. | Waveform in search icon area; “Listening…” hint; speech fills **search input** (not assistant). |
| TC-051-02 | `/search` mobile → **mic button** beside compact search bar. Tap. | Search sheet opens; mic auto-starts; transcript in sheet input. |
| TC-051-03 | Allow mic → say *“comfortable running shoes under $150”* → stop → Send. | Transcript in text field; AI reply + optional product cards. |
| TC-051-04 | Speak partial request, then **type** more in same field → Send. | Combined voice + text in one message works. |
| TC-051-05 | Open via **FAB** (not search mic). | Sheet opens; mic does **not** auto-start; manual mic still works. |
| TC-051-06 | Tap mic → speak → tap mic again (push-to-talk). | Listening toggles; final text appended to field. |
| TC-051-07 | Press & hold mic ~0.5s, speak, release. | Hold-to-talk: stops on release; transcript appended. |
| TC-051-08 | Block microphone in browser → tap mic. | Permission error message; **typing still works**. |
| TC-051-09 | Firefox or unsupported browser. | “Voice not supported” message; textarea + send still work. |
| TC-051-10 | Switch locale to FA or ES → use voice UI. | Strings translated; speech lang matches locale. |
| TC-051-11 | `/search` → keyword search `watch` (no voice). | Normal results — voice did not break text search. |

**Optional (dev):** Listen for analytics:

```js
window.addEventListener('luxe:voice-assistant', (e) => console.log(e.detail));
```

Expect `voice_started`, `voice_completed`, or error events.

---

## Task 047 — Voice Shopping (flagship page) ✅

### Features implemented

- Dedicated **`/voice-shopping`** page — voice-first full-screen AI shopping conversation
- Reuses `POST /ai/shopping-assistant` (same as Tasks 001 & 051)
- **VoiceAiChatComposer** with auto-start when opened via `?listen=1`
- Entry from `/search` hero CTA → `/voice-shopping?listen=1`
- Shared chat hook + bubble components with assistant sheet

### Where to test

- `/voice-shopping`
- `/search` → “Try full voice shopping” link
- API: `POST /ai/shopping-assistant`

### Test cases

| ID | Steps | Expected result |
|----|-------|-----------------|
| TC-047-01 | Open `/voice-shopping`. | Voice shopping hero, welcome message, mic composer at bottom. |
| TC-047-02 | Open `/voice-shopping?listen=1` in Chrome. | Mic auto-starts (if supported); “Listening…” status. |
| TC-047-03 | Speak a request → Send. | AI reply + optional product recommendation cards. |
| TC-047-04 | `/search` → click voice shopping CTA. | Navigates to `/voice-shopping?listen=1`. |
| TC-047-05 | Hold **Space** (focus not in textarea) → speak → release. | Hold-to-talk captures speech into composer field. |
| TC-047-06 | Block mic → type message → Send. | Text-only flow still works. |

---

## Task 010 — AI Gift Finder ✅

### Features implemented

- Guided wizard at `/gift-finder`: recipient → occasion → budget → interests/style
- Optional AI follow-up step when more context is needed
- Results: AI reply, gift card message ideas, product picks with gift-specific reasons
- Entry: shopping assistant quick prompt **“Gift ideas under $100”** → navigates to gift finder
- API: `POST /api/v1/ai/gift-finder`
- i18n: `giftFinder.*` in en / fa / es

### Where to test

- `/gift-finder`
- Shopping assistant FAB → gift quick prompt chip

### Test cases

| ID | Steps | Expected result |
|----|-------|-----------------|
| TC-010-01 | Open `/gift-finder`. | Page shows title, progress bar, step 1 (recipient). |
| TC-010-02 | Select **Friend** → Continue → **Birthday** → Continue → budget **$50–$100** → Continue. | Wizard advances through steps; Back works. |
| TC-010-03 | On interests: pick style **Minimalist**, type *“loves jewelry”* → **Find gifts**. | Loading state; results step with AI message + product cards (if catalog matches). |
| TC-010-04 | On results, check **Card message ideas** (if shown). | 1–2 short gift note suggestions. |
| TC-010-05 | Click a product card. | Navigates to PDP. |
| TC-010-06 | Click **Start over**. | Wizard resets to step 1. |
| TC-010-07 | Open assistant FAB → tap **Gift ideas under $100** chip. | Assistant closes; `/gift-finder` opens. |
| TC-010-08 | Switch locale to FA or ES. | Wizard labels and options translated. |

---

## Phase 1 — 5-minute smoke (after Task 010)

Run in order after any Phase 1 change:

1. **TC-051-01** — Search mic fills search box (inline voice)  
2. **TC-010-01** — Gift finder wizard loads  
3. **TC-010-03** — Complete gift wizard → results  
4. **TC-002-01** — Keyword search still works  
5. **TC-001-01** — FAB assistant still works  

---

## Adding a new task to this doc

When completing roadmap Task `NNN`:

1. Mark ✅ in `Premium_Ecommerce_Implementation_Roadmap.md`.
2. Add a section: **Features implemented** → **Where to test** → **Test cases** table.
3. Add row to **Status overview** table at top.
4. Extend **smoke** checklist if the task is user-critical.

---

## Key source files (by domain)

| Task | Domain path |
|------|-------------|
| 001, 051 | `src/domains/shopping-assistant/` |
| 047 | `src/domains/voice-shopping/`, `src/components/ai/voice-ai-chat-composer.tsx` |
| 002, 003 | `src/domains/search/` |
| 004 | `src/domains/product/` |
| 005 | `src/domains/compare/` |
| 006 | `src/domains/shop-the-look/` |
| 007 | `src/domains/lifestyle-collections/` |
| 008 | `src/domains/smart-bundles/` |
| 009 | `src/domains/home/` |
| 010 | `src/domains/gift-finder/` |
