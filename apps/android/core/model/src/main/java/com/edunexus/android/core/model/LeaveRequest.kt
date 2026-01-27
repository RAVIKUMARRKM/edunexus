package com.edunexus.android.core.model

import com.edunexus.android.core.model.enums.LeaveStatus
import com.edunexus.android.core.model.enums.LeaveType
import kotlinx.serialization.Serializable

@Serializable
data class LeaveRequest(
    val id: String,
    val teacherId: String? = null,
    val staffId: String? = null,
    val leaveType: LeaveType,
    val startDate: String,
    val endDate: String,
    val days: Int,
    val reason: String,
    val status: LeaveStatus = LeaveStatus.PENDING,
    val approvedBy: String? = null,
    val approvedAt: String? = null,
    val remarks: String? = null,
    val createdAt: String,
    val updatedAt: String
)
