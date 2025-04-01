const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/**
 * @route GET /api/users/:userId
 * @desc Get user by ID
 * @access Public
 */
router.get('/:userId', userController.getUser);

/**
 * @route PUT /api/users/:userId/balance
 * @desc Update user balance
 * @access Public
 */
router.put('/:userId/balance', userController.updateBalance);

module.exports = router;
