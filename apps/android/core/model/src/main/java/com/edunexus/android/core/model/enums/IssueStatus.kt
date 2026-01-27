package com.edunexus.android.core.model.enums

import kotlinx.serialization.Serializable

@Serializable
enum class IssueStatus {
    ISSUED,
    RETURNED,
    LOST,
    DAMAGED
}
