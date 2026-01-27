package com.edunexus.android.core.model.enums

import kotlinx.serialization.Serializable

@Serializable
enum class LeaveType {
    CASUAL,
    SICK,
    EARNED,
    MATERNITY,
    PATERNITY,
    UNPAID
}
