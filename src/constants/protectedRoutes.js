export const PROTECTED_ROUTES = {
  AUTH_REQUIRED: [
    '/',
    '/profile',
    '/settings',
    '/my-courses',
    '/course/:id',
    '/payment',
    '/checkout'
  ],
  
  ADMIN_ONLY: [
    '/admin',
    '/admin/dashboard',
    '/admin/users',
    '/admin/courses',
    '/admin/settings'
  ],
  
  GUEST_ONLY: [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password'
  ]
};

export const isAuthRequired = (path) => {
  return PROTECTED_ROUTES.AUTH_REQUIRED.some(route => {
    const routePattern = route.replace(/:[^/]+/g, '[^/]+');
    const regex = new RegExp(`^${routePattern}$`);
    return regex.test(path);
  });
};

export const isAdminOnly = (path) => {
  return PROTECTED_ROUTES.ADMIN_ONLY.some(route => {
    const routePattern = route.replace(/:[^/]+/g, '[^/]+');
    const regex = new RegExp(`^${routePattern}$`);
    return regex.test(path);
  });
};

export const isGuestOnly = (path) => {
  return PROTECTED_ROUTES.GUEST_ONLY.some(route => {
    const routePattern = route.replace(/:[^/]+/g, '[^/]+');
    const regex = new RegExp(`^${routePattern}$`);
    return regex.test(path);
  });
}; 