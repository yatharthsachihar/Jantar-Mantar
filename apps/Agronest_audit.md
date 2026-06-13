# 🌿 Project Audit — AgroNest Workspace Context

> **Workspace Root:** `c:\Users\yatha\OneDrive\Desktop\Task1 oi\Internship-Project`
> **Last Updated:** June 13, 2026 (Enquiries Admin Module & Contact Page)

---

## 📁 Monorepo Overview

```
Internship-Project/
├── .git/
├── apps/
│   ├── AgroNest/        ← Primary active project (client + server running)
│   ├── Zenwell/         ← Separate project (client + server, has node_modules)
│   └── Test-project/    ← Scaffold / prototype (minimal)
└── docs/                ← Empty (no documentation yet)
```

> [!NOTE]
> There is **no root-level `package.json`** — this is a simple folder-based monorepo, not a managed one (no Turborepo / nx / pnpm workspaces). Each app manages its own dependencies independently.

---

## 🌿 AgroNest — Primary App

### Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 8, React Router v7 |
| State | Zustand 5 + React Context (Auth, Cart, Wishlist, Theme, Settings, User) |
| Data Fetching | TanStack Query v5 |
| Forms | React Hook Form + Zod v4 |
| Animation | Framer Motion + GSAP 3 |
| Rich Text | TipTap v3 |
| Charts | Recharts 3 |
| Tables | TanStack Table v8 |
| Drag & Drop | @dnd-kit/core |
| Styling | Vanilla CSS (custom design system) |
| Toasts | react-hot-toast |
| Icons | react-icons v5 |
| Payment Gateway | Secure payment page with live **Razorpay** client SDK & sandbox simulation models for both **Razorpay** and **PhonePe** |
| Backend | Express 5, Mongoose 9, MongoDB |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| File uploads | Cloudinary (util present) |
| Dev Server | Vite (client, port auto), nodemon (server, port 5001) |

---

### 📂 Client Structure (`apps/AgroNest/client/`)

