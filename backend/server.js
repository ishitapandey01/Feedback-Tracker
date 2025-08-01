const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'OPTIONS'],
}));
app.options('*', cors()); // Handle preflight requests
app.use(express.json());

// Data file path
const dataFile = path.join(__dirname, 'data', 'feedback.json');

// Ensure data directory exists
const ensureDataDir = async () => {
  const dataDir = path.join(__dirname, 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
  
  // Initialize feedback.json if it doesn't exist
  try {
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(dataFile, JSON.stringify([], null, 2));
  }
};

// Helper functions
const readFeedback = async () => {
  try {
    const data = await fs.readFile(dataFile, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
};

const writeFeedback = async (data) => {
  await fs.writeFile(dataFile, JSON.stringify(data, null, 2));
};

// Routes

// Get all feedback
app.get('/api/feedback', async (req, res) => {
  try {
    const feedback = await readFeedback();
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read feedback' });
  }
});

// Create new feedback
app.post('/api/feedback', async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }
    
    const feedback = await readFeedback();
    const newFeedback = {
      id: Date.now().toString(),
      title,
      description,
      category: category || 'general',
      priority: priority || 'medium',
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    feedback.push(newFeedback);
    await writeFeedback(feedback);
    
    res.status(201).json(newFeedback);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create feedback' });
  }
});

// Update feedback
app.put('/api/feedback/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const feedback = await readFeedback();
    const index = feedback.findIndex(item => item.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    
    feedback[index] = {
      ...feedback[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    await writeFeedback(feedback);
    res.json(feedback[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update feedback' });
  }
});

// Delete feedback
app.delete('/api/feedback/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const feedback = await readFeedback();
    const filteredFeedback = feedback.filter(item => item.id !== id);
    
    if (feedback.length === filteredFeedback.length) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    
    await writeFeedback(filteredFeedback);
    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete feedback' });
  }
});

// AI Assistant endpoint
app.post('/api/ai/ask', async (req, res) => {
  try {
    const { question } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }
    
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }
    
    const { OpenAI } = require('openai');
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant for a feedback management system. You can help users with general questions and provide insights about feedback management best practices.'
        },
        {
          role: 'user',
          content: question
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });
    
    const answer = response.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
    
    res.json({ answer });
  } catch (error) {
    console.error('AI API Error:', error);
    if (error.status === 401) {
      res.status(401).json({ error: 'Invalid OpenAI API key' });
    } else if (error.status === 429) {
      res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
    } else {
      res.status(500).json({ error: 'Failed to get AI response' });
    }
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Initialize and start server
const startServer = async () => {
  await ensureDataDir();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
};

startServer();