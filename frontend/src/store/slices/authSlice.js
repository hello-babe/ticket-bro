// frontend/src/store/slices/authSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/authService";
import { storageUtils } from "../../utils/storageUtils";

// ── Async Thunks ──────────────────────────────────────────────────────────────

export const registerUser = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      const res = await authService.register(data);
      // FIX: Do NOT store tokens or set isAuthenticated here.
      // The backend issues tokens on register, but the user's email is not
      // verified yet. We intentionally discard the tokens and force them
      // to verify their email before they can log in.
      // Tokens will be issued properly after login (post-verification).
      return { registered: true };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Registration failed.",
      );
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await authService.login(data);
      const payload = res.data.data;

      // 2FA path — no tokens yet
      if (payload.requiresTwoFactor) {
        return { requiresTwoFactor: true, email: payload.email };
      }

      // Normal login — store tokens + user
      storageUtils.setTokens({
        accessToken: payload.tokens.accessToken,
        refreshToken: payload.tokens.refreshToken,
      });
      storageUtils.setUser(payload.user);

      return { user: payload.user, tokens: payload.tokens };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed.");
    }
  },
);

export const verifyTwoFactor = createAsyncThunk(
  "auth/verifyTwoFactor",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const res = await authService.verifyTwoFactor(email, otp);
      const { user, tokens } = res.data.data;

      storageUtils.setTokens({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });
      storageUtils.setUser(user);

      return { user, tokens };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "OTP verification failed.",
      );
    }
  },
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const rt = storageUtils.getRefreshToken();
      await authService.logout(rt);
    } catch {
      // Always clear local state even if server call fails
    } finally {
      storageUtils.clearAll();
    }
  },
);

export const fetchMe = createAsyncThunk(
  "auth/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      const res = await authService.getMe();
      const user = res.data.data;
      storageUtils.setUser(user);
      return user;
    } catch (err) {
      storageUtils.clearAll();
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch user.",
      );
    }
  },
);

// ── Slice ─────────────────────────────────────────────────────────────────────

// Rehydrate from localStorage on page refresh
const persistedUser = storageUtils.getUser();
const persistedToken = storageUtils.getAccessToken();

const initialState = {
  user: persistedUser || null,
  isAuthenticated: !!(persistedUser && persistedToken),
  isLoading: false,
  error: null,
  requiresTwoFactor: false,
  twoFactorEmail: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearTwoFactor: (state) => {
      state.requiresTwoFactor = false;
      state.twoFactorEmail = null;
    },
    setAuthFromOAuth: (state, action) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.isAuthenticated = true;
      state.error = null;
      storageUtils.setTokens({ accessToken, refreshToken });
      storageUtils.setUser(user);
    },
  },

  extraReducers: (builder) => {
    // ── register ─────────────────────────────────────────────────────────────
    // FIX: fulfilled does NOT set user or isAuthenticated.
    // User is in "registered but unverified" limbo — not logged in.
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null; // no user in state
        state.isAuthenticated = false; // NOT authenticated
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // ── login ─────────────────────────────────────────────────────────────────
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.requiresTwoFactor) {
          state.requiresTwoFactor = true;
          state.twoFactorEmail = action.payload.email;
        } else {
          state.user = action.payload.user;
          state.isAuthenticated = true;
          state.requiresTwoFactor = false;
          state.twoFactorEmail = null;
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // ── verifyTwoFactor ───────────────────────────────────────────────────────
    builder
      .addCase(verifyTwoFactor.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyTwoFactor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.requiresTwoFactor = false;
        state.twoFactorEmail = null;
      })
      .addCase(verifyTwoFactor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // ── logout ────────────────────────────────────────────────────────────────
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.requiresTwoFactor = false;
      state.twoFactorEmail = null;
      state.error = null;
    });

    // ── fetchMe ───────────────────────────────────────────────────────────────
    builder
      .addCase(fetchMe.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, clearTwoFactor, setAuthFromOAuth } =
  authSlice.actions;

// ── Selectors ─────────────────────────────────────────────────────────────────
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;
export const selectRequires2FA = (state) => state.auth.requiresTwoFactor;
export const select2FAEmail = (state) => state.auth.twoFactorEmail;

export default authSlice.reducer;
