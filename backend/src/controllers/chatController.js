require('dotenv').config();
const axios = require('axios');
const Faq = require('../models/Faq');
const Course = require('../models/Course');

exports.getResponse = async (req, res) => {
  const { message, locale } = req.body;

  try {
    // Set timeout for the request
    res.setTimeout(25000, () => {
      res.status(503).json({ 
        message: 'Request timed out. Please try again.' 
      });
    });

    // 1. FAQ lookup with better error handling
    try {
      const faq = await Faq.findOne({ question: message, locale });
      if (faq) return res.json({ answer: faq.answer });
    } catch (err) {
      console.error('FAQ lookup error:', err);
    }

    // 2. Course lookup with better error handling
    try {
      const course = await Course.findOne({ 
        $or: [
          { code: { $regex: new RegExp(message, 'i') } },
          { title: { $regex: new RegExp(message, 'i') } }
        ],
        locale 
      });
      
      if (course) {
        const details = `${course.code} - ${course.title}: ${course.description}`;
        return res.json({ answer: details });
      }
    } catch (err) {
      console.error('Course lookup error:', err);
    }

    // 3. Fallback to Gemini AI
    const endpoint = process.env.GEMINI_ENDPOINT;
    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL;

    if (!endpoint || !apiKey || !model) {
      return res.status(500).json({ 
        message: 'AI service is currently unavailable' 
      });
    }

    const gmRes = await axios.post(
      `${endpoint}/${model}:generateContent?key=${apiKey}`,
      {
        contents: [{ role: 'user', parts: [{ text: message }] }]
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 20000
      }
    );

    const generated = gmRes.data.candidates?.[0]?.content?.parts?.[0]?.text 
      || 'I apologize, but I could not generate a response. Please try again.';
    
    return res.json({ answer: generated });

  } catch (err) {
    console.error('Chat error:', err);
    return res.status(500).json({ 
      message: 'An error occurred while processing your request' 
    });
  }
};