package com.edunexus.android.core.model

import kotlinx.serialization.Serializable

@Serializable
data class Section(
    val id: String,
    val name: String,
    val classId: String,
    val roomNo: String? = null,
    val capacity: Int = 40,
    val createdAt: String,
    val updatedAt: String
)
