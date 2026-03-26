import { api } from "/js/api.js";

class DB {

  getOrg() {
    return api.get("/config/org");
  }

  listUsers() {
    return api.get("/users");
  }

  createUser(data) {
    return api.post("/users", data);
  }

  updateUser(id, data) {
    return api.put(`/users/${id}`, data);
  }

  disableUser(id) {
    return api.post(`/users/${id}/disable`);
  }

  resetPassword(id) {
    return api.post(`/users/${id}/resetPassword`);
  }

  // etc...
}

export const DBApp = new DB();
