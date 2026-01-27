package com.edunexus.android.core.model

import kotlinx.serialization.Serializable

@Serializable
data class TimetableSlot(
    val id: String,
    val sectionId: String,
    val subjectId: String,
    val teacherId: String,
    val dayOfWeek: Int,
    val startTime: String,
    val endTime: String,
    val roomNo: String? = null,
    val createdAt: String,
    val updatedAt: String
)
