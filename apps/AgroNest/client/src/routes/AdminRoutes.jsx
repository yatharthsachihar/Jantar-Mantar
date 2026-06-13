import { Routes, Route } from "react-router-dom";

import AdminLayout from "../admin/layouts/AdminLayout";

import DashboardPage from "../admin/pages/Dashboard/DashboardPage";
import AnalyticsPage from "../admin/pages/Analytics/AnalyticsPage";

import ProductsPage from "../admin/pages/Products/ProductsPage";
import CategoriesPage from "../admin/pages/Categories/CategoriesPage";

import OrdersPage from "../admin/pages/Orders/OrdersPage";
import CustomersPage from "../admin/pages/Customers/CustomersPage";
import CouponsPage from "../admin/pages/Coupons/CouponsPage";

import EnquiriesPage from "../admin/pages/Enquiries/EnquiriesPage";

import BannersPage from "../admin/pages/Banners/BannersPage";
import BlogsPage from "../admin/pages/Blogs/BlogsPage";
import PagesPage from "../admin/pages/Pages/PagesPage";

import MediaLibraryPage from "../admin/pages/MediaLibrary/MediaLibraryPage";

import ThemeBuilderPage from "../admin/pages/ThemeBuilder/ThemeBuilderPage";
import HomepageBuilderPage from "../admin/pages/HomepageBuilder/HomepageBuilderPage";
import WebsiteBuilderPage from "../admin/pages/WebsiteBuilder/WebsiteBuilderPage";
import HeaderBuilderPage from "../admin/pages/HeaderBuilder/HeaderBuilderPage";
import FooterBuilderPage from "../admin/pages/FooterBuilder/FooterBuilderPage";

import SEOPage from "../admin/pages/SEO/SEOPage";

import UsersPage from "../admin/pages/Users/UsersPage";
import RolesPage from "../admin/pages/Roles/RolesPage";

import ActivityLogsPage from "../admin/pages/Logs/ActivityLogsPage";

import ProductCreatePage from "../admin/pages/Products/ProductCreatePage";
import ProductEditPage from "../admin/pages/Products/ProductEditPage";
import SettingsPage from "../admin/pages/Settings/SettingsPage";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />

        <Route path="analytics" element={<AnalyticsPage />} />

        <Route path="products" element={<ProductsPage />} />
        <Route path="products/create" element={<ProductCreatePage />} />
        <Route path="products/edit/:id" element={<ProductEditPage />} />
        <Route path="categories" element={<CategoriesPage />} />

        <Route path="orders" element={<OrdersPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="coupons" element={<CouponsPage />} />

        <Route path="enquiries" element={<EnquiriesPage />} />

        <Route path="banners" element={<BannersPage />} />
        <Route path="blogs" element={<BlogsPage />} />
        <Route path="pages" element={<PagesPage />} />

        <Route path="media-library" element={<MediaLibraryPage />} />

        <Route path="theme-builder" element={<ThemeBuilderPage />} />
        <Route path="homepage-builder" element={<HomepageBuilderPage />} />
        <Route path="website-builder" element={<WebsiteBuilderPage />} />
        <Route path="header-builder" element={<HeaderBuilderPage />} />
        <Route path="footer-builder" element={<FooterBuilderPage />} />

        <Route path="seo" element={<SEOPage />} />

        <Route path="users" element={<UsersPage />} />
        <Route path="roles" element={<RolesPage />} />

        <Route path="logs" element={<ActivityLogsPage />} />

        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}