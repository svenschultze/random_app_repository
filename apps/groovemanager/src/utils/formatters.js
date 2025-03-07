/**
 * Format seconds into mm:ss format
 * @param {number} seconds - Number of seconds to format
 * @returns {string} Formatted time string
 */
export function formatTime(seconds) {
  if (!seconds && seconds !== 0) return '--:--'
  
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

/**
 * Format a track duration for display
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration
 */
export function formatDuration(seconds) {
  return formatTime(seconds)
}

/**
 * Format year for display
 * @param {number} year - Year number
 * @returns {string} Formatted year
 */
export function formatYear(year) {
  return year ? year.toString() : 'Unknown'
}