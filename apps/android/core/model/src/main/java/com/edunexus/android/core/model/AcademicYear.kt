package com.edunexus.android.core.model

import kotlinx.serialization.Serializable

@Serializable
data class AcademicYear(
    val id: String,
    val name: String,
    val startDate: String,
    val endDate: String,
    val isCurrent: Boolean = false,
    val createdAt: String,
    val updatedAt: String
)
