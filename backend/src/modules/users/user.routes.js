'use strict';

// backend/src/modules/users/user.routes.js
//
// NOTE: `authenticate` is already applied in routes.js before this router mounts.
// We only apply `authorize` here for admin-only routes.

const express        = require('express');
const multer         = require('multer');
const path           = require('path');
const userController = require('./user.controller');

const router = express.Router();

// ── Multer config for avatar uploads ─────────────────────────────────────────
// Stores to disk at public/uploads/avatars/
// Replace with cloudinary/s3 storage if needed
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(process.cwd(), 'public', 'uploads', 'avatars');
    require('fs').mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${req.user.id || req.user._id}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed.'), false);
  },
});

// ── Try to load authorize from common middleware ───────────────────────────────
// If your auth.middleware path is different, adjust accordingly
let authorize;
try {
  ({ authorize } = require('../../common/middleware/auth.middleware'));
} catch {
  // Fallback — reads role from req.user set by authenticate
  authorize = (...roles) => (req, res, next) => {
    if (!req.user) return res.status(401).json({ status: 'fail', message: 'Not authenticated.' });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ status: 'fail', message: 'Access denied.' });
    }
    next();
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// CURRENT USER — /api/v1/users/me
// All authenticated (authenticate already applied in routes.js)
// ══════════════════════════════════════════════════════════════════════════════

router.get   ('/me', userController.getMe);
router.patch ('/me', userController.updateMe);
router.delete('/me', userController.deleteMe);

router.post  ('/me/avatar', upload.single('avatar'), userController.uploadAvatar);
router.delete('/me/avatar', userController.removeAvatar);

router.get   ('/me/sessions',              userController.getMySessions);
router.delete('/me/sessions/:sessionId',   userController.revokeSession);

// ══════════════════════════════════════════════════════════════════════════════
// ADMIN — /api/v1/users
// ══════════════════════════════════════════════════════════════════════════════
router.use(authorize('admin'));

// stats MUST come before /:userId to avoid being swallowed as a param
router.get('/stats', userController.getUserStats);

router.get   ('/',          userController.getAllUsers);
router.get   ('/:userId',   userController.getUserById);
router.patch ('/:userId',   userController.updateUserById);
router.delete('/:userId',   userController.deleteUserById);

router.patch('/:userId/activate',   userController.activateUser);
router.patch('/:userId/deactivate', userController.deactivateUser);
router.patch('/:userId/role',       userController.changeUserRole);

module.exports = router;
