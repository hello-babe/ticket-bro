// frontend/src/api/client.js
//
// FIX: This file was a broken duplicate axios instance with:
//   - missing withCredentials:true (cookies never sent)
//   - hardcoded localStorage key ('auth_access_token') that diverged from authConfig
//   - no token refresh on 401 (instant logout on expiry)
//
// Now it simply re-exports the canonical api.js instance.
// Any file that imported from client.js continues to work without changes.

export { default } from './api';
