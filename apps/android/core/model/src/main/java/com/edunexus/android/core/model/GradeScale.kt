package com.edunexus.android.core.model

import kotlinx.serialization.Serializable

@Serializable
data class GradeScale(
    val id: String,
    val name: String,
    val minPercent: Double,
    val maxPercent: Double,
    val gradePoint: Double,
    val remarks: String? = null,
    val createdAt: String
)
