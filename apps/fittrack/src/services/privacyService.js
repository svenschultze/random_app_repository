import { getUserSettings, updateUserSettings, getDailyLogs, getWorkouts } from './dataService';

// Since these functions are not exported from dataService, we'll reimplement them here
const saveDailyLogs = (logs) => {
  localStorage.setItem('fittrack_dailyLogs', JSON.stringify(logs));
};

const saveWorkouts = (workouts) => {
  localStorage.setItem('fittrack_workouts', JSON.stringify(workouts));
};

// Apply data retention policy
const applyDataRetention = () => {
  const settings = getUserSettings();
  const retentionDays = settings.dataRetentionDays || 90;
  
  if (!settings.storeDataLocally) {
    // Clear all data if local storage is disabled
    localStorage.clear();
    return { deleted: true, count: 0 };
  }
  
  // Calculate cutoff date
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
  
  // Filter out logs older than cutoff date
  const logs = getDailyLogs();
  const filteredLogs = logs.filter(log => {
    const logDate = new Date(log.date);
    return logDate >= cutoffDate;
  });
  
  // Filter out workouts older than cutoff date
  const workouts = getWorkouts();
  const filteredWorkouts = workouts.filter(workout => {
    const workoutDate = new Date(workout.date);
    return workoutDate >= cutoffDate;
  });
  
  // Save filtered data
  saveDailyLogs(filteredLogs);
  saveWorkouts(filteredWorkouts);
  
  return {
    deleted: logs.length !== filteredLogs.length || workouts.length !== filteredWorkouts.length,
    count: (logs.length - filteredLogs.length) + (workouts.length - filteredWorkouts.length)
  };
};

// Export data as JSON
const exportUserData = () => {
  const data = {
    logs: getDailyLogs(),
    workouts: getWorkouts(),
    settings: getUserSettings()
  };
  
  const dataStr = JSON.stringify(data, null, 2);
  const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
  
  // Create download link and trigger click
  const exportFileDefaultName = `fittrack-export-${new Date().toISOString().slice(0, 10)}.json`;
  
  return {
    dataUri,
    filename: exportFileDefaultName,
    data: dataStr
  };
};

// Import data from JSON
const importUserData = (jsonData) => {
  try {
    const data = JSON.parse(jsonData);
    
    if (data.logs) {
      saveDailyLogs(data.logs);
    }
    
    if (data.workouts) {
      saveWorkouts(data.workouts);
    }
    
    if (data.settings) {
      updateUserSettings(data.settings);
    }
    
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error.message 
    };
  }
};

// Update privacy settings
const updatePrivacySettings = (privacySettings) => {
  const settings = getUserSettings();
  const updatedSettings = { 
    ...settings, 
    ...privacySettings 
  };
  
  updateUserSettings(updatedSettings);
  
  // Apply data retention if setting changed
  if ('dataRetentionDays' in privacySettings || 'storeDataLocally' in privacySettings) {
    applyDataRetention();
  }
  
  return updatedSettings;
};

export {
  applyDataRetention,
  exportUserData,
  importUserData,
  updatePrivacySettings
};