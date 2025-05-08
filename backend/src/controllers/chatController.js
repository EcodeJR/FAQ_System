require('dotenv').config();
const axios = require('axios');
const Faq = require('../models/Faq');
const Course = require('../models/Course');

exports.getResponse = async (req, res) => {
  const { message, locale } = req.body;

  // 1. FAQ lookup
  const faq = await Faq.findOne({ question: message, locale });
  if (faq) return res.json({ answer: faq.answer });

  // 2. Course lookup
  const course = await Course.findOne({ code: message, locale });
  if (course) {
    const details = `${course.code} - ${course.title}: ${course.description}`;
    return res.json({ answer: details });
  }

  // 3. Fallback to Gemini AI
  const endpoint = process.env.GEMINI_ENDPOINT;
  const apiKey   = process.env.GEMINI_API_KEY;
  const model    = process.env.GEMINI_MODEL;

  if (!endpoint || !apiKey || !model) {
    return res.status(500).json({ message: 'Gemini configuration missing' });
  }

  try {
    const gmRes = await axios.post(
      `${endpoint}?key=${apiKey}`,
      {
        model,
        prompt: { text: message },
        temperature: 0.7
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
    const generated = gmRes.data.candidates?.[0]?.content || 'No response';
    return res.json({ answer: generated });
  } catch (err) {
    console.error('Gemini API error:', err.response?.data || err.message);
    return res.status(500).json({ message: 'Error calling Gemini AI' });
  }
};
