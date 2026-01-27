package com.edunexus.android.core.model

import com.edunexus.android.core.model.enums.ExamType
import kotlinx.serialization.Serializable

@Serializable
data class Exam(
    val id: String,
    val name: String,
    val academicYearId: String,
    val classId: String,
    val examType: ExamType,
    val startDate: String,
    val endDate: String,
    val maxMarks: Int = 100,
    val passingMarks: Int = 33,
    val isPublished: Boolean = false,
    val createdAt: String,
    val updatedAt: String
)
