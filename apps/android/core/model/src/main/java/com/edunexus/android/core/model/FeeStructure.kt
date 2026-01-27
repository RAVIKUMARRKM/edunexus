package com.edunexus.android.core.model

import com.edunexus.android.core.model.enums.FeeFrequency
import com.edunexus.android.core.model.enums.FeeType
import kotlinx.serialization.Serializable

@Serializable
data class FeeStructure(
    val id: String,
    val name: String,
    val academicYearId: String,
    val classId: String? = null,
    val feeType: FeeType,
    val amount: Double,
    val frequency: FeeFrequency,
    val dueDay: Int = 10,
    val lateFee: Double = 0.0,
    val isOptional: Boolean = false,
    val createdAt: String,
    val updatedAt: String
)
