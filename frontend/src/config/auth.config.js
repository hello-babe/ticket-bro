// frontend/src/config/auth.config.js
const authConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1",
  appName: import.meta.env.VITE_APP_NAME || "Ticket Bro",

  routes: {
    home: "/",
    login: "?auth=login",
    register: "?auth=register",
    forgotPassword: "?auth=forgot",
    resetPassword: "?auth=reset",
    verifyEmail: "?auth=verify",
    verifyEmailNotice: "?auth=verify-notice",
    otp: "?auth=otp",
    profile: "/profile",
  },

  storage: {
    accessToken: "auth_access_token",
    refreshToken: "auth_refresh_token",
    user: "auth_user",
    theme: "auth_theme",
  },

  oauth: {
    google: {
      redirectUri: import.meta.env.VITE_GOOGLE_REDIRECT_URI || "http://localhost:5173/auth/oauth-success",
    },
    facebook: {
      redirectUri: import.meta.env.VITE_FACEBOOK_REDIRECT_URI || "http://localhost:5173/auth/oauth-success",
    },
  },
};

export default authConfig;