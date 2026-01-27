package com.edunexus.android.feature.fees.data.repository

import com.edunexus.android.core.network.dto.FeePaymentDto
import com.edunexus.android.core.network.dto.FeeStatusDto
import com.edunexus.android.core.network.dto.MakePaymentRequest

/**
 * Repository interface for Fee operations
 */
interface FeeRepository {
    /**
     * Get all fee statuses with optional filters
     * @param status Filter by payment status (PAID, PENDING, OVERDUE)
     * @param search Search by student name or admission number
     */
    suspend fun getAllFeeStatuses(
        status: String? = null,
        search: String? = null
    ): Result<List<FeeStatusDto>>

    /**
     * Get fee status for a specific student
     */
    suspend fun getFeeStatus(studentId: String): Result<FeeStatusDto>

    /**
     * Get payment history for a specific student
     */
    suspend fun getPaymentHistory(studentId: String): Result<List<FeePaymentDto>>

    /**
     * Make a payment
     */
    suspend fun makePayment(request: MakePaymentRequest): Result<FeePaymentDto>
}
