package com.edunexus.android.core.network.dto

import com.google.gson.annotations.SerializedName

/**
 * Fee status DTO for network responses
 */
data class FeeStatusDto(
    @SerializedName("studentId")
    val studentId: String,
    @SerializedName("totalFee")
    val totalFee: Float,
    @SerializedName("paidAmount")
    val paidAmount: Float,
    @SerializedName("dueAmount")
    val dueAmount: Float,
    @SerializedName("lastPaymentDate")
    val lastPaymentDate: String? = null,
    @SerializedName("nextDueDate")
    val nextDueDate: String? = null,
    @SerializedName("status")
    val status: String,
    @SerializedName("student")
    val student: StudentDto? = null
)

/**
 * Fee payment DTO for network responses
 */
data class FeePaymentDto(
    @SerializedName("id")
    val id: String,
    @SerializedName("studentId")
    val studentId: String,
    @SerializedName("amount")
    val amount: Float,
    @SerializedName("paymentDate")
    val paymentDate: String,
    @SerializedName("paymentMethod")
    val paymentMethod: String,
    @SerializedName("transactionId")
    val transactionId: String? = null,
    @SerializedName("remarks")
    val remarks: String? = null,
    @SerializedName("receiptNumber")
    val receiptNumber: String? = null,
    @SerializedName("createdAt")
    val createdAt: String? = null,
    @SerializedName("updatedAt")
    val updatedAt: String? = null,
    @SerializedName("student")
    val student: StudentDto? = null
)

/**
 * Make payment request DTO
 */
data class MakePaymentRequest(
    @SerializedName("studentId")
    val studentId: String,
    @SerializedName("amount")
    val amount: Float,
    @SerializedName("paymentMethod")
    val paymentMethod: String,
    @SerializedName("transactionId")
    val transactionId: String? = null,
    @SerializedName("remarks")
    val remarks: String? = null
)
