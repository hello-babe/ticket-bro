// frontend/src/hooks/useAuth.js
// Re-export from AuthContext so both import paths work:
//   import useAuth from '@/hooks/useAuth'          ✓
//   import useAuth from '@/context/AuthContext'    ✓
//   import { useAuth } from '@/context/AuthContext' ✓
export { useAuth as default, useAuth, useAuthContext } from '@/context/AuthContext';
