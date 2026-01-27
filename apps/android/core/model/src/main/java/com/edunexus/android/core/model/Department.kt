package com.edunexus.android.core.model

import kotlinx.serialization.Serializable

@Serializable
data class Department(
    val id: String,
    val name: String,
    val code: String,
    val headId: String? = null,
    val description: String? = null,
    val createdAt: String,
    val updatedAt: String
)
