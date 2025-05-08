const router = require('express').Router();
const { createFaq, listFaqs } = require('../controllers/faqController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.get('/', listFaqs);
router.post('/', auth, role, createFaq);

module.exports = router;