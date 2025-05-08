const Course = require('../models/Course');

exports.createCourse = async (req, res) => {
  const { code, title, description, locale } = req.body;
  try {
    const course = new Course({ code, title, description, locale });
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.listCourses = async (req, res) => {
  const courses = await Course.find({ locale: req.query.locale || 'en' });
  res.json(courses);
};