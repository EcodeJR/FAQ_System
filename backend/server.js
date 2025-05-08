require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/db');

const authRoutes = require('./src/routes/auth');
const chatRoutes = require('./src/routes/chat');
const faqRoutes = require('./src/routes/faqs');
const courseRoutes = require('./src/routes/courses');
const cors = require('cors');

const app = express();
app.use(express.json());


const corsOptions = {
  origin: process.env.CORS_ORIGIN
};

app.use(cors(corsOptions));


connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/courses', courseRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
