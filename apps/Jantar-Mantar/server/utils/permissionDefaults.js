// Default RBAC matrix. Each module maps a role to a permission level.
// 'full' grants write; 'view' is read-only; 'none' blocks entirely.
const MODULES = [
  { label: 'Products',         key: 'products',   permissions: { super_admin: 'full', admin: 'full', editor: 'full', support: 'view', viewer: 'view' } },
  { label: 'Categories',       key: 'categories', permissions: { super_admin: 'full', admin: 'full', editor: 'full', support: 'view', viewer: 'view' } },
  { label: 'Banners',          key: 'banners',    permissions: { super_admin: 'full', admin: 'full', editor: 'full', support: 'view', viewer: 'view' } },
  { label: 'Orders',           key: 'orders',     permissions: { super_admin: 'full', admin: 'full', editor: 'view', support: 'full', viewer: 'view' } },
  { label: 'Media',            key: 'media',      permissions: { super_admin: 'full', admin: 'full', editor: 'full', support: 'view', viewer: 'view' } },
  { label: 'Settings',         key: 'settings',   permissions: { super_admin: 'full', admin: 'full', editor: 'view', support: 'none', viewer: 'view' } },
  { label: 'Users & Roles',    key: 'users',      permissions: { super_admin: 'full', admin: 'view', editor: 'none', support: 'none', viewer: 'none' } },
];

module.exports = { MODULES };
