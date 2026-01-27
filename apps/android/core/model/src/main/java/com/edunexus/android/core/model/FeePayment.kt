package com.edunexus.android.core.model

import com.edunexus.android.core.model.enums.PaymentMode
import com.edunexus.android.core.model.enums.PaymentStatus
import kotlinx.serialization.Serializable

@Serializable
data class FeePayment(
    val id: String,
    val receiptNo: String,
    val studentId: String,
    val feeStructureId: String,
    val amount: Double,
    val discount: Double = 0.0,
    val lateFee: Double = 0.0,
    val totalAmount: Double,
    val paidAmount: Double,
    val dueAmount: Double = 0.0,
    val paymentDate: String,
    val paymentMode: PaymentMode,
    val transactionId: String? = null,
    val forMonth: String,
    val status: PaymentStatus = PaymentStatus.COMPLETED,
    val remarks: String? = null,
    val receivedBy: String? = null,
    val createdAt: String,
    val updatedAt: String
)
