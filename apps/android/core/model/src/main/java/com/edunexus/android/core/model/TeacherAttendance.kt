package com.edunexus.android.core.model

import com.edunexus.android.core.model.enums.AttendanceStatus
import kotlinx.serialization.Serializable

@Serializable
data class TeacherAttendance(
    val id: String,
    val teacherId: String,
    val date: String,
    val status: AttendanceStatus,
    val inTime: String? = null,
    val outTime: String? = null,
    val remarks: String? = null,
    val createdAt: String
)
