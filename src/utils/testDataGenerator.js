/**
 * Test data generation utilities for burndown charts
 */

/**
 * Generates ideal burndown line data points
 * @param {number} totalPoints - Total story points for the sprint
 * @param {number} durationDays - Sprint duration in days
 * @returns {Array} Array of data points for ideal burndown line
 */
const generateIdealBurndownLine = (totalPoints, durationDays) => {
  const pointsPerDay = totalPoints / durationDays;
  return Array.from({ length: durationDays + 1 }, (_, index) => ({
    day: index,
    points: Math.round((totalPoints - (pointsPerDay * index)) * 10) / 10
  }));
};

/**
 * Generates realistic daily progress data
 * @param {number} totalPoints - Total story points for the sprint
 * @param {number} durationDays - Sprint duration in days
 * @param {string} scenario - Test scenario type ('ideal', 'delayed', 'ahead', 'stuck')
 * @returns {Array} Array of data points for actual progress
 */
const generateDailyProgress = (totalPoints, durationDays, scenario = 'ideal') => {
  const result = [];
  let remainingPoints = totalPoints;
  
  const scenarios = {
    ideal: { variability: 0.1, completion: 1 },
    delayed: { variability: 0.2, completion: 0.7 },
    ahead: { variability: 0.15, completion: 1.2 },
    stuck: { variability: 0.05, completion: 0.3 }
  };

  const { variability, completion } = scenarios[scenario] || scenarios.ideal;
  
  for (let day = 0; day <= durationDays; day++) {
    if (day === 0) {
      result.push({ day, points: totalPoints });
      continue;
    }

    const idealProgress = (totalPoints / durationDays) * completion;
    const randomVariation = (Math.random() * 2 - 1) * idealProgress * variability;
    const dailyProgress = Math.max(0, idealProgress + randomVariation);
    
    remainingPoints = Math.max(0, remainingPoints - dailyProgress);
    result.push({ day, points: Math.round(remainingPoints * 10) / 10 });
  }

  return result;
};

/**
 * Generates sprint metrics data
 * @param {Array} progressData - Daily progress data points
 * @param {number} totalPoints - Total story points for the sprint
 * @returns {Object} Sprint metrics including velocity and completion rate
 */
const generateSprintMetrics = (progressData, totalPoints) => {
  const completedPoints = totalPoints - progressData[progressData.length - 1].points;
  return {
    velocity: Math.round((completedPoints / totalPoints) * 100) / 100,
    completionRate: Math.round((completedPoints / totalPoints) * 100),
    remainingWork: progressData[progressData.length - 1].points
  };
};

/**
 * Generates a complete test data set for burndown charts
 * @param {Object} config - Configuration object
 * @param {number} config.totalPoints - Total story points for the sprint
 * @param {number} config.durationDays - Sprint duration in days
 * @param {string} config.scenario - Test scenario type
 * @returns {Object} Complete test data set
 */
const generateBurndownTestData = ({ 
  totalPoints = 100,
  durationDays = 14,
  scenario = 'ideal'
} = {}) => {
  const idealLine = generateIdealBurndownLine(totalPoints, durationDays);
  const actualProgress = generateDailyProgress(totalPoints, durationDays, scenario);
  const metrics = generateSprintMetrics(actualProgress, totalPoints);

  return {
    idealLine,
    actualProgress,
    metrics,
    sprintInfo: {
      totalPoints,
      durationDays,
      scenario
    }
  };
};

// Export test data generation functions
module.exports = {
  generateBurndownTestData,
  generateIdealBurndownLine,
  generateDailyProgress,
  generateSprintMetrics
};