```
client/
├── index.html
├── vite.config.js
├── package.json
├── eslint.config.js
├── public/
│   ├── favicon.ico / favicon.svg
│   ├── icons.svg
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── images/
│   └── uploads/
└── src/
    ├── main.jsx              ← Entry: wraps app with 5 context providers
    ├── App.jsx               ← Root router (frontend + admin routes combined)
    ├── index.css
    ├── App.css
    │
    ├── api/                  ← 15 Axios API modules
    │   ├── axios.js          ← Base Axios instance
    │   ├── authApi.js
    │   ├── productApi.js
    │   ├── categoryApi.js
    │   ├── orderApi.js
    │   ├── bannerApi.js
    │   ├── blogApi.js
    │   ├── couponApi.js
    │   ├── enquiryApi.js
    │   ├── mediaApi.js
    │   ├── pageApi.js
    │   ├── seoApi.js
    │   ├── settingsApi.js
    │   ├── userApi.js
    │   └── analyticsApi.js
    │
    ├── context/              ← 5 React Contexts
    │   ├── AuthContext.jsx
    │   ├── CartContext.jsx
    │   ├── WishlistContext.jsx
    │   ├── ThemeContext.jsx
    │   └── SettingsContext.jsx
    │
    ├── hooks/                ← 7 custom hooks (site-facing)
    │   ├── useAuth.js
    │   ├── useCart.js
    │   ├── useWishlist.js
    │   ├── useOrders.js
    │   ├── useProducts.js
    │   ├── useSettings.js
    │   └── useDebounce.js
    │
    ├── layouts/              ← 4 layout shells
    │   ├── MainLayout.jsx
    │   ├── AdminLayout.jsx
    │   ├── AuthLayout.jsx
    │   └── ErrorLayout.jsx
    │
    ├── routes/               ← Routing helpers
    │   ├── AppRoutes.jsx
    │   ├── AdminRoutes.jsx
    │   ├── ProtectedRoute.jsx
    │   └── PublicRoute.jsx
    │
    ├── styles/               ← Global CSS design system
    │   ├── variables.css
    │   ├── globals.css
    │   ├── themes.css
    │   ├── typography.css
    │   ├── animations.css
    │   └── site.css          ← (4.6 KB, the main import)
    │
    ├── utils/                ← 6 utility modules
    │   ├── constants.js
    │   ├── formatters.js
    │   ├── helpers.js
    │   ├── permissions.js
    │   ├── slugify.js
    │   └── validators.js
    │
    ├── assets/               ← Static assets
    │
    ├── components/           ← Shared/site-facing components
    │   ├── admin/            → Sidebar.jsx + Sidebar.css
    │   ├── blog/             → BlogCard, BlogGrid, BlogSidebar
    │   ├── category/         → (category-specific components)
    │   ├── common/           → 11 UI primitives (Badge, Button, Drawer, Input, Modal, etc.)
    │   ├── homepage/         → HeroSection, HomeSections, FeaturedProducts, FAQ, Testimonials, etc.
    │   ├── navigation/       → Navbar, Footer, Header, Breadcrumbs, MobileMenu
    │   ├── product/          → ProductCard, ProductGrid, ProductSlider, ProductFilters, ProductDetails
    │   └── seo/              → (SEO meta components)
    │
    ├── pages/                ← Site-facing pages (13 directories + AdminLogin)
    │   ├── Home/             → HomePage.jsx + HomePage.css
    │   ├── Products/         → ProductsPage.jsx + ProductsPage.css (14.5 KB)
    │   ├── Product/          → ProductDetailPage.jsx (13.7 KB) + ProductDetail.jsx (duplicate?)
    │   ├── Categories/       → CategoriesPage.jsx + CategoriesPage.css
    │   ├── Cart/             → CartPage.jsx + CartPage.css
    │   ├── FAQ/              → FAQPage.jsx + FAQPage.css (secure customer enquiry form page linked to enquiries)
    │   ├── Checkout/         → CheckoutPage.jsx + CheckoutPage.css + PaymentPage.jsx + PaymentPage.css (secure payment gateway portal)
    │   ├── Blog/             → BlogPage.jsx (18.4 KB) + BlogPostPage.jsx (17 KB) + Blog.css (21 KB)
    │   ├── About/            → AboutPage.jsx + AboutPage.css
    │   ├── Account/          → LoginPage.jsx (added back button) + RegisterPage.jsx (added back button) + AuthPage.css + ProfilePage.jsx
    │   ├── Contact/          → ContactPage.jsx (16.6 KB) + ContactPage.css
    │   ├── Error/            → (files present, content TBD)
    │   ├── Policies/         → (files present, content TBD)
    │   ├── AdminLogin.jsx    ← Standalone (4.5 KB) — not in its own folder
    │   └── AdminLogin.css
    │
    └── admin/                ← Full admin panel module
        ├── layouts/
        │   └── AdminLayout.jsx   (1.2 KB)
        ├── hooks/                ← 10 admin-specific hooks
        │   ├── useAnalytics.js
        │   ├── useCategories.js
        │   ├── useCustomers.js
        │   ├── useDashboard.js
        │   ├── useMedia.js
        │   ├── useNotifications.js
        │   ├── useOrders.js
        │   ├── useProducts.js
        │   ├── useSettings.js
        │   └── useUsers.js
        ├── services/             ← 12 admin service modules
        ├── store/                ← 6 Zustand stores (auth, dashboard, analytics, etc.)
        ├── styles/               ← 14 admin CSS files
        │   ├── admin.css         (1.2 KB)
        │   ├── forms.css         (6.2 KB)
        │   ├── tables.css        (4.5 KB)
        │   ├── modal.css         (2.6 KB)
        │   ├── sidebar.css       (3.0 KB)
        │   └── ...
        ├── utils/                ← 6 admin utility modules
        ├── components/           ← 10 subcategory groups
        │   ├── builder/          → ColorPicker, FontSelector, HomepageBuilder, ThemeBuilder, etc. (9 files)
        │   ├── cards/            → StatCard, RevenueCard, AnalyticsCard, etc. (7 files)
        │   ├── charts/           → RevenueChart, OrdersChart, VisitorsChart, etc. (6 files)
        │   ├── common/           → 17 admin UI primitives (Button, Input, Modal, Switch, etc.)
        │   ├── editor/           → BlogEditor, PageEditor, RichTextEditor (3 files)
        │   ├── forms/            → 11 form components (ProductForm 9.9 KB, BannerForm, BlogForm, etc.)
        │   ├── media/            → ImageCropper, MediaCard, MediaGrid, MediaSelector, MediaUploader
        │   ├── navigation/       → Sidebar (8.3 KB), Topbar, CommandSearch, NotificationCenter
        │   ├── tables/           → DataTable, ProductsTable, OrdersTable, BlogsTable, etc. (9 files)
        │   └── widgets/          → ActivityFeed, RecentOrders, TopProducts, QuickActions, etc. (7 files)
        └── pages/                ← 23 admin page modules
            ├── Dashboard/        → DashboardPage.jsx (10.7 KB) + DashboardPage.css (17.3 KB)
            ├── Products/         → ProductsPage, ProductCreatePage, ProductEditPage
            ├── Categories/
            ├── Orders/
            ├── Customers/
            ├── Coupons/
            ├── Enquiries/
            ├── Banners/
            ├── Blogs/
            ├── Pages/
            ├── HomepageBuilder/
            ├── WebsiteBuilder/
            ├── ThemeBuilder/
            ├── HeaderBuilder/
            ├── FooterBuilder/
            ├── SEO/
            ├── Analytics/
            ├── MediaLibrary/
            ├── Users/
            ├── Roles/
            ├── Logs/
            ├── Integrations/
            └── Settings/         → SettingsPage.jsx (21.1 KB — largest admin page)
```

---

### 📂 Server Structure (`apps/AgroNest/server/`)

