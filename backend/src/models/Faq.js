const { Schema, model } = require('mongoose');
const FaqSchema = new Schema({
  question: { type: String, required: true, index: true },
  answer:   { type: String, required: true },
  locale:   { type: String, required: true, default: 'en' },
});
module.exports = model('Faq', FaqSchema);