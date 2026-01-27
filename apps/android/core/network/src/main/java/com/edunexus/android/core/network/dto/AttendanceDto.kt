package com.edunexus.android.core.network.dto

import com.google.gson.annotations.SerializedName

/**
 * Attendance DTO for network responses
 */
data class AttendanceDto(
    @SerializedName("id")
    val id: String,
    @SerializedName("date")
    val date: String,
    @SerializedName("studentId")
    val studentId: String,
    @SerializedName("classId")
    val classId: String,
    @SerializedName("sectionId")
    val sectionId: String,
    @SerializedName("status")
    val status: String,
    @SerializedName("remarks")
    val remarks: String? = null,
    @SerializedName("createdAt")
    val createdAt: String? = null,
    @SerializedName("updatedAt")
    val updatedAt: String? = null,
    @SerializedName("student")
    val student: StudentDto? = null
)

/**
 * Mark attendance request DTO
 */
data class MarkAttendanceRequest(
    @SerializedName("date")
    val date: String,
    @SerializedName("classId")
    val classId: String,
    @SerializedName("sectionId")
    val sectionId: String,
    @SerializedName("attendance")
    val attendance: List<AttendanceRecord>
)

/**
 * Individual attendance record
 */
data class AttendanceRecord(
    @SerializedName("studentId")
    val studentId: String,
    @SerializedName("status")
    val status: String,
    @SerializedName("remarks")
    val remarks: String? = null
)
