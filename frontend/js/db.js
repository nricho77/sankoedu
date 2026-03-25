
// ========================================
// db.js — Couche d’accès aux données
// ========================================

import { API } from "./api.js";

class DB {

  // -------------------------------------------------------
  // ORGANISATION
  // -------------------------------------------------------
  getOrg() {
    return API.get("/config/org");
  }

  // -------------------------------------------------------
  // USERS
  // -------------------------------------------------------
  listUsers() {
    return API.get("/users");
  }

  createUser(data) {
    return API.post("/users", data);
  }

  updateUser(id, data) {
    return API.put(`/users/${id}`, data);
  }

  disableUser(id) {
    return API.post(`/users/${id}/disable`);
  }

  resetPassword(id) {
    return API.post(`/users/${id}/resetPassword`);
  }

  // -------------------------------------------------------
  // SITES
  // -------------------------------------------------------
  listSites() {
    return API.get("/sites");
  }

  createSite(data) {
    return API.post("/sites", data);
  }

  updateSite(id, data) {
    return API.put(`/sites/${id}`, data);
  }

  // -------------------------------------------------------
  // PERIODS
  // -------------------------------------------------------
  listPeriods() {
    return API.get("/periods");
  }

  createPeriod(data) {
    return API.post("/periods", data);
  }

  updatePeriod(id, data) {
    return API.put(`/periods/${id}`, data);
  }

  // -------------------------------------------------------
  // ENTRIES
  // -------------------------------------------------------
  getEntries(periodId, siteId) {
    return API.get(`/entries?period=${periodId}&site=${siteId}`);
  }

  getEntry(id) {
    return API.get(`/entries/${id}`);
  }

  saveDraft(id, data) {
    return API.put(`/entries/${id}`, data);
  }

  submitEntry(id) {
    return API.post(`/entries/${id}/submit`);
  }

  cancelSubmit(id) {
    return API.post(`/entries/${id}/cancelSubmit`);
  }

  approveEntry(id, banqueGest) {
    return API.post(`/entries/${id}/approve`, { banqueGest });
  }

  refuseEntry(id, comment) {
    return API.post(`/entries/${id}/refuse`, { comment });
  }

  // -------------------------------------------------------
  // SUMMARIES / EXPORTS
  // -------------------------------------------------------
  summaryEmployee(periodId, userId) {
    return API.get(`/admin/summary/employee?period=${periodId}&user=${userId}`);
  }

  summarySite(periodId, siteId) {
    return API.get(`/admin/summary/site?period=${periodId}&site=${siteId}`);
  }

  summaryPeriod(periodId) {
    return API.get(`/admin/summary/period?period=${periodId}`);
  }

  summaryAll(periodId) {
    return API.get(`/admin/summary/all?period=${periodId}`);
  }

  exportCSV(periodId) {
    return API.get(`/admin/export?period=${periodId}`);
  }
}

export const DBApp = new DB();
