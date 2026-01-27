package com.edunexus.android.core.model

import com.edunexus.android.core.model.enums.AttendanceStatus
import kotlinx.serialization.Serializable

@Serializable
data class StudentAttendance(
    val id: String,
    val studentId: String,
    val date: String,
    val status: AttendanceStatus,
    val remarks: String? = null,
    val markedBy: String? = null,
    val createdAt: String
)
