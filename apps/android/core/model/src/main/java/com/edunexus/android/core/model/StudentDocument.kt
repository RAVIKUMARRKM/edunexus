package com.edunexus.android.core.model

import kotlinx.serialization.Serializable

@Serializable
data class StudentDocument(
    val id: String,
    val studentId: String,
    val name: String,
    val type: String,
    val fileUrl: String,
    val uploadedAt: String
)
