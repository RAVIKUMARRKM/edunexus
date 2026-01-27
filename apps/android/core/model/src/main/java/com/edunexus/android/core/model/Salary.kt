package com.edunexus.android.core.model

import com.edunexus.android.core.model.enums.PaymentMode
import com.edunexus.android.core.model.enums.SalaryStatus
import kotlinx.serialization.Serializable

@Serializable
data class Salary(
    val id: String,
    val staffId: String,
    val month: String,
    val basicSalary: Double,
    val hra: Double = 0.0,
    val da: Double = 0.0,
    val ta: Double = 0.0,
    val otherAllowances: Double = 0.0,
    val grossSalary: Double,
    val pf: Double = 0.0,
    val tax: Double = 0.0,
    val otherDeductions: Double = 0.0,
    val totalDeductions: Double,
    val netSalary: Double,
    val status: SalaryStatus = SalaryStatus.PENDING,
    val paidAt: String? = null,
    val paymentMode: PaymentMode? = null,
    val transactionId: String? = null,
    val createdAt: String,
    val updatedAt: String
)
