const express = require('express');
const cors = require('cors');
const path = require('path');
const validateSprintData = require('./middleware/sprintValidation');
const sprintStore = require('./data/sprintStore');

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

// Sprint Routes
app.post('/api/sprint', validateSprintData, (req, res) => {
  try {
    const sprintData = req.body;
    const sprint = sprintStore.createSprint(sprintData);
    res.status(201).json({
      success: true,
      message: 'Sprint data submitted successfully',
      data: sprint
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing sprint data',
      error: error.message
    });
  }
});

app.get('/api/sprint/:id', (req, res) => {
  try {
    const sprint = sprintStore.getSprint(req.params.id);
    if (!sprint) {
      return res.status(404).json({
        success: false,
        message: 'Sprint not found'
      });
    }
    res.json({
      success: true,
      data: sprint
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving sprint data',
      error: error.message
    });
  }
});

app.get('/api/sprints', (req, res) => {
  try {
    const sprints = sprintStore.getAllSprints();
    res.json({
      success: true,
      data: sprints
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving sprints',
      error: error.message
    });
  }
});

app.put('/api/sprint/:id', validateSprintData, (req, res) => {
  try {
    const updatedSprint = sprintStore.updateSprint(req.params.id, req.body);
    if (!updatedSprint) {
      return res.status(404).json({
        success: false,
        message: 'Sprint not found'
      });
    }
    res.json({
      success: true,
      message: 'Sprint updated successfully',
      data: updatedSprint
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating sprint',
      error: error.message
    });
  }
});

app.delete('/api/sprint/:id', (req, res) => {
  try {
    const deleted = sprintStore.deleteSprint(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Sprint not found'
      });
    }
    res.json({
      success: true,
      message: 'Sprint deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting sprint',
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
