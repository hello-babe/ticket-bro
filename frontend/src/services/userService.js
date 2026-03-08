// frontend/src/services/userService.js

import api from "@/api/api";

const userService = {
  // ── Current user ─────────────────────────────────────────────────────────
  getMe: () => api.get("/users/me"),
  updateMe: (data) => api.patch("/users/me", data),
  deleteMe: () => api.delete("/users/me"),

  // ── Avatar ────────────────────────────────────────────────────────────────
  uploadAvatar: (file) => {
    const form = new FormData();
    form.append("avatar", file);
    return api.post("/users/me/avatar", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  removeAvatar: () => api.delete("/users/me/avatar"),

  // ── Sessions ──────────────────────────────────────────────────────────────
  getSessions: () => api.get("/users/me/sessions"),
  revokeSession: (id) => api.delete(`/users/me/sessions/${id}`),

  // ── Admin ─────────────────────────────────────────────────────────────────
  getAllUsers: (params) => api.get("/users", { params }),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUserById: (id, data) => api.patch(`/users/${id}`, data),
  deleteUserById: (id) => api.delete(`/users/${id}`),
  activateUser: (id) => api.patch(`/users/${id}/activate`),
  deactivateUser: (id) => api.patch(`/users/${id}/deactivate`),
  changeUserRole: (id, role) => api.patch(`/users/${id}/role`, { role }),
  getUserStats: () => api.get("/users/stats"),
};

export default userService;
