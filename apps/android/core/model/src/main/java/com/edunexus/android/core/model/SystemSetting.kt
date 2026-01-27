package com.edunexus.android.core.model

import kotlinx.serialization.Serializable

@Serializable
data class SystemSetting(
    val id: String,
    val key: String,
    val value: String,
    val category: String,
    val createdAt: String,
    val updatedAt: String
)
