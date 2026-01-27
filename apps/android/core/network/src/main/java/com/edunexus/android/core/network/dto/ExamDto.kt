package com.edunexus.android.core.network.dto

import com.google.gson.annotations.SerializedName

/**
 * Exam DTO for network responses
 */
data class ExamDto(
    @SerializedName("id")
    val id: String,
    @SerializedName("name")
    val name: String,
    @SerializedName("type")
    val type: String,
    @SerializedName("startDate")
    val startDate: String,
    @SerializedName("endDate")
    val endDate: String,
    @SerializedName("description")
    val description: String? = null,
    @SerializedName("status")
    val status: String,
    @SerializedName("createdAt")
    val createdAt: String? = null,
    @SerializedName("updatedAt")
    val updatedAt: String? = null
)

/**
 * Exam result DTO for network responses
 */
data class ExamResultDto(
    @SerializedName("id")
    val id: String,
    @SerializedName("examId")
    val examId: String,
    @SerializedName("studentId")
    val studentId: String,
    @SerializedName("subjectId")
    val subjectId: String,
    @SerializedName("marksObtained")
    val marksObtained: Float,
    @SerializedName("totalMarks")
    val totalMarks: Float,
    @SerializedName("grade")
    val grade: String? = null,
    @SerializedName("remarks")
    val remarks: String? = null,
    @SerializedName("createdAt")
    val createdAt: String? = null,
    @SerializedName("updatedAt")
    val updatedAt: String? = null,
    @SerializedName("exam")
    val exam: ExamDto? = null,
    @SerializedName("student")
    val student: StudentDto? = null,
    @SerializedName("subject")
    val subject: SubjectDto? = null
)

/**
 * Subject DTO
 */
data class SubjectDto(
    @SerializedName("id")
    val id: String,
    @SerializedName("name")
    val name: String,
    @SerializedName("code")
    val code: String,
    @SerializedName("description")
    val description: String? = null
)
