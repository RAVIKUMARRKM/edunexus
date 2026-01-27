package com.edunexus.android.core.model.enums

import kotlinx.serialization.Serializable

@Serializable
enum class POStatus {
    DRAFT,
    PENDING_APPROVAL,
    APPROVED,
    ORDERED,
    RECEIVED,
    CANCELLED
}
