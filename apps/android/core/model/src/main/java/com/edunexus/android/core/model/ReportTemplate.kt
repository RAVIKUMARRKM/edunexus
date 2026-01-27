package com.edunexus.android.core.model

import kotlinx.serialization.Serializable

@Serializable
data class ReportTemplate(
    val id: String,
    val name: String,
    val description: String? = null,
    val module: String,
    val query: String,
    val columns: String,
    val filters: String? = null,
    val isSystem: Boolean = false,
    val createdBy: String? = null,
    val createdAt: String,
    val updatedAt: String
)
