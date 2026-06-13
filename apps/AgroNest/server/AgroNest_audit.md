# AgroNest — Project Audit & Memory File
> Last updated: after fixing server startup crash (login broken)

---

## Project Structure
- **Frontend**: `apps/AgroNest/client` — React + Vite, port 5173
- **Backend**: `apps/AgroNest/server` — Node.js + Express + MongoDB, port 5001
- **Admin panel**: `/admin/*` routes inside the same React app
- **Admin login**: `/admin/login` → `pages/AdminLogin.jsx`
- **Admin credentials** (seeded): `admin@agronest.in` / `admin123`

---

## Architecture Decisions
- `ThemeContext` sets `data-theme` on `<html>` — dark by default
- `SettingsContext` fetches `/api/settings` on mount — drives homepage sections, hero text, mode
- `CartContext` — localStorage-persisted cart
- `useAuthStore` (Zustand) — JWT stored in `localStorage` as `agronest_token`
- Admin auth uses `Admin` model + `authMiddleware.js`
- Site user auth uses `User` model + `userAuthMiddleware.js`
- `AdminLayout` redirects to `/admin/login` if no token
- `index.js` uses `mount()` helper — one bad route file won't crash the server

---

## Database Models
| Model     | File                  | Notes                                      |
|-----------|-----------------------|--------------------------------------------|
| Admin     | models/Admin.js       | bcrypt + matchPassword method              |
| User      | models/User.js        | bcrypt + matchPassword + toPublic method   |
| Product   | models/Product.js     | isFeatured, isB2B, isB2C flags etc         |
| Category  | models/Category.js    | displayOrder, icon, image, slug            |
| Order     | models/Order.js       | items[], status, paymentMethod             |
| Enquiry   | models/Enquiry.js     | type, status, product ref                  |
| Banner    | models/Banner.js      | isActive, displayOrder, ctaText, link      |
| Blog      | models/Blog.js        | status draft/published/scheduled           |
| Page      | models/Page.js        | slug, content, status                      |
| Coupon    | models/Coupon.js      | type percentage/fixed, usageLimit          |
| Media     | models/Media.js       | folder, url, mimeType                      |
| Settings  | models/Settings.js    | Everything — hero, theme, social, smtp etc |

---

## Server Routes
| Path              | File                        | Auth          |
|-------------------|-----------------------------|---------------|
| POST /api/auth/login | routes/auth.js           | Public        |
| GET  /api/auth/me    | routes/auth.js           | Admin JWT     |
| /api/users           | routes/userRoutes.js     | Mixed         |
| /api/products        | routes/Products.js       | Mixed (softAuth) |
| /api/categories      | routes/categories.js     | Mixed         |
| /api/orders          | routes/orders.js         | Mixed         |
| /api/enquiries       | routes/enquiries.js      | Mixed         |
| /api/coupons         | routes/couponRoutes.js   | Admin JWT     |
| /api/banners         | routes/banners.js        | Mixed         |
| /api/blogs           | routes/blogRoutes.js     | Mixed         |
| /api/pages           | routes/pageRoutes.js     | Mixed         |
| /api/media           | routes/mediaRoutes.js    | Public upload |
| /api/seo             | routes/seoRoutes.js      | Admin JWT     |
| /api/settings        | routes/settingsRoutes.js | GET public, PUT admin |

---

## Middleware
| File                        | Purpose                                  |
|-----------------------------|------------------------------------------|
| middleware/authMiddleware.js     | Admin JWT protect — sets req.admin   |
| middleware/userAuthMiddleware.js | Site user JWT protect — sets req.user|
| middleware/uploadMiddleware.js   | Multer config for media uploads      |

---

## Frontend Pages (Site)
| Route              | Component                               | Status  |
|--------------------|-----------------------------------------|---------|
| /                  | pages/Home/HomePage.jsx                 | ✅ Done |
| /products          | pages/Products/ProductsPage.jsx         | ✅ Done |
| /products/:slug    | pages/Product/ProductDetailPage.jsx     | ✅ Done |
| /categories        | pages/Categories/CategoriesPage.jsx     | ✅ Done |
| /cart              | pages/Cart/CartPage.jsx                 | ✅ Done |
| /checkout          | pages/Checkout/CheckoutPage.jsx         | ✅ Done |
| /contact           | pages/Contact/ContactPage.jsx           | ✅ Done |
| /blog, /about etc  | Stub pages                              | 🔲 Stub |

---

