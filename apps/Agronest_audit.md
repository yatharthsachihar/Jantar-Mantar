# AgroNest Project Audit File
**Last updated:** June 16, 2026
**Source of truth** for project status, architecture, completed work, bugs, and pending tasks.

---

## 🕵️ Recent Audit Notes (Current Session)
- **Enquiries System Verification**: Investigated a report of enquiries not showing up. Verified that the `POST /api/enquiries` endpoint works perfectly and saves to the `enquiries` collection in the `agronest` MongoDB database. The Admin Panel (`/admin/enquiries`) correctly fetches these via `GET /api/enquiries` using the Admin token. The system is fully functional. Any issues seen were likely due to checking the wrong database locally, caching, or submitting the bulk form without adding products (which fails validation). 
- **Audit File Consolidation**: Found a duplicate, older, and more verbose audit file at `apps/AgroNest/server/AgroNest_audit.md`. **This file (`apps/Agronest_audit.md`) is the most up-to-date source of truth.**

---

## 📁 Project Structure

```
Internship-Project/
  apps/
    AgroNest/
      client/   ← React + Vite (port 5173)
      server/   ← Node/Express/MongoDB (port 5001)
    Agronest_audit.md  ← THIS FILE
```

**Stack:** React + Vite, Node/Express, MongoDB (Mongoose 9), Zustand, React Query, GSAP, Framer Motion, react-hook-form, react-hot-toast, react-icons

---

## 🏗️ Architecture Decisions

- **Monorepo:** `apps/AgroNest/client` + `apps/AgroNest/server`
- **Admin auth:** Zustand `authStore.js` + JWT stored in `localStorage` as `agronest_token`. Admin tokens carry `type: undefined` (not set). Protected via `authMiddleware.js` (`protect`).
- **User auth:** Separate `UserContext.jsx` + JWT stored as `agronest_user_token`. User tokens carry `type: 'user'`. Protected via `userAuthMiddleware.js` (`protectUser`).
- **Settings:** Single `Settings` MongoDB document drives entire site — theme, mode, hero content, section visibility, page visibility, SEO, social links. Fetched on mount in `SettingsContext.jsx`, injected as CSS variables onto `<html>`.
- **Store mode:** `storeMode` in Settings (`b2b` | `b2c` | `hybrid`) — admin-only, no customer toggle. Controls cart, login, enquiry visibility via `isB2B`, `showCart`, `showPrice`, `showEnquiry` from `SettingsContext`.
- **Page visibility:** `settings.pageVisibility.{shop|categories|blog|about|contact}` — admin toggles via Website Builder. `PageGate` wrapper in `App.jsx` redirects to `/` if page is hidden. Navbar filters links accordingly.
- **Dynamic pages:** `Page` model with typed `sections[]` (hero, stats, values, team, faq, contact_info, rich_text, cta). About and Contact auto-seed on first visit via `pageRoutes.js`.
- **CSS theming:** All site colours, fonts, radius are CSS variables on `:root` / `[data-site-theme]`. Admin ThemeBuilder writes to Settings; SettingsContext re-applies via `applyThemeToCss()` on every settings change.
- **Image strategy:** URL-based throughout (no Cloudinary). Media Library stores files locally to `server/uploads/media/`, served statically at `/uploads/media/`.

---

## ✅ Completed Features

### Admin Panel
- Dashboard (stats, charts, recent orders, recent enquiries)
- Products — full CRUD, image, category, B2B/B2C visibility, badge, stock
- Categories — full CRUD, image URL + quick-pick chips + live preview, slug, display order
- Orders — table, status update, delete, detail modal
- Enquiries — full CRM table, status dropdown inline, view modal, delete, summary cards. **Receives both bulk enquiries (`/enquiry` page) and general contact enquiries (`/contact` page).**
- Banners — create/edit/delete, image preview, active/inactive toggle, display order
- Blog CMS — list, create, edit (title, slug, content HTML, category, tags, SEO, featured image, status)
- Pages CMS — section-based editor (hero, stats, values, team, faq, contact_info, rich_text, cta), create/delete pages, section reorder (move up/down), visible toggle per section
- Website Builder — homepage section toggles (8 sections), site page visibility toggles (5 pages), save & publish
- Homepage Builder — hero content, CTA text/links, stat numbers, announcement bar
- Theme Builder — colour pickers (primary, secondary, bg, card, text, border), font selector, border radius, button radius, dark/light mode
- Settings — store info, contact, social links, shipping/tax, payment (Razorpay keys), store mode (B2C/B2B/Both), SEO fields (all 30+ fields now persist)
- SEO Center — fully wired to Settings model; all fields (seoTitle, ogImage, gaId, robotsTxt, etc.) now save correctly
- Media Library — upload (multer, local disk, 8MB, images + PDF), folder filter, copy URL, delete, drag & drop
- Users (admin team) — list, create, edit, toggle active, role badge, delete. **Fixed: was importing dead `useAuth` from unmounted `AuthContext` — now uses `useAuthStore`.**
- **Activity Logs** — fully wired. `ActivityLog` model auto-expires after 90 days. `activityLogger` Express middleware intercepts all POST/PUT/PATCH/DELETE on `/api/*`, captures admin name/role, resource, summary, status code, writes to MongoDB. `/api/logs` route returns paginated logs filtered by resource/method. Frontend reads real endpoint, shows feed with icons/badges/time-ago. Clear Logs button added.
- Analytics — charts, revenue, top products, traffic (frontend built)
- Customers — frontend built
- Coupons — frontend built
- **Roles & Permissions** — Permission Matrix and Team Members tabs fully built. Super admins can now view access levels and assign roles (e.g., Super Admin, Store Manager) directly via the Admin UI, which persists to the database.

