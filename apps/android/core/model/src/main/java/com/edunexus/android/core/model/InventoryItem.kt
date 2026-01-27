package com.edunexus.android.core.model

import kotlinx.serialization.Serializable

@Serializable
data class InventoryItem(
    val id: String,
    val name: String,
    val code: String,
    val categoryId: String,
    val description: String? = null,
    val unit: String,
    val quantity: Int = 0,
    val minQuantity: Int = 10,
    val price: Double,
    val location: String? = null,
    val createdAt: String,
    val updatedAt: String
)
