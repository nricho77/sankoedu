import { ROLES } from "./config.js";

let currentUser = null;

export function setUser(user) {
  currentUser = user;
}

export function getUser() {
  return currentUser;
}

export function hasRole(role) {
  return currentUser?.role === role;
}
``