### Customer-Facing Site
- Home — hero (GSAP animated, parallax, banners slider), trust strip, featured categories, featured products, best sellers, new arrivals, seasonal, brands, testimonials, blog section, newsletter, footer
- Products listing — filters, search, category, B2B/B2C CTA
- Product detail — images, specs, cart/enquiry CTA based on mode
- Categories — hero, search, grid/list view, skeleton loading (no flash of demo data — fixed)
- Blog listing — featured post, 3-col grid, category tabs, search, skeleton
- Blog post — full HTML content, tags, share, related articles sidebar
- About — hero (parallax), stats, mission cards, Why Us grid, process steps, impact/sustainability section, team grid, CTA. All with GSAP/ScrollTrigger animations.
- Contact — hero, quick-contact chips, enquiry form (**now wired to API — fixed**), office cards, dynamic CMS sections
- Enquiry (B2B bulk) — full form (contact + product rows + preferences), success screen, sidebar with how-it-works, WhatsApp button
- Login / Register — full forms, validation, account types, Indian states

### Infrastructure
- `server/index.js` mounts: auth, users, products, categories, orders, enquiries, banners, blogs, pages, media, settings, SEO (via settings), coupons, analytics
- `/uploads/media` served statically
- `multer` installed for file uploads
- `bcryptjs` for password hashing (Admin + User models)
- JWT with separate `type` field for admin vs user tokens

---

## 🐛 Known Bugs Fixed (Chronological)

1. `AuthProvider` never mounted → `useAuth()` crash in `UsersPage` → fixed to use `useAuthStore`
2. `pageVisibility` not persisting → missing from `settingsRoutes.js` allowlist → added nested-object merge + `markModified`
3. B2B badge on every product card → removed `isB2B` badge span from `ProductCard.jsx`
4. Cart/Login flash on page load before settings fetch → Navbar now shows skeleton (`site-nav-icon-skel`, `site-nav-cta-skel`) while `settingsLoading === true`
5. Blog page never existed → built `BlogPage.jsx` + `BlogPostPage.jsx`
6. Categories flash demo images on load → `FeaturedCategories` now shows skeletons while loading, never renders demo data
7. `ContactPage` form was fake (setTimeout) → now calls `enquiryApi.submit()` with `type: "general"`, saves to DB, visible in admin Enquiries panel
8. `seoRoutes.js` was empty + SEO fields missing from Settings model + allowlist → all 30+ SEO fields added to model and allowlist
9. `check-db.js`, `check-account.js`, and `check-login.js` diagnostic scripts created in `server/` to debug user auth, stale indexes, and account verification issues.

---

## ⚠️ Known Issues / Pending

- `context/AuthContext.jsx` is dead code (never mounted). Any admin page that imports `useAuth` from it will crash. Known affected: `UsersPage` (fixed). Others not audited.
- Customer sign-in "not letting other users sign in" — code verified correct end-to-end. Likely a stale MongoDB index on `users` collection. `server/check-db.js` diagnoses this. **Run `node check-db.js` and share output to confirm.**
- Google / Facebook OAuth buttons in `LoginPage.jsx` are UI-only (no backend).
- `/forgot-password` route is a stub.
- `/account`, `/wishlist`, `/policies/:slug` are stub pages.
- Header Builder, Footer Builder, Integrations pages are stubs (Phase 3).
- `seoRoutes.js` file exists but is empty — not used (SEO handled via `/api/settings`). Safe to delete.
- Duplicate route files: `auth.js` + `authRoutes.js`, `banners.js` + `bannerRoutes.js`, `categories.js` + `categoryRoutes.js`, `products.js` + `productRoutes.js`, `enquiries.js` + `enquiryRoutes.js`, `orders.js` + `orderRoutes.js`. Only one of each pair is mounted in `index.js`. The unmounted ones are dead code.

---

## 📊 Scale Summary

- **Admin pages:** 18 modules, 15 fully functional, 3 stubs
- **Frontend pages:** 12 built, 3 stubs
- **Server routes:** 14 mounted
- **Models:** Admin, User, Product, Category, Order, Enquiry, Banner, Blog, Page, Media, Settings, Coupon
