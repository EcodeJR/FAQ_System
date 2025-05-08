const { Schema, model } = require('mongoose');
const CourseSchema = new Schema({
  code:        { type: String, required: true, unique: true, index: true },
  title:       { type: String, required: true },
  description: { type: String, required: true },
  locale:      { type: String, required: true, default: 'en' },
});
module.exports = model('Course', CourseSchema);