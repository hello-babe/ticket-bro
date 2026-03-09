// frontend/src/utils/cookieUtils.js
//
// Helpers for reading READABLE (non-httpOnly) cookies.
//
// NOTE: The refresh token cookie is httpOnly — it CANNOT be read here by design.
// These helpers are for non-sensitive cookies only (e.g. theme preferences, CSRF tokens).

/**
 * Get a cookie value by name.
 * @param {string} name
 * @returns {string|null}
 */
export const getCookie = (name) => {
  if (typeof document === 'undefined') return null;

  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${encodeURIComponent(name)}=`));

  if (!match) return null;

  try {
    return decodeURIComponent(match.split('=')[1]);
  } catch {
    return null;
  }
};

/**
 * Check if a cookie exists (non-empty).
 * @param {string} name
 * @returns {boolean}
 */
export const hasCookie = (name) => {
  return getCookie(name) !== null;
};

/**
 * Set a readable (non-httpOnly) cookie.
 * @param {string} name
 * @param {string} value
 * @param {object} options
 * @param {number} [options.maxAge]     - Seconds until expiry
 * @param {string} [options.path='/']
 * @param {boolean} [options.secure]
 * @param {string} [options.sameSite='Lax']
 */
export const setCookie = (name, value, options = {}) => {
  const {
    maxAge,
    path = '/',
    secure = location.protocol === 'https:',
    sameSite = 'Lax',
  } = options;

  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
  if (maxAge !== undefined) cookie += `; max-age=${maxAge}`;
  cookie += `; path=${path}`;
  if (secure) cookie += '; secure';
  cookie += `; samesite=${sameSite}`;

  document.cookie = cookie;
};

/**
 * Delete a cookie by name.
 * @param {string} name
 * @param {string} [path='/']
 */
export const deleteCookie = (name, path = '/') => {
  document.cookie = `${encodeURIComponent(name)}=; max-age=0; path=${path}`;
};
