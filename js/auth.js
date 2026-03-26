const KEY = "ft_user";

export function setUser(user) {
  localStorage.setItem(KEY, JSON.stringify(user));
}

export function getUser() {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearUser() {
  localStorage.removeItem(KEY);
}

export function isAuthenticated() {
  return !!getUser();
}

export function hasRole(role) {
  const u = getUser();
  return u?.role === role;
}
