package com.edunexus.android.core.model

import kotlinx.serialization.Serializable

@Serializable
data class Class(
    val id: String,
    val name: String,
    val numericValue: Int,
    val academicYearId: String,
    val classTeacherId: String? = null,
    val roomNo: String? = null,
    val capacity: Int = 40,
    val createdAt: String,
    val updatedAt: String
)
