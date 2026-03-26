
// ========================================
// db.js — Couche d’accès aux données
// ========================================

import { api } from "/js/api.js";

class DB {

  // -------------------------------------------------------
  // ORGANISATION
  // -------------------------------------------------------
  getOrg() {
    return api.get("/config/org");
  }

  // -------------------------------------------------------
  // USERS
  // -------------------------------------------------------
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

  // -------------------------------------------------------
  // SITES
  // -------------------------------------------------------
  listSites() {
    return api.get("/sites");
  }

  createSite(data) {
    return api.post("/sites", data);
  }

  updateSite(id, data) {
    return api.put(`/sites/${id}`, data);
  }

  // -------------------------------------------------------
  // PERIODS
  // -------------------------------------------------------
  listPeriods() {
    return api.get("/periods");
  }

  createPeriod(data) {
    return api.post("/periods", data);
  }

  updatePeriod(id, data) {
    return api.put(`/periods/${id}`, data);
  }

  // -------------------------------------------------------
  // ENTRIES
  // -------------------------------------------------------
  getEntries(periodId, siteId) {
    return api.get(`/entries?period=${periodId}&site=${siteId}`);
  }

  getEntry(id) {
    return api.get(`/entries/${id}`);
  }

  saveDraft(id, data) {
    return api.put(`/entries/${id}`, data);
  }

  submitEntry(id) {
    return api.post(`/entries/${id}/submit`);
  }

  cancelSubmit(id) {
    return api.post(`/entries/${id}/cancelSubmit`);
  }

  approveEntry(id, banqueGest) {
    return api.post(`/entries/${id}/approve`, { banqueGest });
  }

  refuseEntry(id, comment) {
    return api.post(`/entries/${id}/refuse`, { comment });
  }

  // -------------------------------------------------------
  // SUMMARIES / EXPORTS
  // -------------------------------------------------------
  summaryEmployee(periodId, userId) {
    return api.get(`/admin/summary/employee?period=${periodId}&user=${userId}`);
  }

  summarySite(periodId, siteId) {
    return api.get(`/admin/summary/site?period=${periodId}&site=${siteId}`);
  }

  summaryPeriod(periodId) {
    return api.get(`/admin/summary/period?period=${periodId}`);
  }

  summaryAll(periodId) {
    return api.get(`/admin/summary/all?period=${periodId}`);
  }

  exportCSV(periodId) {
    return api.get(`/admin/export?period=${periodId}`);
  }
}

export const DBApp = new DB();
