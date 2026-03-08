'use strict';

const env = require('./env');

const authConfig = {
  jwt: {
    accessToken: {
      secret: env.JWT_ACCESS_SECRET,
      expiresIn: env.JWT_ACCESS_EXPIRES_IN,
      algorithm: 'HS256',
    },
    refreshToken: {
      secret: env.JWT_REFRESH_SECRET,
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
      algorithm: 'HS256',
    },
    emailVerification: {
      secret: env.EMAIL_VERIFICATION_SECRET,
      expiresIn: env.EMAIL_VERIFICATION_EXPIRES_IN,
    },
    passwordReset: {
      secret: env.PASSWORD_RESET_SECRET,
      expiresIn: env.PASSWORD_RESET_EXPIRES_IN,
    },
  },

  password: {
    saltRounds: Number(env.BCRYPT_SALT_ROUNDS) || 12,
    minLength: 8,
    maxLength: 128,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    patternMessage:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)',
  },

  oauth: {
    google: {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
    },
    facebook: {
      clientID: env.FACEBOOK_APP_ID,
      clientSecret: env.FACEBOOK_APP_SECRET,
      callbackURL: env.FACEBOOK_CALLBACK_URL,
      profileFields: ['id', 'emails', 'name', 'picture'],
    },
  },

  // ── COOKIE SECURITY FIX ────────────────────────────────────────────────────
  // Original bug: COOKIE_HTTP_ONLY was read as a string comparison against "true"
  // which could be bypassed. Now we explicitly cast from env booleans.
  //
  // CRITICAL: httpOnly MUST be true — JS must never access the refresh token cookie.
  // secure MUST be true in production — prevents cookie over HTTP (MITM risk).
  // sameSite 'strict' prevents CSRF — cookie not sent on cross-site requests.
  //
  // The path '/api/v1/auth/refresh-token' scopes the cookie to ONLY the refresh
  // endpoint so it's not sent on every single API request (minimises exposure).
  cookie: {
    httpOnly: true,                     // FIX: was env.COOKIE_HTTP_ONLY === 'true' — unreliable
    secure: env.COOKIE_SECURE,          // FIX: true in prod, configurable in dev
    sameSite: env.COOKIE_SAME_SITE,     // 'strict' by default
    maxAge: 7 * 24 * 60 * 60 * 1000,   // 7 days in ms
    // path is set per-cookie at the controller level
  },

  rateLimiting: {
    global: {
      windowMs: Number(env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
      max: Number(env.RATE_LIMIT_MAX_REQUESTS) || 100,
    },
    login: {
      windowMs: Number(env.LOGIN_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
      max: Number(env.LOGIN_RATE_LIMIT_MAX) || 5,
      message: 'Too many login attempts. Please try again after 15 minutes.',
    },
    forgotPassword: {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 3,
      message: 'Too many password reset requests. Please try again after 1 hour.',
    },
    resendVerification: {
      windowMs: 60 * 60 * 1000,
      max: 3,
      message: 'Too many verification emails sent. Please try again after 1 hour.',
    },
  },

  session: {
    maxActiveSessions: 5,
  },

  twoFactor: {
    appName: env.TWO_FACTOR_APP_NAME || 'TicketBro',
    window: 1,
  },
};

module.exports = authConfig;
