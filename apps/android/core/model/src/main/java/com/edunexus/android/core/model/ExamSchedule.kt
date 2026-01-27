package com.edunexus.android.core.model

import kotlinx.serialization.Serializable

@Serializable
data class ExamSchedule(
    val id: String,
    val examId: String,
    val subjectId: String,
    val date: String,
    val startTime: String,
    val endTime: String,
    val roomNo: String? = null,
    val createdAt: String
)
