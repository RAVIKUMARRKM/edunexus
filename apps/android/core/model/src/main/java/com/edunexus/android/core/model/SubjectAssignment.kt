package com.edunexus.android.core.model

import kotlinx.serialization.Serializable

@Serializable
data class SubjectAssignment(
    val id: String,
    val subjectId: String,
    val teacherId: String,
    val createdAt: String
)
