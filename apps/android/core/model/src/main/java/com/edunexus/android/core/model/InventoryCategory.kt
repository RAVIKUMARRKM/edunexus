package com.edunexus.android.core.model

import kotlinx.serialization.Serializable

@Serializable
data class InventoryCategory(
    val id: String,
    val name: String,
    val description: String? = null,
    val createdAt: String,
    val updatedAt: String
)
