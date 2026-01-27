package com.edunexus.android.core.model.enums

import kotlinx.serialization.Serializable

@Serializable
enum class AttendanceStatus {
    PRESENT,
    ABSENT,
    LATE,
    HALF_DAY,
    LEAVE
}
