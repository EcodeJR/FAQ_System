const Faq = require('../models/Faq');

exports.createFaq = async (req, res) => {
  const { question, answer, locale } = req.body;
  try {
    const faq = new Faq({ question, answer, locale });
    await faq.save();
    res.status(201).json(faq);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.listFaqs = async (req, res) => {
  const faqs = await Faq.find({ locale: req.query.locale || 'en' });
  res.json(faqs);
};