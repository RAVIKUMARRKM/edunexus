package com.edunexus.android.core.model.enums

import kotlinx.serialization.Serializable

@Serializable
enum class ConcessionType {
    SCHOLARSHIP,
    SIBLING_DISCOUNT,
    STAFF_WARD,
    MERIT_BASED,
    FINANCIAL_AID,
    OTHER
}