```
server/
├── index.js              ← Entry: Express + route mounting
├── server.js             ← (116 bytes — likely just re-exports index.js)
├── .env                  ← DB URI + secrets
├── seed.js               ← 12.5 KB — large seed file
├── update-categories.js  ← Migration/utility script
├── config/
│   ├── db.js             ← Mongoose connect
│   ├── redis.js          ← Redis config (stub?)
│   └── constants.js
├── models/ (13 Mongoose models)
│   ├── Admin.js, User.js, Product.js, Category.js
│   ├── Order.js          ← Added paymentStatus, transactionId tracking
│   ├── Settings.js       ← Added storeLogoHeight, storeLogoXOffset, PhonePe configs, active flags
│   ├── StoreSettings.js, Coupon.js, Enquiry.js
│   ├── Banner.js, Blog.js, Page.js
│   └── Media.js
├── controllers/ (13 controllers)
│   ├── authController.js, userController.js
│   ├── productController.js, categoryController.js
│   ├── orderController.js, couponController.js
│   ├── enquiryController.js, bannerController.js
│   ├── blogController.js, pageController.js
│   ├── seoController.js, settingsController.js
│   └── mediaController.js
├── routes/ (20 route files — see note below)
│   ├── orders.js         ← Added GET single order, PUT confirm payment routes
│   └── ...
├── middleware/
│   ├── authMiddleware.js  ← JWT verify
│   ├── errorMiddleware.js
│   ├── uploadMiddleware.js
│   └── validationMiddleware.js
├── services/
│   ├── analyticsService.js
│   ├── emailService.js
│   └── paymentService.js
└── utils/
    ├── cloudinary.js
    ├── generateToken.js
    ├── logger.js
    ├── sendEmail.js
    └── validators.js
```

---

## 🏗 Zenwell App (`apps/Zenwell/`)

- **Client**: Vite + React app (has `node_modules`, `package.json` 771 B)
  - Has its own `client/server/` folder *inside* client — unusual structure
  - `src/` exists with content
- **Server**: Express server with MongoDB, seed files for admin + enquiry + products
  - `models/`, `routes/` directories present
  - Its own `.env`

> [!WARNING]
> Zenwell has a `server/` directory **nested inside** `client/` — this may be an accident or a holdover from an early setup. Worth cleaning up.

---

## 🧪 Test-project App (`apps/Test-project/`)

- Very minimal — `client/` has `index.html`, `package.json`, `vite.config.js`, `src/`, `public/`
- `server/` is empty
- Likely a scaffold for quick prototyping

---

## 🔍 Key Findings & Observations

### ✅ Strengths
- **Clean separation of admin vs. site-facing code** — the `src/admin/` module is a self-contained panel
- **Rich component library** — 17 admin primitives + 11 site primitives, good reuse potential
- **Consistent naming conventions** — PascalCase pages, camelCase hooks/utils/services
- **API layer well-structured** — 15 dedicated API files, one axios base instance
- **Custom CSS design system** — `variables.css`, `themes.css`, `typography.css` all present

### ⚠️ Issues / Inconsistencies

| # | Issue | Location |
|---|---|---|
| 1 | **Duplicate route files** in server | `routes/` has both `auth.js` + `authRoutes.js`, `categories.js` + `categoryRoutes.js`, `banners.js` + `bannerRoutes.js`, `enquiries.js` + `enquiryRoutes.js`, `orders.js` + `orderRoutes.js`, `products.js` / `Products.js` + `productRoutes.js` — 10+ route files but only ~6 mounted in `index.js` |
| 2 | **Unmounted routes** | `mediaRoutes.js`, `userRoutes.js`, `seoRoutes.js`, `authRoutes.js`, `categoryRoutes.js`, `productRoutes.js` etc. are defined but NOT mounted in `index.js` |
| 3 | **Duplicate product detail files** | `pages/Product/` has both `ProductDetail.jsx` and `ProductDetailPage.jsx` — likely a refactor leftover |
| 4 | **`AdminLayout` duplication** | Both `src/layouts/AdminLayout.jsx` and `src/admin/layouts/AdminLayout.jsx` exist |
| 5 | **`server.js` stub** | `server/server.js` (116 bytes) alongside `server/index.js` — dead file? |
| 6 | **Empty/skeleton files** | Many files in `admin/pages/*` and `components/*` have 0 bytes (empty stubs) |
| 7 | **`docs/` folder** is completely empty | Root-level docs folder has nothing |
| 8 | **Zenwell's nested `server/` in `client/`** | `apps/Zenwell/client/server/` is a structural anomaly |
| 9 | **No root-level package.json** | Monorepo has no workspace manager — manual `npm install` needed in 3+ places |
| 10 | **Redis config present but unlikely wired** | `config/redis.js` exists but no Redis dependency in `package.json` |

### 📌 Stub Pages (routes exist, components not built)
The following are mapped in `App.jsx` but render a `<StubPage>` placeholder:
- `/account`, `/wishlist`, `/policies/:slug`

### 📌 Empty Admin Pages (folders exist, files are stubs)
Many admin page directories exist but contain skeleton/empty `.jsx` files:
`Banners`, `Blogs`, `Categories`, `FooterBuilder`, `HeaderBuilder`, `HomepageBuilder`, `Integrations`, `MediaLibrary`, `Orders`, `Pages`, `Roles`, `ThemeBuilder`, `Users`

---

## 🚀 Recent Audited Changes

### 1. Customizable Logo Size & Positioning
- Added `storeLogoHeight` and `storeLogoXOffset` settings inputs (range slider + numbers) to Admin Settings page.
- Enabled setting values in MongoDB backend schema and settings API routes.
- Adjusted header/footer logo CSS rendering dynamically based on layout settings.

