import { create } from 'zustand';
import API from '../../api/axios';

export const useDashboardStore = create((set) => ({
  stats: null,
  revenueChart: [],
  ordersChart: [],
  recentOrders: [],
  topProducts: [],
  loading: false,

  fetchDashboard: async () => {
    set({ loading: true });
    try {
      const [ordersRes, productsRes] = await Promise.all([
        API.get('/orders'),
        API.get('/products'),
      ]);

      const orders = ordersRes.data || [];
      const productsData = productsRes.data;
      const products = Array.isArray(productsData) ? productsData : (productsData.products || []);
      const totalProductsCount = productsData.total || products.length;

      const totalRevenue = orders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, o) => sum + o.totalAmount, 0);

      const monthlyRevenue = {};
      orders.forEach(o => {
        const month = new Date(o.createdAt).toLocaleString('default', { month: 'short' });
        monthlyRevenue[month] = (monthlyRevenue[month] || 0) + o.totalAmount;
      });

      const revenueChart = Object.entries(monthlyRevenue).map(([month, revenue]) => ({
        month, revenue,
      }));

      const statusCounts = {};
      orders.forEach(o => {
        statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
      });
      const ordersChart = Object.entries(statusCounts).map(([status, count]) => ({
        status, count,
      }));

      set({
        stats: {
          totalRevenue,
          totalOrders: orders.length,
          totalProducts: totalProductsCount,
          pendingOrders: orders.filter(o => o.status === 'pending').length,
        },
        revenueChart,
        ordersChart,
        recentOrders: orders.slice(0, 6),
        topProducts: products.slice(0, 5),
        loading: false,
      });
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      set({ loading: false });
    }
  },
}));
