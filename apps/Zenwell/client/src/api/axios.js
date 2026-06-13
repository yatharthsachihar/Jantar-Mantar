import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

// MOCK DATA (until backend is ready)
const mockProducts = [
  { _id: '1', name: 'Lavender Oil', price: 299, image: 'https://m.media-amazon.com/images/I/5127pwc1zBL._SY300_SX300_QL70_FMwebp_.jpg', category: 'Oils', shortDesc: 'Relaxation oil', fullDesc: 'Pure lavender essential oil', quantity: 50 },
  { _id: '2', name: 'Salt Scrub', price: 499, image: 'https://brooklynbotany.com/cdn/shop/files/10oz-BB-Scrubs-EBC---Himalayan-Salt-Shopify-4_2.jpg?crop=center&height=1200&v=1767807203&width=1200', category: 'Skincare', shortDesc: 'Exfoliating scrub', fullDesc: 'Himalayan salt blend', quantity: 30 },
  { _id: '3', name: 'Ashwagandha', price: 599, image: 'https://thumbs.dreamstime.com/b/amber-glass-bottle-ashwagandha-plant-label-surrounded-green-leaves-roots-wooden-surface-dark-amber-437908767.jpg', category: 'Supplements', shortDesc: 'Stress relief', fullDesc: 'Organic ashwagandha capsules', quantity: 45 }
];

const mockEnquiries = [
  { _id: '1', name: 'John', phone: '9876543210', email: 'john@test.com', product: 'Lavender Oil', message: 'Interested', status: 'New', createdAt: new Date() }
];

export const getProducts = async () => {
  try {
    return await API.get('/products');
  } catch (err) {
    console.log('Using mock data');
    return Promise.resolve({ data: mockProducts });
  }
};

export const getProduct = async (id) => {
  try {
    return await API.get(`/products/${id}`);
  } catch (err) {
    console.log('Using mock data for single product');
    return Promise.resolve({ data: mockProducts.find(p => p._id === id) });
  }
};

export const reduceStock = (id, qty) => API.patch(`/products/${id}/reduce-stock`, { qty });

export const submitEnquiry = (data) => {
  mockEnquiries.push({ ...data, _id: Date.now().toString(), status: 'New', createdAt: new Date() });
  return Promise.resolve({ data });
};

export const getEnquiries = () => Promise.resolve({ data: mockEnquiries });

export const updateEnquiryStatus = (id, status) => {
  const e = mockEnquiries.find(x => x._id === id);
  if (e) e.status = status;
  return Promise.resolve({ data: e });
};

export default API;