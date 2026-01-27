package com.edunexus.android.core.model

import com.edunexus.android.core.model.enums.ConcessionType
import kotlinx.serialization.Serializable

@Serializable
data class FeeConcession(
    val id: String,
    val studentId: String,
    val feeStructureId: String,
    val concessionType: ConcessionType,
    val amount: Double,
    val percentage: Double? = null,
    val reason: String? = null,
    val approvedBy: String? = null,
    val validFrom: String,
    val validTo: String,
    val createdAt: String,
    val updatedAt: String
)
