// Middleware for validating sprint data
const validateSprintData = (req, res, next) => {
  const { totalPoints, sprintDuration, dailyProgress } = req.body;

  // Check if required fields are present
  if (!totalPoints || !sprintDuration) {
    return res.status(400).json({
      success: false,
      message: 'Total points and sprint duration are required'
    });
  }

  // Validate total points
  if (typeof totalPoints !== 'number' || totalPoints <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Total points must be a positive number'
    });
  }

  // Validate sprint duration
  if (!Number.isInteger(sprintDuration) || sprintDuration <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Sprint duration must be a positive integer'
    });
  }

  // Validate daily progress if provided
  if (dailyProgress) {
    if (!Array.isArray(dailyProgress)) {
      return res.status(400).json({
        success: false,
        message: 'Daily progress must be an array'
      });
    }

    if (!dailyProgress.every(progress => typeof progress === 'number' && progress >= 0)) {
      return res.status(400).json({
        success: false,
        message: 'Daily progress values must be non-negative numbers'
      });
    }

    if (dailyProgress.length > sprintDuration) {
      return res.status(400).json({
        success: false,
        message: 'Daily progress entries cannot exceed sprint duration'
      });
    }
  }

  next();
};

module.exports = validateSprintData;