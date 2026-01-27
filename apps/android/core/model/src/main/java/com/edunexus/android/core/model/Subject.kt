package com.edunexus.android.core.model

import com.edunexus.android.core.model.enums.SubjectType
import kotlinx.serialization.Serializable

@Serializable
data class Subject(
    val id: String,
    val name: String,
    val code: String,
    val classId: String,
    val type: SubjectType = SubjectType.THEORY,
    val isOptional: Boolean = false,
    val createdAt: String,
    val updatedAt: String
)