### 2. Secure Online Checkout Payments (Razorpay & PhonePe)
- Created `/checkout/payment` secure portal and [PaymentPage.jsx](file:///c:/Users/yatha/OneDrive/Desktop/Task1%20oi/Internship-Project/apps/AgroNest/client/src/pages/Checkout/PaymentPage.jsx).
- Integrates live **Razorpay** SDK script loading, and interactive simulated payments for card, UPI ID intents, and scanable PhonePe QR codes.
- Added backend single order getter and confirmation update endpoint `PUT /api/orders/:id/pay`.

### 3. Account Auth Pages Back Link
- Integrated back-to-home navigation links with smooth transition style animations in LoginPage and RegisterPage.

### 4. Navbar User Profile State (User Changes)
- Merged profile dropdown avatar displaying user initials, dropdown containing name/email, and logout trigger.
- Implemented clicks outside handler to auto-close dropdown.
- Configured hide rules when operating in B2B wholesale store mode.

### 5. Website Builder & Homepage Sections Toggle
- Built a fully-featured Website Builder admin page [WebsiteBuilderPage.jsx](file:///c:/Users/yatha/OneDrive/Desktop/Task1%20oi/Internship-Project/apps/AgroNest/client/src/admin/pages/WebsiteBuilder/WebsiteBuilderPage.jsx) and its styles in [WebsiteBuilderPage.css](file:///c:/Users/yatha/OneDrive/Desktop/Task1%20oi/Internship-Project/apps/AgroNest/client/src/admin/pages/WebsiteBuilder/WebsiteBuilderPage.css).
- Created a robust custom editor in the admin panel to control website content (Announcement Bar, Hero settings, stats, custom CTA text), sections toggle, typography and HSL colors, hero sizing and overlay, and store configurations (shipping free tier, taxes, Razorpay configurations, SMTP mail settings).
- Modified [HomePage.jsx](file:///c:/Users/yatha/OneDrive/Desktop/Task1%20oi/Internship-Project/apps/AgroNest/client/src/pages/Home/HomePage.jsx) to dynamically render homepage sections based on the active flags retrieved from user settings context.

### 6. Admin Customer Management & Deactivation Redirects
- Integrated database users to the admin interface by leveraging the `isActive` flag in the Mongoose model [User.js](file:///c:/Users/yatha/OneDrive/Desktop/Task1%20oi/Internship-Project/apps/AgroNest/server/models/User.js).
- Set up soft-deactivation guards in Express auth routes and user middleware [userAuthMiddleware.js](file:///c:/Users/yatha/OneDrive/Desktop/Task1%20oi/Internship-Project/apps/AgroNest/server/middleware/userAuthMiddleware.js) that deny login and request processing to inactive accounts.
- Created user self-deactivate `DELETE /api/users/me` and admin soft-delete endpoints in [userRoutes.js](file:///c:/Users/yatha/OneDrive/Desktop/Task1%20oi/Internship-Project/apps/AgroNest/server/routes/userRoutes.js).
- Updated [userApi.js](file:///c:/Users/yatha/OneDrive/Desktop/Task1%20oi/Internship-Project/apps/AgroNest/client/src/api/userApi.js) and custom hook [useCustomers.js](file:///c:/Users/yatha/OneDrive/Desktop/Task1%20oi/Internship-Project/apps/AgroNest/client/src/admin/hooks/useCustomers.js) to support active toggling and deactivation requests.
- Refactored [CustomersPage.jsx](file:///c:/Users/yatha/OneDrive/Desktop/Task1%20oi/Internship-Project/apps/AgroNest/client/src/admin/pages/Customers/CustomersPage.jsx) and [CustomersPage.css](file:///c:/Users/yatha/OneDrive/Desktop/Task1%20oi/Internship-Project/apps/AgroNest/client/src/admin/pages/Customers/CustomersPage.css) to display Total, Active, and Inactive customer metrics, and toggle reactivation states.
- Implemented a styled "Delete Account" button in the website's [Navbar.jsx](file:///c:/Users/yatha/OneDrive/Desktop/Task1%20oi/Internship-Project/apps/AgroNest/client/src/components/navigation/Navbar.jsx) dropdown/drawer, styled with custom styles in [Navbar.css](file:///c:/Users/yatha/OneDrive/Desktop/Task1%20oi/Internship-Project/apps/AgroNest/client/src/components/navigation/Navbar.css).
- Added a real-time background polling mechanism via a lightweight `GET /api/users/status` endpoint to [userRoutes.js](file:///c:/Users/yatha/OneDrive/Desktop/Task1%20oi/Internship-Project/apps/AgroNest/server/routes/userRoutes.js) and [authApi.js](file:///c:/Users/yatha/OneDrive/Desktop/Task1%20oi/Internship-Project/apps/AgroNest/client/src/api/authApi.js).
- Added an Axios response interceptor in [axios.js](file:///c:/Users/yatha/OneDrive/Desktop/Task1%20oi/Internship-Project/apps/AgroNest/client/src/api/axios.js) that dispatches a custom `auth-error-403` event to the browser rather than forcing a hard page reload.
- Upgraded [UserContext.jsx](file:///c:/Users/yatha/OneDrive/Desktop/Task1%20oi/Internship-Project/apps/AgroNest/client/src/context/UserContext.jsx) to listen to the `auth-error-403` event and interval-poll the user status every 5 seconds. If deactivated, it seamlessly redirects the user to [DeactivatedPage.jsx](file:///c:/Users/yatha/OneDrive/Desktop/Task1%20oi/Internship-Project/apps/AgroNest/client/src/pages/Account/DeactivatedPage.jsx) using React Router's `navigate` to prevent performance drops.

### 7. Real-Time Settings & Global SPA Optimizations
- **Global Routing Re-architecture**: Swapped `BrowserRouter` and `UserProvider` hierarchy inside [App.jsx](file:///c:/Users/yatha/OneDrive/Desktop/Task1%20oi/Internship-Project/apps/AgroNest/client/src/App.jsx) to give Context providers direct access to React Router's `useNavigate()` hooks, eliminating legacy `window.location.href` redirects.
- **Global Settings Polling**: Introduced a 10-second background polling interval inside [SettingsContext.jsx](file:///c:/Users/yatha/OneDrive/Desktop/Task1%20oi/Internship-Project/apps/AgroNest/client/src/context/SettingsContext.jsx). Any changes made by an admin (such as toggling between **B2B** and **Retail** modes, or updating the announcement bar) are now instantly propagated to all active users' Virtual DOMs without requiring page refreshes.
- **Advanced React Optimizations**: Executed a site-wide performance pass using advanced React functions to eliminate unnecessary re-renders.
  - Wrapped heavily utilized components like [ProductCard.jsx](file:///c:/Users/yatha/OneDrive/Desktop/Task1%20oi/Internship-Project/apps/AgroNest/client/src/components/product/ProductCard.jsx) and `StarRating` with `React.memo` to prevent re-renders when parent layouts update.
  - Replaced native `<a href>` tags in [ContactPage.jsx](file:///c:/Users/yatha/OneDrive/Desktop/Task1%20oi/Internship-Project/apps/AgroNest/client/src/pages/Contact/ContactPage.jsx) with React Router `<Link>` components to maintain true SPA routing and avoid full-page HTML document fetches.
  - Refactored [ProductsPage.jsx](file:///c:/Users/yatha/OneDrive/Desktop/Task1%20oi/Internship-Project/apps/AgroNest/client/src/pages/Products/ProductsPage.jsx) to leverage `useMemo` for heavy product filtering, category filtering, search querying, and sorting array operations. They now uniquely compute only when dependencies change.
  - Wrapped standard interactive callbacks (like `handleAddToCart`, `handleEnquire`) with `useCallback` to prevent child component prop thrashing.

---

### 8. Navbar Loading Skeleton (Cart/Login Flicker Fix)
- Fixed flash-of-wrong-mode issue: cart icon, login/account icon, and CTA button now render a pulsing skeleton placeholder (`.site-nav-icon-skel`, `.site-nav-cta-skel`) while `SettingsContext` is fetching (`loading === true`), instead of briefly showing Retail UI before B2B mode is applied (or vice versa).
- Modified [Navbar.jsx](file:///c:/Users/yatha/OneDrive/Desktop/Task1%20oi/Internship-Project/apps/AgroNest/client/src/components/navigation/Navbar.jsx) to destructure `loading: settingsLoading` from `useSettings()` and gate the cart link, login/account block, and CTA button behind it.
- Added skeleton keyframe animation and styles to [Navbar.css](file:///c:/Users/yatha/OneDrive/Desktop/Task1%20oi/Internship-Project/apps/AgroNest/client/src/components/navigation/Navbar.css).

---

### 9. Page-Level Visibility Toggles (Hide/Show Entire Pages)
- Added `pageVisibility` object to [Settings.js](file:///c:/Users/yatha/OneDrive/Desktop/Task1%20oi/Internship-Project/apps/AgroNest/server/models/Settings.js) model with boolean flags: `shop`, `categories`, `blog`, `about`, `contact` (all default `true`).
- Added matching `pageVisibility` defaults to [SettingsContext.jsx](file:///c:/Users/yatha/OneDrive/Desktop/Task1%20oi/Internship-Project/apps/AgroNest/client/src/context/SettingsContext.jsx).
- [Navbar.jsx](file:///c:/Users/yatha/OneDrive/Desktop/Task1%20oi/Internship-Project/apps/AgroNest/client/src/components/navigation/Navbar.jsx): `NAV_LINKS` now carry a `key` matching `pageVisibility`; both desktop and mobile nav filter out links whose page is hidden via `visibleNavLinks`.
- [App.jsx](file:///c:/Users/yatha/OneDrive/Desktop/Task1%20oi/Internship-Project/apps/AgroNest/client/src/App.jsx): added a `PageGate` wrapper component that redirects to `/` if `settings.pageVisibility[pageKey] === false`. Applied to `/products`, `/products/:slug`, `/categories`, `/categories/:slug`, `/blog`, `/blog/:slug`, `/about`, `/contact`. Cart and Checkout are never gated.
- [WebsiteBuilderPage.jsx](file:///c:/Users/yatha/OneDrive/Desktop/Task1%20oi/Internship-Project/apps/AgroNest/client/src/admin/pages/WebsiteBuilder/WebsiteBuilderPage.jsx): added a new "Site Pages" toggle grid (reusing `SectionCard`) below the Homepage Sections grid in the Sections tab, with a live visible-count badge. Each toggle writes to `pageVisibility.<key>` via `setNested`.
- **Bugfix:** [settingsRoutes.js](file:///c:/Users/yatha/OneDrive/Desktop/Task1%20oi/Internship-Project/apps/AgroNest/server/routes/settingsRoutes.js) PUT handler uses an allowlist for top-level fields and explicit handling for nested objects (`socialLinks`, `smtp`); `pageVisibility` was missing from both, so toggles never persisted. Added explicit nested-object merge + `markModified('pageVisibility')` for it, mirroring `socialLinks`/`smtp` handling.

---

### 10. Removed B2B Badge from Product Cards
- [ProductCard.jsx](file:///c:/Users/yatha/OneDrive/Desktop/Task1%20oi/Internship-Project/apps/AgroNest/client/src/components/product/ProductCard.jsx) was rendering a "B2B" badge on every product card whenever `isB2B` was true (i.e. in Wholesale store mode). Removed the badge `<span>` and the now-unused `isB2B` destructure from `useSettings()`.

---

### 11. Coupons Admin Module
- Implemented a complete coupon management interface in [CouponsPage.jsx](file:///c:/Users/yatha/OneDrive/Desktop/Task1%20oi/Internship-Project/apps/AgroNest/client/src/admin/pages/Coupons/CouponsPage.jsx).
- Supported generating random coupon codes with multiple discount types (percentage, flat amount, free shipping).
- Added features for limiting usage (Total limits and Per User limits), setting minimum order constraints, maximum discount caps, and active/expiry states.
- Created interactive overview stat cards for total, active, expired, and total usage metrics.

---

### 12. SEO Center Admin Module
- Implemented a comprehensive SEO settings panel in [SEOPage.jsx](file:///c:/Users/yatha/OneDrive/Desktop/Task1%20oi/Internship-Project/apps/AgroNest/client/src/admin/pages/SEO/SEOPage.jsx).
- Included tabs for General SEO (titles, descriptions, canonical URLs, search console verification codes).
- Added Open Graph (Social) tab for configuring social media sharing attributes (Facebook/WhatsApp and Twitter Cards).
- Implemented Structured Data tab to populate JSON-LD schema (Organization and Local Business).
- Added Sitemap and Robots.txt management, along with inputs for Google Analytics, Google Tag Manager, Facebook Pixel, and Hotjar IDs.

---

### 13. Analytics Dashboard Module
- Built a dynamic KPI metrics dashboard in [AnalyticsPage.jsx](file:///c:/Users/yatha/OneDrive/Desktop/Task1%20oi/Internship-Project/apps/AgroNest/client/src/admin/pages/Analytics/AnalyticsPage.jsx) using Recharts.
- Provided timeframe range selection (7, 30, and 90 days) for live data visualization.
- Implemented a Revenue Trend line chart, Daily Orders bar chart, and Order Status pie chart based on historical order data.
- Added a Top Products widget to track and rank the most frequently purchased items.

---

### 14. Activity Logs Admin Tracker
- Created an admin audit trail view in [ActivityLogsPage.jsx](file:///c:/Users/yatha/OneDrive/Desktop/Task1%20oi/Internship-Project/apps/AgroNest/client/src/admin/pages/Logs/ActivityLogsPage.jsx).
- Added robust filters to search by log content, target resource, and HTTP method.
- Styled log entries with context-specific icons, time-ago formatting, and method status badges (CREATE, UPDATE, DELETE).
- Configured a graceful fallback proxy that reconstructs an audit trail from recent order data if the primary `/logs` endpoint is temporarily unavailable.

---

### 15. Contact Page & Dynamic Sections
- Fully implemented [ContactPage.jsx](file:///c:/Users/yatha/OneDrive/Desktop/Task1%20oi/Internship-Project/apps/AgroNest/client/src/pages/Contact/ContactPage.jsx) featuring dynamic section renderers powered by `pageApi`.
- Added customizable components for Stats, Values, Team, FAQ, Rich Text, and CTA.
- Included an interactive contact form with loading/success states, and dynamic office location display.

---

---

### 16. Enquiries Admin Module
- Implemented a complete enquiries dashboard in [EnquiriesPage.jsx](file:///c:/Users/yatha/OneDrive/Desktop/Task1%20oi/Internship-Project/apps/AgroNest/client/src/admin/pages/Enquiries/EnquiriesPage.jsx).
- Integrated `react-query` to fetch, update, and delete customer enquiries via [enquiryApi.js](file:///c:/Users/yatha/OneDrive/Desktop/Task1%20oi/Internship-Project/apps/AgroNest/client/src/api/enquiryApi.js).
- Added real-time filtering (by search, status, type) and summary metric cards.
- Built a detailed view modal displaying contact info, tags, and message content, allowing quick status changes and deletions.

---

### 17. Additional Admin Modules (Users, Media Library, Integrations, Header/Footer Builders)
- **Users Admin Panel**: Developed [UsersPage.jsx](file:///c:/Users/yatha/OneDrive/Desktop/Task1%20oi/Internship-Project/apps/AgroNest/client/src/admin/pages/Users/UsersPage.jsx) allowing super admins to manage staff accounts, assign roles (`super_admin`, `admin`, `editor`, `support`), and toggle account active status using TanStack Query.
- **Media Library**: Implemented [MediaLibraryPage.jsx](file:///c:/Users/yatha/OneDrive/Desktop/Task1%20oi/Internship-Project/apps/AgroNest/client/src/admin/pages/MediaLibrary/MediaLibraryPage.jsx) to upload and manage static assets and imagery used across the site.
- **Integrations Panel**: Created [IntegrationsPage.jsx](file:///c:/Users/yatha/OneDrive/Desktop/Task1%20oi/Internship-Project/apps/AgroNest/client/src/admin/pages/Integrations/IntegrationsPage.jsx) to manage third-party service connections.
- **Header & Footer Builders**: 
  - Completed [HeaderBuilderPage.jsx](file:///c:/Users/yatha/OneDrive/Desktop/Task1%20oi/Internship-Project/apps/AgroNest/client/src/admin/pages/HeaderBuilder/HeaderBuilderPage.jsx) and [FooterBuilderPage.jsx](file:///c:/Users/yatha/OneDrive/Desktop/Task1%20oi/Internship-Project/apps/AgroNest/client/src/admin/pages/FooterBuilder/FooterBuilderPage.jsx) to allow dynamic reconfiguration of the website's navigation links, footer support/quick links, copyright notices, and social handles.
  - Added new configuration arrays to the `Settings.js` Mongoose schema and `settingsRoutes.js` allowed lists.
  - Linked [Navbar.jsx](file:///c:/Users/yatha/OneDrive/Desktop/Task1%20oi/Internship-Project/apps/AgroNest/client/src/components/navigation/Navbar.jsx) and [Footer.jsx](file:///c:/Users/yatha/OneDrive/Desktop/Task1%20oi/Internship-Project/apps/AgroNest/client/src/components/navigation/Footer.jsx) to consume these dynamic settings, replacing statically hardcoded links.

---

## 🔎 Empty File Audit (June 13, 2026)

Checked every admin page directory listed under "Empty Admin Pages" in the Key Findings section above. Most have since been built (Banners, Blogs, Categories, Orders, Pages, HomepageBuilder, ThemeBuilder, Roles, HeaderBuilder, FooterBuilder, Integrations, MediaLibrary, Users all confirmed fully implemented). **No genuinely empty admin stub pages remain!**

**Server-side gap found:** [SEOPage.jsx](file:///c:/Users/yatha/OneDrive/Desktop/Task1%20oi/Internship-Project/apps/AgroNest/client/src/admin/pages/SEO/SEOPage.jsx) (entry #12) is fully built on the frontend, but `seoRoutes.js` is **not mounted** in [index.js](file:///c:/Users/yatha/OneDrive/Desktop/Task1%20oi/Internship-Project/apps/AgroNest/server/index.js) — SEO settings likely fail to save/load. Similarly `mediaRoutes.js` is unmounted.

**Frontend stub pages** (per existing Stub Pages list, still accurate): `/account`, `/wishlist`, `/policies/:slug`.

**Recommended priority for next session:** (1) mount `seoRoutes.js` so the built SEO admin page actually persists data, (2) mount `mediaRoutes.js` so the Media Library operates fully.

---

## 🛠️ Technical Debt & Known Errors (To Fix Later)

### 1. Insecure Checkout Calculation (Critical)
- The `POST /api/orders` endpoint blindly trusts the `totalAmount` and `discountAmount` sent from the frontend `CheckoutPage.jsx` payload. 
- **Risk**: A malicious user could intercept the request and manipulate the payload to pay ₹0 or forge massive discounts.
- **Fix Required**: The backend must independently fetch the cart products, calculate the true subtotal, validate the `couponCode`, recalculate the `discountAmount`, and determine the final `grandTotal` securely.

### 2. Missing Coupon Usage Tracking
- When an order is placed using a coupon, the `POST /api/orders` endpoint does not increment the `usedCount` on the applied `Coupon` document.
- **Risk**: A single-use coupon or a coupon with a strict `usageLimit` can currently be used infinitely.
- **Fix Required**: Add logic to increment `usedCount` in the coupon document when validating/saving the order.

### 3. Orders UI Missing Coupon Information
- While `couponCode` and `discountAmount` were successfully added to the Mongoose `Order` schema, the frontend UI for viewing orders (e.g., `OrdersPage.jsx` in the Admin panel and `Account/Orders` for users) needs to be updated to actually display this data.

### 4. Architectural Inconsistencies (MVC vs Fat Routes)
- `server/controllers/couponController.js` is a completely empty (0 bytes) file. 
- Instead, the actual business logic and database queries are written directly inside `server/routes/couponRoutes.js`. This breaks the established MVC pattern used in the rest of the application and should be refactored.

### 5. Unmounted Server Routes
- As noted in the empty file audit, `seoRoutes.js` and `mediaRoutes.js` exist but are not mounted in `server/index.js`. Any data saved from the SEO or Media Library admin pages will likely fail to persist until these are mounted.

---

## 📊 Scale Summary

| Category | Count |
|---|---|
| Total apps | 3 (AgroNest active, Zenwell partial, Test-project scaffold) |
| Client dependencies (AgroNest) | 22 production + 8 dev |
| React Context providers | 5 |
| Zustand stores (admin) | 6 |
| Admin pages | 23 |
| Site-facing pages | 15 (8 live + 5 stubs + 2 blog) |
| API modules | 15 |
| Mongoose models | 13 |
| Server controllers | 13 |
| Route files | 20 (many duplicated/unmounted) |
| CSS files (admin only) | 14 |
| Component files (total) | ~100+ |
### 13-06-2026 Updates
- Fixed Settings.js missing fields (Razorpay, PhonePe, SMTP, Cloudinary, WhatsApp) to prevent data loss on page refresh.
- Updated settingsRoutes.js to allow new integration fields.
- Fixed IntegrationsPage.jsx state mapping to match Settings.js schema.
- Fixed SettingsContext.jsx to inject --hero-height and --hero-overlay-opacity CSS variables.
- Updated HeroSection.css to use the new CSS variables, making hero changes from Website Builder reflect on live site.
- Verified AnalyticsPage and ActivityLogsPage are working correctly.
- Verified checkout page coupon visibility conditional logic is properly implemented.
### 13-06-2026 Code Quality & Cleanup
- Removed hardcoded 'http://localhost:5001' fetch requests in CheckoutPage and PaymentPage, switching them to the centralized Axios instance via orderApi.js.
- Updated axios.js to support 'import.meta.env.VITE_API_URL' for seamless production deployments.
- Audited client and server for rogue console.log statements; removed all non-essential debug traces.
- Fixed numerous ESLint warnings including unused imports in CartPage.jsx, ProductDetail.jsx, PaymentPage.jsx, and ProductsPage.jsx.
- Resolved 'set-state-in-effect' React hook warnings in ProductsPage.jsx that were causing cascading re-renders.
- Successfully ran production build of client application to verify no breaking compilation errors.

### 13-06-2026 Phase 3 UI, Database & Access Control Enhancements
- **Admin Access Control:** Verified the backend securely restricts accounts with the 'viewer' role to read-only actions via `authMiddleware.js`. Updated frontend UI (`UsersPage.jsx`) to dynamically hide creation buttons and disable edit actions when the logged-in admin is a viewer, resolving user confusion.
- **Dynamic Footer Configuration:** Added `footerLogoHeight` and `footerLogoXOffset` settings to `FooterBuilderPage.jsx` and updated `Footer.jsx` to consume them, detaching footer logo dimensions from the global navbar logo settings.
- **Premium B2B Product Layout:** Redesigned `ProductDetail.jsx` and `ProductDetail.css`. Re-proportioned the desktop grid layout (40% image / 60% details) and integrated B2B mock metadata (MOQ, Origin, HSN Code). Elevated the aesthetics of the "Add to Cart" and "Buy Now" action block with professional styling, box shadows, and hover transitions.
- **Database Image Seeding:** Executed a backend Node script that populated the live MongoDB database with high-quality, product-relevant photography (tractors, fertilizers, seeds) from Unsplash. All 12 products now have editable database-backed imagery rather than hardcoded fallbacks.
- **About Us Animations:** Integrated GSAP and ScrollTrigger into `AboutPage.jsx`. Added professional micro-animations including staggered fade-ins, scrolling timeline reveals, and mission statement slide-ups to create a modern corporate storytelling experience.

### 13-06-2026 Admin Features & Bug Fixes
- **Admin Orders Deletion:** Created a secure `DELETE /api/orders/:id` backend route. Updated `orderApi.js` and `OrdersPage.jsx` to feature a delete button (with confirmation prompt) to safely discard orders.
- **Product Cart Fix:** Rewired the "Add to Cart" and "Buy Now" buttons in the redesigned `ProductDetail.jsx` page. Imported and connected `useCart`, `useNavigate`, and `react-hot-toast` to ensure items are correctly added to global state and users are redirected to checkout when pressing Buy Now.

### 13-06-2026 About Page — Expanded Content & New Animations
- Added three new sections to the static fallback layout in `AboutPage.jsx`:
  - **"Why 50,000+ Farmers Choose Us"** — 6-card feature grid (`WHY_US`) covering certification, 48hr delivery, agronomist helpline, transparent pricing, returns policy, and quality guarantee.
  - **"From Lab to Land in 4 Steps"** — horizontal process row (`PROCESS_STEPS`: Source → Test → Stock → Deliver) with numbered circles and animated connector lines between steps.
  - **"Sustainability Isn't a Buzzword Here"** — split image/stats impact section (`IMPACT_STATS`) using a new `CountUp` component that animates numbers from 0 on scroll-into-view via GSAP + ScrollTrigger (`once: true`, supports decimals/suffixes).
- New GSAP/ScrollTrigger animations added to the existing `useGSAP` hook:
  - Hero background parallax (`backgroundPositionY` scrub on scroll).
  - Why-Us cards: staggered scale+fade pop-in (`back.out` easing).
  - Process steps: sequential reveal + connector line draw (`scaleX` 0→1, staggered).
  - Impact section: image slides in from left, text staggers from right, stat values pop in with `back.out`.
- `AboutPage.css`: added `.about-whyus-*`, `.about-process-*`, `.about-impact-*` rule blocks with responsive breakpoints (3→2→1 columns). Split the hero's `background` shorthand into longhand `background-image`/`background-size`/`background-position`/`background-repeat` so the new parallax animation on `backgroundPositionY` doesn't conflict with the `center` shorthand value.
