import axios from "axios";

const API_BASE_URL = "https://dummyjson.com";
const FAKE_STORE_API_BASE_URL = "https://fakestoreapi.com";

// fetchFakeStoreProducts asks Fake Store API for 12 products.
export async function fetchFakeStoreProducts() {
  try {
    const response = await axios.get(`${FAKE_STORE_API_BASE_URL}/products?limit=12`);
    return response.data;
  } catch (error) {
    throw new Error("Unable to load Fake Store products. Please try again later.");
  }
}

// fetchFakeStoreProductById asks Fake Store API for one product using its id.
export async function fetchFakeStoreProductById(id) {
  try {
    const response = await axios.get(`${FAKE_STORE_API_BASE_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    throw new Error("Unable to load this Fake Store product. Please try again later.");
  }
}

// fetchProducts asks DummyJSON for product data and returns only the products array.
export async function fetchProducts() {
  try {
    const response = await axios.get(`${API_BASE_URL}/products?limit=12`);
    return response.data.products;
  } catch (error) {
    throw new Error("Unable to load products. Please try again later.");
  }
}

// fetchProductById asks DummyJSON for one product using its id.
export async function fetchProductById(id) {
  try {
    const response = await axios.get(`${API_BASE_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    throw new Error("Unable to load this product. Please try again later.");
  }
}
