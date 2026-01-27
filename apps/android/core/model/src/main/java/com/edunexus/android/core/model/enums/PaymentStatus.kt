package com.edunexus.android.core.model.enums

import kotlinx.serialization.Serializable

@Serializable
enum class PaymentStatus {
    PENDING,
    COMPLETED,
    FAILED,
    REFUNDED
}
