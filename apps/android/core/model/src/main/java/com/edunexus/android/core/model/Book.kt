package com.edunexus.android.core.model

import kotlinx.serialization.Serializable

@Serializable
data class Book(
    val id: String,
    val isbn: String? = null,
    val title: String,
    val author: String,
    val publisher: String? = null,
    val edition: String? = null,
    val category: String,
    val subject: String? = null,
    val language: String = "English",
    val pages: Int? = null,
    val price: Double? = null,
    val quantity: Int = 1,
    val availableQty: Int = 1,
    val shelfLocation: String? = null,
    val coverImage: String? = null,
    val description: String? = null,
    val createdAt: String,
    val updatedAt: String
)
