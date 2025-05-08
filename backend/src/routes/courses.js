const router = require('express').Router();
const { createCourse, listCourses } = require('../controllers/courseController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.get('/', listCourses);
router.post('/', auth, role, createCourse);

module.exports = router;