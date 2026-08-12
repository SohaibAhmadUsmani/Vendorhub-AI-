const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const { getUsers, updateUserStatus, updateUser } = require('../controllers/userController');

// All user management routes require admin access
router.use(authMiddleware);
router.use(roleMiddleware('admin'));

router.route('/')
  .get(getUsers);

router.route('/:id/status')
  .put(updateUserStatus);

router.route('/:id')
  .put(updateUser);

module.exports = router;
