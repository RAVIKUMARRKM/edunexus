package com.edunexus.android.feature.dashboard.data.repository

import com.edunexus.android.core.network.ApiService
import com.edunexus.android.feature.dashboard.data.model.DashboardStats
import com.edunexus.android.feature.dashboard.data.model.RecentActivity
import com.edunexus.android.feature.dashboard.data.model.ActivityType
import kotlinx.coroutines.delay
import javax.inject.Inject

/**
 * Implementation of DashboardRepository
 */
class DashboardRepositoryImpl @Inject constructor(
    private val apiService: ApiService
) : DashboardRepository {

    override suspend fun getDashboardStats(): Result<DashboardStats> {
        return try {
            // For now, return placeholder data as API might not be fully ready
            // TODO: Replace with actual API call when backend is ready
            // val response = apiService.getDashboardStats()
            // if (response.isSuccessful && response.body() != null) {
            //     val dto = response.body()!!
            //     Result.success(dto.toDomainModel())
            // } else {
            //     Result.failure(Exception(response.message()))
            // }

            // Simulate network delay
            delay(500)

            // Return mock data for now
            Result.success(getMockDashboardStats())
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    /**
     * Mock dashboard stats for development
     * TODO: Remove when API is integrated
     */
    private fun getMockDashboardStats(): DashboardStats {
        return DashboardStats(
            totalStudents = 1250,
            totalTeachers = 85,
            totalClasses = 42,
            totalParents = 1180,
            presentToday = 1150,
            absentToday = 100,
            attendancePercentage = 92.0f,
            pendingFees = 125000f,
            totalFees = 500000f,
            collectedFees = 375000f,
            upcomingExams = 5,
            recentNotices = 3,
            unreadMessages = 12,
            libraryBooks = 5000,
            issuedBooks = 450,
            recentActivities = listOf(
                RecentActivity(
                    id = "1",
                    message = "New student admission: Rahul Sharma in Class 10-A",
                    timestamp = "2 hours ago",
                    type = ActivityType.SUCCESS
                ),
                RecentActivity(
                    id = "2",
                    message = "Fee payment received from Priya Singh - Rs. 15,000",
                    timestamp = "3 hours ago",
                    type = ActivityType.SUCCESS
                ),
                RecentActivity(
                    id = "3",
                    message = "Mid-term exam schedule published for all classes",
                    timestamp = "5 hours ago",
                    type = ActivityType.INFO
                ),
                RecentActivity(
                    id = "4",
                    message = "Parent-teacher meeting scheduled for 30th Jan",
                    timestamp = "1 day ago",
                    type = ActivityType.INFO
                ),
                RecentActivity(
                    id = "5",
                    message = "Library books returned by Amit Kumar",
                    timestamp = "1 day ago",
                    type = ActivityType.SUCCESS
                )
            )
        )
    }
}
