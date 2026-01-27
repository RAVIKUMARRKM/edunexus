package com.edunexus.android.core.model.enums

import kotlinx.serialization.Serializable

@Serializable
enum class LeaveStatus {
    PENDING,
    APPROVED,
    REJECTED,
    CANCELLED
}
