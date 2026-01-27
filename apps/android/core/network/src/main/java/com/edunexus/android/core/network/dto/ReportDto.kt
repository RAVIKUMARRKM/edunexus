package com.edunexus.android.core.network.dto

import com.google.gson.annotations.SerializedName

/**
 * Report Data Transfer Objects
 */

/**
 * Report Type Enumeration
 */
enum class ReportType {
    @SerializedName("STUDENTS")
    STUDENTS,
    @SerializedName("TEACHERS")
    TEACHERS,
    @SerializedName("ATTENDANCE")
    ATTENDANCE,
    @SerializedName("FEES")
    FEES,
    @SerializedName("EXAMS")
    EXAMS,
    @SerializedName("LIBRARY")
    LIBRARY
}

/**
 * Report Category Enumeration
 */
enum class ReportCategory {
    @SerializedName("ANALYTICS")
    ANALYTICS,
    @SerializedName("PERFORMANCE")
    PERFORMANCE,
    @SerializedName("FINANCIAL")
    FINANCIAL,
    @SerializedName("OPERATIONAL")
    OPERATIONAL
}

/**
 * Report DTO
 */
data class ReportDto(
    @SerializedName("id")
    val id: String,
    @SerializedName("title")
    val title: String,
    @SerializedName("description")
    val description: String?,
    @SerializedName("type")
    val type: ReportType,
    @SerializedName("category")
    val category: ReportCategory,
    @SerializedName("generatedBy")
    val generatedBy: String?,
    @SerializedName("generatedAt")
    val generatedAt: String,
    @SerializedName("data")
    val data: Map<String, Any>?,
    @SerializedName("filters")
    val filters: ReportFilters?,
    @SerializedName("summary")
    val summary: ReportSummary?
)

/**
 * Report Filters
 */
data class ReportFilters(
    @SerializedName("startDate")
    val startDate: String?,
    @SerializedName("endDate")
    val endDate: String?,
    @SerializedName("classId")
    val classId: String?,
    @SerializedName("sectionId")
    val sectionId: String?,
    @SerializedName("departmentId")
    val departmentId: String?
)

/**
 * Report Summary
 */
data class ReportSummary(
    @SerializedName("totalRecords")
    val totalRecords: Int,
    @SerializedName("keyMetrics")
    val keyMetrics: Map<String, String>?
)
