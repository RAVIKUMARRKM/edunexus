package com.edunexus.android.core.model.enums

import kotlinx.serialization.Serializable

@Serializable
enum class StudentStatus {
    ACTIVE,
    INACTIVE,
    LEFT,
    GRADUATED,
    SUSPENDED
}
