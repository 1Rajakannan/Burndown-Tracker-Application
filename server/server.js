const express = require('express');
const cors = require('cors');
const path = require('path');
const validateSprintData = require('./middleware/sprintValidation');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Sprint data submission endpoint
app.post('/api/sprint', validateSprintData, (req, res) => {
  try {
    const sprintData = req.body;
    
    // Here you would typically save the data to a database
    // For now, we'll just return success with the received data
    res.status(201).json({
      success: true,
      message: 'Sprint data submitted successfully',
      data: sprintData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing sprint data',
      error: error.message
    });
  }
});

// Catch-all route to return the React app in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
