package com.edunexus.android.core.model

import kotlinx.serialization.Serializable

@Serializable
data class StudentParent(
    val id: String,
    val studentId: String,
    val parentId: String,
    val relation: String,
    val isPrimary: Boolean = false
)
