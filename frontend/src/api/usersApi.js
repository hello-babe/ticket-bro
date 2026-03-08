import client from "./client";

const usersApi = {
  // ── Get current user profile ────────────────────────────────────────────────
  getMe: () => client.get("/v1/users/me"),

  // ── Update current user profile ────────────────────────────────────────────
  updateMe: (data) => client.patch("/v1/users/me", data),

  // ── Upload avatar ──────────────────────────────────────────────────────────
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append("avatar", file);

    return client.post("/v1/users/me/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // ── Remove avatar ──────────────────────────────────────────────────────────
  removeAvatar: () => client.delete("/v1/users/me/avatar"),

  // ── Deactivate account ─────────────────────────────────────────────────────
  deactivateMe: () => client.delete("/v1/users/me"),
};

export default usersApi;
