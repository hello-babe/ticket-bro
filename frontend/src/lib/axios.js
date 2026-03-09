// frontend/src/lib/axios.js
//
// Re-export shim — the canonical axios instance lives in api/api.js.
// Any file that imports from lib/axios.js continues to work without changes.

export { default } from '../api/api';
