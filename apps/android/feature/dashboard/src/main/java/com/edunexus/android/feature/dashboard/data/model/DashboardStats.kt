package com.edunexus.android.feature.dashboard.data.model

/**
 * Dashboard statistics domain model
 */
data class DashboardStats(
    val totalStudents: Int = 0,
    val totalTeachers: Int = 0,
    val totalClasses: Int = 0,
    val totalParents: Int = 0,
    val presentToday: Int = 0,
    val absentToday: Int = 0,
    val attendancePercentage: Float = 0f,
    val pendingFees: Float = 0f,
    val totalFees: Float = 0f,
    val collectedFees: Float = 0f,
    val upcomingExams: Int = 0,
    val recentNotices: Int = 0,
    val unreadMessages: Int = 0,
    val libraryBooks: Int = 0,
    val issuedBooks: Int = 0,
    val recentActivities: List<RecentActivity> = emptyList()
)

/**
 * Recent activity item for dashboard
 */
data class RecentActivity(
    val id: String,
    val message: String,
    val timestamp: String,
    val type: ActivityType = ActivityType.INFO
)

/**
 * Activity type enum
 */
enum class ActivityType {
    INFO,
    SUCCESS,
    WARNING,
    ERROR
}
