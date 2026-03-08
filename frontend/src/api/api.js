// frontend/src/services/api.js
//
// Single shared axios instance for the entire app.
// Renamed from authApi.js — logic unchanged.
//
// All services import this:
//   import api from '@/services/api';

import axios from "axios";
import { storageUtils } from "@/utils/storageUtils";
import authConfig from "@/config/auth.config";

const api = axios.create({
  baseURL: authConfig.apiBaseUrl,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  timeout: 15_000,
});

// ── Request interceptor ───────────────────────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = storageUtils.getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Response interceptor — silent token rotation ──────────────────────────────
let isRefreshing = false;
let waitQueue = [];

const flushQueue = (err, token = null) => {
  waitQueue.forEach(({ resolve, reject }) =>
    err ? reject(err) : resolve(token),
  );
  waitQueue = [];
};

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const original = error.config;

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    if (original.url?.includes("/auth/refresh-token")) {
      storageUtils.clearAll();
      window.location.href = authConfig.routes.login;
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) =>
        waitQueue.push({ resolve, reject }),
      ).then((token) => {
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      });
    }

    original._retry = true;
    isRefreshing = true;

    const rt = storageUtils.getRefreshToken();
    if (!rt) {
      storageUtils.clearAll();
      window.location.href = authConfig.routes.login;
      return Promise.reject(error);
    }

    try {
      const res = await axios.post(
        `${authConfig.apiBaseUrl}/auth/refresh-token`,
        { refreshToken: rt },
        { withCredentials: true },
      );

      const { accessToken, refreshToken } = res.data.data;
      storageUtils.setTokens({ accessToken, refreshToken });
      api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

      flushQueue(null, accessToken);
      original.headers.Authorization = `Bearer ${accessToken}`;
      return api(original);
    } catch (refreshError) {
      flushQueue(refreshError, null);
      storageUtils.clearAll();
      window.location.href = authConfig.routes.login;
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
