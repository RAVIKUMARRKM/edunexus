package com.edunexus.android.core.model.enums

import kotlinx.serialization.Serializable

@Serializable
enum class FeeFrequency {
    ONE_TIME,
    MONTHLY,
    QUARTERLY,
    HALF_YEARLY,
    YEARLY
}
