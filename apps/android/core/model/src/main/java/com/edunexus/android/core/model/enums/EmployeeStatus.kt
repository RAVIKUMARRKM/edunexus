package com.edunexus.android.core.model.enums

import kotlinx.serialization.Serializable

@Serializable
enum class EmployeeStatus {
    ACTIVE,
    ON_LEAVE,
    RESIGNED,
    TERMINATED
}
