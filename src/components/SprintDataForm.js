import React, { useState } from 'react';

// PUBLIC_INTERFACE
const SprintDataForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    totalPoints: '',
    sprintDuration: '',
    dailyProgress: []
  });

  const [error, setError] = useState('');

  const validateForm = () => {
    if (!formData.totalPoints || !formData.sprintDuration) {
      setError('Total points and sprint duration are required');
      return false;
    }
    if (formData.totalPoints <= 0) {
      setError('Total points must be a positive number');
      return false;
    }
    if (formData.sprintDuration <= 0 || !Number.isInteger(Number(formData.sprintDuration))) {
      setError('Sprint duration must be a positive integer');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        totalPoints: Number(formData.totalPoints),
        sprintDuration: Number(formData.sprintDuration),
        dailyProgress: formData.dailyProgress.map(Number)
      });
      setError('');
    }
  };

  const handleDailyProgressChange = (value) => {
    const progressArray = value.split(',')
      .map(item => item.trim())
      .filter(item => item !== '');
    setFormData(prev => ({
      ...prev,
      dailyProgress: progressArray
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="sprint-data-form">
      <div className="form-group">
        <label htmlFor="totalPoints">Total Story Points:</label>
        <input
          type="number"
          id="totalPoints"
          value={formData.totalPoints}
          onChange={(e) => setFormData(prev => ({ ...prev, totalPoints: e.target.value }))}
          placeholder="Enter total story points"
          min="1"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="sprintDuration">Sprint Duration (days):</label>
        <input
          type="number"
          id="sprintDuration"
          value={formData.sprintDuration}
          onChange={(e) => setFormData(prev => ({ ...prev, sprintDuration: e.target.value }))}
          placeholder="Enter sprint duration"
          min="1"
          step="1"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="dailyProgress">Daily Progress (comma-separated):</label>
        <input
          type="text"
          id="dailyProgress"
          value={formData.dailyProgress.join(', ')}
          onChange={(e) => handleDailyProgressChange(e.target.value)}
          placeholder="Enter daily progress (e.g., 5, 3, 4)"
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <button type="submit" className="submit-button">Submit Sprint Data</button>
    </form>
  );
};

export default SprintDataForm;