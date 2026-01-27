package com.edunexus.android.core.model.enums

import kotlinx.serialization.Serializable

@Serializable
enum class SalaryStatus {
    PENDING,
    PROCESSED,
    PAID,
    HOLD
}
