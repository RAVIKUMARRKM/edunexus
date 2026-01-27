package com.edunexus.android.feature.reports.data.repository

import com.edunexus.android.core.network.dto.ReportDto
import com.edunexus.android.core.network.dto.ReportType

/**
 * Repository interface for Reports operations
 */
interface ReportsRepository {
    /**
     * Get all reports
     */
    suspend fun getReports(): Result<List<ReportDto>>

    /**
     * Get reports filtered by type
     */
    suspend fun getReportsByType(type: ReportType): Result<List<ReportDto>>

    /**
     * Get a single report by ID
     */
    suspend fun getReport(id: String): Result<ReportDto>

    /**
     * Generate a new report
     */
    suspend fun generateReport(
        type: ReportType,
        filters: Map<String, String>
    ): Result<ReportDto>
}
