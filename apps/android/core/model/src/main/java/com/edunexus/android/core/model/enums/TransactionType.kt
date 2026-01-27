package com.edunexus.android.core.model.enums

import kotlinx.serialization.Serializable

@Serializable
enum class TransactionType {
    PURCHASE,
    ISSUE,
    RETURN,
    ADJUSTMENT,
    DAMAGE
}
