const router = require('express').Router();
const { getResponse } = require('../controllers/chatController');
router.post('/', getResponse);
module.exports = router;