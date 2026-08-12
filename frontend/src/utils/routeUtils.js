/**
 * routeUtils.js — Helper utility for resolving route paths dynamically
 * based on the logged-in user's role (admin, vendor, buyer).
 */

export function getRoleRoute(targetPath) {
  let userRole = 'buyer';
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user && user.role) {
        userRole = user.role.toLowerCase();
      }
    }
  } catch (err) {
    // Default to buyer if parsing fails
  }

  // Strip leading slash or existing role prefix if present
  let cleanPath = targetPath || '';
  cleanPath = cleanPath.replace(/^\//, '');
  cleanPath = cleanPath.replace(/^(buyer|vendor|admin)\//, '');

  return `/${userRole}/${cleanPath}`;
}
