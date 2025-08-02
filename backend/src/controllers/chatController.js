require('dotenv').config();
const Faq = require('../models/Faq');
const Course = require('../models/Course');
const natural = require('natural');
const { TfIdf, PorterStemmer } = natural;
const tokenizer = new natural.WordTokenizer();

// Initialize TF-IDF
const tfidf = new TfIdf();
const documents = [];
let isTfidfTrained = false;

// Function to preprocess text
const preprocessText = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .replace(/\s+/g, ' ')     // Normalize whitespace
    .trim();
};

// Function to tokenize and stem text
const tokenizeAndStem = (text) => {
  const tokens = tokenizer.tokenize(preprocessText(text)) || [];
  return tokens.map(token => PorterStemmer.stem(token));
};

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

    // 1. FAQ lookup with semantic search
    try {
      // First try exact match
      let faq = await Faq.findOne({ 
        $or: [
          { question: { $regex: new RegExp(`^${cleanedQuery}$`, 'i') } },
          { keywords: { $in: [cleanedQuery] } }
        ],
        locale 
      });

      // If no exact match, try semantic search
      if (!faq) {
        // Get all FAQs for the locale if not already in memory
        const allFaqs = await Faq.find({ locale });
        
        if (allFaqs.length > 0) {
          // Train TF-IDF if not already trained
          if (!isTfidfTrained) {
            allFaqs.forEach((item, index) => {
              const doc = `${item.question} ${item.keywords?.join(' ') || ''} ${item.answer}`;
              documents[index] = { id: index, text: doc, faq: item };
              tfidf.addDocument(tokenizeAndStem(doc));
            });
            isTfidfTrained = true;
          }

          // Find most similar FAQ
          const queryVector = tokenizeAndStem(cleanedQuery);
          const scores = [];
          
          tfidf.tfidfs(queryVector, (i, measure) => {
            if (measure > 0) { // Only consider positive scores
              scores.push({ index: i, score: measure });
            }
          });

          // Sort by score and get top match
          scores.sort((a, b) => b.score - a.score);
          if (scores.length > 0 && scores[0].score > 0.1) { // Threshold for similarity
            const bestMatch = documents[scores[0].index];
            faq = bestMatch.faq;
            console.log(`Semantic match found with score: ${scores[0].score}`);
          }
        }
      }
      
      if (faq) {
        return res.json({ 
          answer: faq.answer,
          source: 'faq',
          reference: faq.reference || null,
          isSemanticMatch: true
        });
      }
    } catch (err) {
      console.error('FAQ lookup error:', err);
      // Continue to next search method on error
    }

    // 2. Course lookup with semantic search
    try {
      // First try exact matches
      let course = await Course.findOne({ 
        $or: [
          { code: { $regex: new RegExp(`^${cleanedQuery}$`, 'i') } },
          { title: { $regex: new RegExp(`^${cleanedQuery}$`, 'i') } }
        ],
        locale 
      });

      // If no exact match, try fuzzy search
      if (!course) {
        const courses = await Course.find({ 
          $or: [
            { code: { $regex: new RegExp(cleanedQuery, 'i') } },
            { title: { $regex: new RegExp(cleanedQuery, 'i') } },
            { description: { $regex: new RegExp(cleanedQuery, 'i') } }
          ],
          locale 
        });

        // If multiple matches, try to find the most relevant one
        if (courses.length > 1) {
          // Simple scoring based on term frequency in different fields
          const scoredCourses = courses.map(c => {
            const queryTerms = cleanedQuery.toLowerCase().split(/\s+/);
            const titleTerms = c.title.toLowerCase().split(/\s+/);
            const descTerms = c.description.toLowerCase().split(/\s+/);
            
            // Higher weight for title matches
            const titleScore = queryTerms.reduce((score, term) => 
              score + (titleTerms.some(t => t.includes(term)) ? 2 : 0), 0);
              
            // Lower weight for description matches
            const descScore = queryTerms.reduce((score, term) => 
              score + (descTerms.some(t => t.includes(term)) ? 1 : 0), 0);
              
            return { ...c._doc, _score: titleScore + descScore };
          });

          // Sort by score and get the best match
          scoredCourses.sort((a, b) => b._score - a._score);
          if (scoredCourses[0]._score > 0) {
            course = scoredCourses[0];
          }
        } else if (courses.length === 1) {
          course = courses[0];
        }
      }
      
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

    // 3. Try to find partial matches in FAQs and Courses
    try {
      const [partialFaqs, partialCourses] = await Promise.all([
        Faq.find({
          $or: [
            { question: { $regex: cleanedQuery.split(' ').filter(w => w.length > 3).join('|'), $options: 'i' } },
            { answer: { $regex: cleanedQuery.split(' ').filter(w => w.length > 3).join('|'), $options: 'i' } }
          ],
          locale
        }).limit(3),
        
        Course.find({
          $or: [
            { title: { $regex: cleanedQuery.split(' ').filter(w => w.length > 3).join('|'), $options: 'i' } },
            { description: { $regex: cleanedQuery.split(' ').filter(w => w.length > 3).join('|'), $options: 'i' } }
          ],
          locale
        }).limit(2)
      ]);

      if (partialFaqs.length > 0 || partialCourses.length > 0) {
        let response = "I couldn't find an exact match, but here's some information that might help:\n\n";
        
        if (partialFaqs.length > 0) {
          response += "**Related FAQs:**\n";
          partialFaqs.forEach((faq, index) => {
            response += `${index + 1}. **${faq.question}**\n   ${faq.answer.substring(0, 100)}${faq.answer.length > 100 ? '...' : ''}\n\n`;
          });
        }
        
        if (partialCourses.length > 0) {
          response += "**Related Courses:**\n";
          partialCourses.forEach((course, index) => {
            response += `${index + 1}. **${course.code} - ${course.title}**\n   ${course.description.substring(0, 100)}${course.description.length > 100 ? '...' : ''}\n\n`;
          });
        }
        
        response += "\nWould you like more information about any of these?";
        
        return res.json({
          answer: response,
          source: 'partial_matches',
          hasPartialMatches: true
        });
      }
    } catch (err) {
      console.error('Partial match search error:', err);
    }

    // 4. No results found at all
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