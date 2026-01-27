package com.edunexus.android.core.network.dto

import com.google.gson.annotations.SerializedName

/**
 * Dashboard stats DTO for network responses
 */
data class DashboardStatsDto(
    @SerializedName("totalStudents")
    val totalStudents: Int,
    @SerializedName("totalTeachers")
    val totalTeachers: Int,
    @SerializedName("totalClasses")
    val totalClasses: Int,
    @SerializedName("totalParents")
    val totalParents: Int,
    @SerializedName("presentToday")
    val presentToday: Int,
    @SerializedName("absentToday")
    val absentToday: Int,
    @SerializedName("attendancePercentage")
    val attendancePercentage: Float,
    @SerializedName("pendingFees")
    val pendingFees: Float,
    @SerializedName("totalFees")
    val totalFees: Float,
    @SerializedName("collectedFees")
    val collectedFees: Float,
    @SerializedName("upcomingExams")
    val upcomingExams: Int,
    @SerializedName("recentNotices")
    val recentNotices: Int,
    @SerializedName("unreadMessages")
    val unreadMessages: Int,
    @SerializedName("libraryBooks")
    val libraryBooks: Int,
    @SerializedName("issuedBooks")
    val issuedBooks: Int
)