## Frontend — Admin Panel Pages
| Route                      | Component                              | Status       |
|----------------------------|----------------------------------------|--------------|
| /admin                     | Dashboard                              | ✅ Done      |
| /admin/products            | Products CRUD table                    | ✅ Done      |
| /admin/products/create     | ProductCreatePage                      | ✅ Done      |
| /admin/products/edit/:id   | ProductEditPage                        | ✅ Done      |
| /admin/categories          | CategoriesPage (card grid)             | ✅ Done      |
| /admin/orders              | OrdersPage (table + status update)     | ✅ Done      |
| /admin/enquiries           | Stub                                   | 🔲 Stub      |
| /admin/coupons             | Stub                                   | 🔲 Stub      |
| /admin/customers           | Stub                                   | 🔲 Stub      |
| /admin/banners             | Stub                                   | 🔲 Stub      |
| /admin/blogs               | Stub                                   | 🔲 Stub      |
| /admin/pages               | Stub                                   | 🔲 Stub      |
| /admin/website-builder     | WebsiteBuilderPage (4 tabs)            | ✅ Done      |
| /admin/header-builder      | Stub                                   | 🔲 Next task |
| /admin/footer-builder      | Stub                                   | 🔲 Next task |
| /admin/homepage-builder    | Stub                                   | 🔲 Stub      |
| /admin/theme-builder       | Stub                                   | 🔲 Stub      |
| /admin/seo                 | Stub                                   | 🔲 Stub      |
| /admin/analytics           | Stub                                   | 🔲 Stub      |
| /admin/media               | Stub                                   | 🔲 Stub      |
| /admin/settings            | Stub                                   | 🔲 Stub      |

---

## Key Components
| Component                                        | Notes                                    |
|--------------------------------------------------|------------------------------------------|
| components/navigation/Navbar.jsx                 | Mode switch (B2B/B2C), dark toggle, cart |
| components/navigation/Footer.jsx                 | Unknown state — not yet audited          |
| components/homepage/HeroSection.jsx              | CSS-only slider, pulls banners from API  |
| components/homepage/HomeSections.jsx             | All sections, demo fallback data         |
| components/product/ProductCard.jsx               | Mode-aware B2B/B2C CTAs                  |
| components/category/CategoryCard.jsx             | Image card with shimmer hover            |
| admin/components/navigation/Sidebar.jsx          | Collapsible, data-sidebar on body        |
| admin/components/navigation/Topbar.jsx           | Logout → /admin/login                    |
| admin/components/forms/ProductForm.jsx           | Full fields: category, images, SEO, flags|
| admin/components/common/* (Button, Input, etc.)  | All exist and working                    |

---

## CSS Architecture
| File                              | Scope            |
|-----------------------------------|------------------|
| src/styles/site.css               | All site pages — CSS vars, buttons, inputs |
| src/admin/styles/admin.css        | Admin layout shell + imports all admin CSS |
| src/admin/styles/theme.css        | Admin CSS vars (dark/light)               |
| src/admin/styles/sidebar.css      | Sidebar styles                            |
| src/admin/styles/topbar.css       | Topbar styles                             |
| src/admin/styles/dashboard.css    | Dashboard grid + widgets                  |
| src/admin/styles/cards.css        | Stat cards                                |
| src/admin/styles/tables.css       | Admin tables, badges, pagination          |
| src/admin/styles/forms.css        | Form groups, inputs, buttons, switches    |
| src/admin/styles/modal.css        | Modals, confirm dialog, skeleton          |

---

## Context Providers (main.jsx order)
1. ThemeProvider — dark by default, sets data-theme on html
2. SettingsProvider — fetches /api/settings, exposes activeMode, switchMode, showPrice etc
3. CartProvider — localStorage cart

---

## Known Issues Fixed
- ✅ Server crash on startup — `userAuthMiddleware.js` was missing, `userRoutes.js` failed to load
- ✅ index.js now uses safe `mount()` wrapper — one bad route won't kill the server
- ✅ Admin login 401 — was caused by server not starting at all
- ✅ Duplicate trust section on homepage — removed TrustSection from HomePage.jsx
- ✅ Admin sidebar collapse — fixed using body[data-sidebar] attribute
- ✅ ProductsPage GSAP crash — removed GSAP, pure CSS animations now
- ✅ Import name collision (CategoriesPage) — aliased all admin imports with Admin prefix

---

## Pending / Next Tasks
- 🔲 HeaderBuilder admin page
- 🔲 FooterBuilder admin page
- 🔲 Enquiries full CRM module
- 🔲 Coupons full module
- 🔲 Blogs CMS full module
- 🔲 Media Library full module
- 🔲 Settings admin page (full)
- 🔲 About, Contact, Blog frontend pages
- 🔲 Seed data — run `node seed.js` to populate DB
- 🔲 README with setup instructions

---

## Run Commands
```bash
# Backend
cd apps/AgroNest/server
npm run dev          # nodemon index.js on port 5001

# Seed database
node seed.js         # Creates admin@agronest.in / admin123 + 12 products + 6 categories + 3 banners

# Frontend
cd apps/AgroNest/client
npm run dev          # Vite on port 5173
```

---

## Environment Variables (server/.env)
```
PORT=5001
MONGO_URI=mongodb://localhost:27017/agronest
JWT_SECRET=agronest_super_secret_key_2024
```
