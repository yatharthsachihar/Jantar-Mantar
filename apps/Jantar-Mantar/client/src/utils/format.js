export const inr = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

// Percent off, derived from compareAtPrice when an explicit discount isn't set.
export const discountPct = (price, compareAtPrice, explicit) => {
  if (explicit) return Math.round(explicit);
  if (compareAtPrice && compareAtPrice > price) {
    return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
  }
  return 0;
};

// Lowest price across variations (or base price) for "from ₹X" displays.
export const startingPrice = (product) => {
  if (product.hasVariations && product.variations?.length) {
    return Math.min(...product.variations.map((v) => v.price));
  }
  return product.price;
};
