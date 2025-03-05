import { defineStore } from 'pinia'

// Generate mock analytics data
const generateAnalyticsData = () => {
  return {
    // Meetings per day over a two-week period
    meetingsPerDay: [5, 7, 4, 8, 6, 2, 1, 7, 9, 6, 8, 5, 3, 4],
    
    // Meeting durations (in hours)
    meetingDurations: {
      labels: ['< 30 min', '30-60 min', '1-2 hours', '> 2 hours'],
      data: [15, 45, 30, 10]
    },
    
    // Time allocation
    timeAllocation: {
      labels: ['Meetings', 'Focus Time', 'Admin Tasks', 'Breaks'],
      data: [35, 40, 15, 10]
    },
    
    // Meetings by department
    meetingsByDepartment: {
      labels: ['Engineering', 'Marketing', 'Sales', 'HR', 'Executive'],
      data: [30, 25, 20, 10, 15]
    },
    
    // Meeting attendance rate
    attendanceRate: 87,
    
    // Average meeting rating (out of 5)
    avgMeetingRating: 3.7,
    
    // Common meeting days
    meetingsByDay: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      data: [28, 22, 25, 20, 18, 5, 2]
    },
    
    // Meeting time preferences
    meetingTimePreferences: {
      labels: ['9-11 AM', '11-1 PM', '1-3 PM', '3-5 PM', 'After 5 PM'],
      data: [40, 15, 20, 20, 5]
    },
    
    // Monthly meeting trend (last 6 months)
    monthlyMeetingTrend: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      data: [80, 95, 110, 105, 120, 115]
    },
    
    // Task completion data
    taskCompletionRate: 78,
    
    // Productivity score
    productivityScore: 82,
    
    // Meetings with/without agendas
    meetingsWithAgenda: 65, // Percentage
    
    // Key metrics
    keyMetrics: {
      totalMeetingsThisMonth: 120,
      totalMeetingHours: 185,
      averageMeetingLength: 55, // minutes
      focusTimePercentage: 40,
      overrunningMeetings: 22, // Percentage
      highPriorityMeetings: 35 // Percentage
    }
  }
}

export const useAnalyticsStore = defineStore('analytics', {
  state: () => ({
    analyticsData: generateAnalyticsData(),
    dateRange: 'month', // day, week, month, year
    selectedMetrics: ['meetingsPerDay', 'timeAllocation', 'meetingDurations'],
    isLoading: false
  }),
  
  getters: {
    getAnalyticsData: (state) => state.analyticsData,
    
    getMeetingsPerDay: (state) => state.analyticsData.meetingsPerDay,
    
    getMeetingDurations: (state) => state.analyticsData.meetingDurations,
    
    getTimeAllocation: (state) => state.analyticsData.timeAllocation,
    
    getMeetingsByDepartment: (state) => state.analyticsData.meetingsByDepartment,
    
    getAttendanceRate: (state) => state.analyticsData.attendanceRate,
    
    getAvgMeetingRating: (state) => state.analyticsData.avgMeetingRating,
    
    getMeetingsByDay: (state) => state.analyticsData.meetingsByDay,
    
    getMeetingTimePreferences: (state) => state.analyticsData.meetingTimePreferences,
    
    getMonthlyMeetingTrend: (state) => state.analyticsData.monthlyMeetingTrend,
    
    getTaskCompletionRate: (state) => state.analyticsData.taskCompletionRate,
    
    getProductivityScore: (state) => state.analyticsData.productivityScore,
    
    getMeetingsWithAgenda: (state) => state.analyticsData.meetingsWithAgenda,
    
    getKeyMetrics: (state) => state.analyticsData.keyMetrics
  },
  
  actions: {
    setDateRange(range) {
      this.dateRange = range
      this.refreshAnalytics()
    },
    
    // Simulate API call to refresh analytics data
    refreshAnalytics() {
      this.isLoading = true
      
      // Simulate API delay
      setTimeout(() => {
        // Create slightly different data based on date range
        const newData = { ...this.analyticsData }
        
        // Modify some values randomly to simulate different data for different ranges
        newData.attendanceRate = Math.floor(80 + Math.random() * 15)
        newData.avgMeetingRating = 3 + Math.random() * 2
        newData.taskCompletionRate = Math.floor(70 + Math.random() * 20)
        newData.productivityScore = Math.floor(75 + Math.random() * 20)
        
        // Update meeting counts based on range
        if (this.dateRange === 'day') {
          newData.keyMetrics.totalMeetingsThisMonth = Math.floor(3 + Math.random() * 5)
          newData.keyMetrics.totalMeetingHours = Math.floor(2 + Math.random() * 6)
        } else if (this.dateRange === 'week') {
          newData.keyMetrics.totalMeetingsThisMonth = Math.floor(20 + Math.random() * 15)
          newData.keyMetrics.totalMeetingHours = Math.floor(30 + Math.random() * 20)
        } else if (this.dateRange === 'month') {
          newData.keyMetrics.totalMeetingsThisMonth = Math.floor(100 + Math.random() * 40)
          newData.keyMetrics.totalMeetingHours = Math.floor(150 + Math.random() * 50)
        } else {
          newData.keyMetrics.totalMeetingsThisMonth = Math.floor(1200 + Math.random() * 300)
          newData.keyMetrics.totalMeetingHours = Math.floor(1800 + Math.random() * 400)
        }
        
        this.analyticsData = newData
        this.isLoading = false
      }, 800)
    },
    
    toggleSelectedMetric(metric) {
      const index = this.selectedMetrics.indexOf(metric)
      if (index === -1) {
        this.selectedMetrics.push(metric)
      } else {
        this.selectedMetrics.splice(index, 1)
      }
    },
    
    clearSelectedMetrics() {
      this.selectedMetrics = []
    },
    
    // Simulate API call for personalized insights
    getPersonalizedInsights() {
      // These would normally come from an AI analysis of the user's meeting patterns
      return [
        'You spend 35% more time in meetings than the average team member',
        'Tuesday mornings are your most productive meeting times',
        'Meetings longer than 1 hour have a 40% lower engagement rate',
        'Consider scheduling more focus time blocks on Wednesdays',
        'Your meeting attendance rate is 12% higher than last month'
      ]
    }
  }
})