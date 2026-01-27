package com.edunexus.android.core.model.enums

import kotlinx.serialization.Serializable

@Serializable
enum class PaymentMode {
    CASH,
    CARD,
    UPI,
    NET_BANKING,
    CHEQUE,
    DD
}
