// frontend/src/api/authApi.js

import axios from "axios";
import { storageUtils } from "../utils/storageUtils";
import authConfig from "../config/auth.config";

const api = axios.create({
  baseURL: authConfig.apiBaseUrl,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // send httpOnly cookies (refresh token cookie)
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
let waitQueue = []; // promises waiting for a new access token

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

    // Only attempt refresh on 401, and only once per request
    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    // FIX: Don't try to refresh on the refresh-token endpoint itself —
    // that would cause an infinite loop.
    if (original.url?.includes("/auth/refresh-token")) {
      storageUtils.clearAll();
      window.location.href = authConfig.routes.login;
      return Promise.reject(error);
    }

    // Queue concurrent requests that arrive while a refresh is in-flight
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
      // FIX: Use plain axios (not the api instance) to avoid triggering
      // this same interceptor again on a 401.
      const res = await axios.post(
        `${authConfig.apiBaseUrl}/auth/refresh-token`,
        { refreshToken: rt },
        { withCredentials: true },
      );

      // FIX: Backend wraps response in { data: { accessToken, refreshToken } }
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
