package com.edunexus.android.core.model

import kotlinx.serialization.Serializable

@Serializable
data class GeneratedReport(
    val id: String,
    val templateId: String? = null,
    val name: String,
    val module: String,
    val parameters: String? = null,
    val fileUrl: String? = null,
    val generatedBy: String,
    val createdAt: String
)
