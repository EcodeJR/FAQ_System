require('dotenv').config();
const axios = require('axios');
const Faq = require('../models/Faq');
const Course = require('../models/Course');

// Helper function to clean and normalize the search query
const cleanQuery = (query) => {
  if (!query || typeof query !== 'string') return '';
  return query.trim().toLowerCase();
};

// Helper function to generate not found response
const getNotFoundResponse = (locale) => {
  const responses = {
    en: "I couldn't find any matching information in our database.\n\nHere's what you can do:\n* Check the spelling of your query\n* Try different keywords or more specific terms\n* Browse our FAQ section for common questions\n* Explore our course catalog for available programs\n\nHow else can I assist you today?",
    // Add more language variations as needed
  };
  return responses[locale] || responses.en;
};

exports.getResponse = async (req, res) => {
  const { message, locale = 'en' } = req.body;
  const cleanedQuery = cleanQuery(message);

  // Input validation
  if (!cleanedQuery) {
    return res.status(400).json({
      answer: 'Please provide a valid message.'
    });
  }

  try {
    // Set timeout for the request (25 seconds)
    res.setTimeout(25000, () => {
      if (!res.headersSent) {
        res.status(503).json({ 
          answer: 'Request timed out. Please try again with a different query.'
        });
      }
    });

    // 1. FAQ lookup
    try {
      const faq = await Faq.findOne({ 
        $or: [
          { question: { $regex: new RegExp(cleanedQuery, 'i') } },
          { keywords: { $in: [cleanedQuery] } }
        ],
        locale 
      });
      
      if (faq) {
        return res.json({ 
          answer: faq.answer,
          source: 'faq',
          reference: faq.reference || null
        });
      }
    } catch (err) {
      console.error('FAQ lookup error:', err);
      // Continue to next search method on error
    }

    // 2. Course lookup
    try {
      const course = await Course.findOne({ 
        $or: [
          { code: { $regex: new RegExp(cleanedQuery, 'i') } },
          { title: { $regex: new RegExp(cleanedQuery, 'i') } },
          { description: { $regex: new RegExp(cleanedQuery, 'i') } }
        ],
        locale 
      });
      
      if (course) {
        const details = `**${course.code} - ${course.title}**\n\n${course.description}\n\n` +
          `* Credits: ${course.credits || 'N/A'}\n` +
          `* Level: ${course.level || 'N/A'}\n` +
          (course.prerequisites ? `* Prerequisites: ${course.prerequisites}\n` : '') +
          (course.availability ? `* Availability: ${course.availability}` : '');
        
        return res.json({ 
          answer: details,
          source: 'course',
          courseId: course._id
        });
      }
    } catch (err) {
      console.error('Course lookup error:', err);
      // Continue to return not found response
    }

    // 3. No results found
    return res.json({
      answer: getNotFoundResponse(locale),
      source: 'not_found',
      suggestions: [
        'How do I apply for a course?',
        'What are the admission requirements?',
        'List all available courses',
        'Contact information'
      ]
    });

  } catch (err) {
    console.error('Chat processing error:', err);
    return res.status(500).json({ 
      answer: 'An unexpected error occurred while processing your request. Please try again later.'
    });
  }
};