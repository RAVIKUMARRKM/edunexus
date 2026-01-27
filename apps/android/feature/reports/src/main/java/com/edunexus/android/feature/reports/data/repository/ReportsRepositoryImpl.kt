package com.edunexus.android.feature.reports.data.repository

import com.edunexus.android.core.network.dto.ReportCategory
import com.edunexus.android.core.network.dto.ReportDto
import com.edunexus.android.core.network.dto.ReportFilters
import com.edunexus.android.core.network.dto.ReportSummary
import com.edunexus.android.core.network.dto.ReportType
import kotlinx.coroutines.delay
import javax.inject.Inject

class ReportsRepositoryImpl @Inject constructor() : ReportsRepository {

    private var cachedReports: List<ReportDto>? = null

    override suspend fun getReports(): Result<List<ReportDto>> {
        return try {
            delay(500)
            val reports = getMockReports()
            cachedReports = reports
            Result.success(reports)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getReportsByType(type: ReportType): Result<List<ReportDto>> {
        return try {
            delay(300)
            val allReports = cachedReports ?: getMockReports()
            val filtered = allReports.filter { it.type == type }
            Result.success(filtered)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getReport(id: String): Result<ReportDto> {
        return try {
            delay(200)
            val report = (cachedReports ?: getMockReports()).find { it.id == id }
            if (report != null) {
                Result.success(report)
            } else {
                Result.failure(Exception("Report not found"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun generateReport(type: ReportType, filters: Map<String, String>): Result<ReportDto> {
        return try {
            delay(1000)
            val newReport = ReportDto(
                id = "new_${System.currentTimeMillis()}",
                title = "Generated ${type.name} Report",
                description = "Custom report generated with filters",
                type = type,
                category = when (type) {
                    ReportType.STUDENTS, ReportType.TEACHERS -> ReportCategory.ANALYTICS
                    ReportType.ATTENDANCE -> ReportCategory.OPERATIONAL
                    ReportType.FEES -> ReportCategory.FINANCIAL
                    ReportType.EXAMS -> ReportCategory.PERFORMANCE
                    ReportType.LIBRARY -> ReportCategory.OPERATIONAL
                },
                generatedBy = "Current User",
                generatedAt = "2026-01-28T10:00:00",
                data = emptyMap(),
                filters = ReportFilters(
                    startDate = filters["startDate"],
                    endDate = filters["endDate"],
                    classId = filters["classId"],
                    sectionId = filters["sectionId"],
                    departmentId = filters["departmentId"]
                ),
                summary = ReportSummary(totalRecords = 0, keyMetrics = emptyMap())
            )
            Result.success(newReport)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    private fun getMockReports(): List<ReportDto> = listOf(
        ReportDto("rep_001", "Student Enrollment Report", "Complete overview of student enrollment", ReportType.STUDENTS, ReportCategory.ANALYTICS, "Admin", "2026-01-28T10:30:00", null, null, ReportSummary(1250, mapOf("Active" to "1200", "Inactive" to "50"))),
        ReportDto("rep_002", "Student Demographics Report", "Demographic analysis of students", ReportType.STUDENTS, ReportCategory.ANALYTICS, "Admin", "2026-01-27T15:45:00", null, null, ReportSummary(1250, mapOf("Male" to "650", "Female" to "600"))),
        ReportDto("rep_003", "Teacher Performance Report", "Performance metrics of teaching staff", ReportType.TEACHERS, ReportCategory.PERFORMANCE, "Principal", "2026-01-28T09:00:00", null, null, ReportSummary(75, mapOf("Excellent" to "45", "Good" to "25"))),
        ReportDto("rep_004", "Teacher Attendance Report", "Monthly attendance summary of teachers", ReportType.TEACHERS, ReportCategory.OPERATIONAL, "HR Manager", "2026-01-28T08:30:00", null, null, ReportSummary(75, mapOf("Present Days" to "22", "Absent Days" to "1"))),
        ReportDto("rep_005", "Student Attendance Summary", "Monthly student attendance statistics", ReportType.ATTENDANCE, ReportCategory.OPERATIONAL, "Admin", "2026-01-28T11:00:00", null, null, ReportSummary(1250, mapOf("Avg Attendance" to "92.3%", "Perfect" to "380"))),
        ReportDto("rep_006", "Class-wise Attendance Report", "Attendance analysis by class", ReportType.ATTENDANCE, ReportCategory.ANALYTICS, "Academic Head", "2026-01-27T14:20:00", null, null, ReportSummary(25, mapOf("Best" to "Class 10-A (98%)", "Low" to "Class 6-B (85%)"))),
        ReportDto("rep_007", "Fee Collection Report", "Monthly fee collection status", ReportType.FEES, ReportCategory.FINANCIAL, "Accounts", "2026-01-28T12:00:00", null, null, ReportSummary(1250, mapOf("Collected" to "Rs. 25L", "Outstanding" to "Rs. 3.5L"))),
        ReportDto("rep_008", "Outstanding Fees Report", "Students with pending payments", ReportType.FEES, ReportCategory.FINANCIAL, "Accounts", "2026-01-28T13:30:00", null, null, ReportSummary(156, mapOf("Total Due" to "Rs. 3.5L", "Avg Due" to "Rs. 2,244"))),
        ReportDto("rep_009", "Exam Performance Report", "Overall student performance analysis", ReportType.EXAMS, ReportCategory.PERFORMANCE, "Academic", "2026-01-28T10:00:00", null, null, ReportSummary(1200, mapOf("Avg Score" to "78.5%", "Pass Rate" to "94.2%"))),
        ReportDto("rep_010", "Subject-wise Performance", "Performance analysis by subject", ReportType.EXAMS, ReportCategory.ANALYTICS, "Academic Head", "2026-01-27T16:00:00", null, null, ReportSummary(12, mapOf("Best" to "Math (85%)", "Focus" to "Physics (68%)"))),
        ReportDto("rep_011", "Library Usage Report", "Book circulation statistics", ReportType.LIBRARY, ReportCategory.OPERATIONAL, "Librarian", "2026-01-28T09:30:00", null, null, ReportSummary(450, mapOf("Issued" to "450", "Returned" to "420", "Overdue" to "30"))),
        ReportDto("rep_012", "Library Inventory Report", "Current book inventory status", ReportType.LIBRARY, ReportCategory.ANALYTICS, "Librarian", "2026-01-28T11:30:00", null, null, ReportSummary(5000, mapOf("Total" to "5000", "Available" to "4550", "Issued" to "450")))
    )
}
