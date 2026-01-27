package com.edunexus.android.core.model

import kotlinx.serialization.Serializable

@Serializable
data class HostelAllocation(
    val id: String,
    val studentId: String,
    val roomId: String,
    val bedNo: String? = null,
    val joinDate: String,
    val leaveDate: String? = null,
    val isActive: Boolean = true,
    val createdAt: String,
    val updatedAt: String
)
