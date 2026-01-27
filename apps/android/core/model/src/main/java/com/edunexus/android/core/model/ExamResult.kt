package com.edunexus.android.core.model

import kotlinx.serialization.Serializable

@Serializable
data class ExamResult(
    val id: String,
    val examId: String,
    val studentId: String,
    val subjectId: String,
    val marksObtained: Double,
    val grade: String? = null,
    val remarks: String? = null,
    val isAbsent: Boolean = false,
    val createdAt: String,
    val updatedAt: String
)
