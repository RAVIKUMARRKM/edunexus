package com.edunexus.android.feature.dashboard.data.repository

import com.edunexus.android.feature.dashboard.data.model.DashboardStats

/**
 * Repository interface for dashboard operations
 */
interface DashboardRepository {
    /**
     * Get dashboard statistics
     * @return DashboardStats or null if failed
     */
    suspend fun getDashboardStats(): Result<DashboardStats>
}
