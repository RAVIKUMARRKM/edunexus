package com.edunexus.android.feature.fees.data.repository

import com.edunexus.android.core.network.ApiService
import com.edunexus.android.core.network.dto.FeePaymentDto
import com.edunexus.android.core.network.dto.FeeStatusDto
import com.edunexus.android.core.network.dto.MakePaymentRequest
import javax.inject.Inject

/**
 * Implementation of FeeRepository using ApiService
 */
class FeeRepositoryImpl @Inject constructor(
    private val apiService: ApiService
) : FeeRepository {

    override suspend fun getAllFeeStatuses(
        status: String?,
        search: String?
    ): Result<List<FeeStatusDto>> {
        return try {
            // Since there's no dedicated endpoint for all fee statuses,
            // we'll fetch all students and get their fee statuses
            val studentsResponse = apiService.getStudents(emptyMap())
            
            if (studentsResponse.isSuccessful && studentsResponse.body() != null) {
                val students = studentsResponse.body()!!
                val feeStatuses = mutableListOf<FeeStatusDto>()
                
                // Fetch fee status for each student
                for (student in students) {
                    try {
                        val feeResponse = apiService.getFeeStatus(student.id)
                        if (feeResponse.isSuccessful && feeResponse.body() != null) {
                            var feeStatus = feeResponse.body()!!
                            // Add student info to fee status
                            feeStatus = feeStatus.copy(student = student)
                            feeStatuses.add(feeStatus)
                        }
                    } catch (e: Exception) {
                        // Skip this student if fee status fetch fails
                        continue
                    }
                }
                
                // Apply filters
                var filteredStatuses = feeStatuses
                
                // Filter by status
                if (status != null) {
                    filteredStatuses = filteredStatuses.filter { 
                        it.status.equals(status, ignoreCase = true)
                    }
                }
                
                // Filter by search query
                if (!search.isNullOrEmpty()) {
                    filteredStatuses = filteredStatuses.filter { feeStatus ->
                        val student = feeStatus.student
                        student != null && (
                            "${student.firstName} ${student.lastName}".contains(search, ignoreCase = true) ||
                            student.admissionNumber.contains(search, ignoreCase = true)
                        )
                    }
                }
                
                Result.success(filteredStatuses)
            } else {
                Result.failure(Exception("Failed to fetch fee statuses: ${studentsResponse.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getFeeStatus(studentId: String): Result<FeeStatusDto> {
        return try {
            val response = apiService.getFeeStatus(studentId)
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Failed to fetch fee status: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getPaymentHistory(studentId: String): Result<List<FeePaymentDto>> {
        return try {
            val response = apiService.getPaymentHistory(studentId)
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Failed to fetch payment history: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun makePayment(request: MakePaymentRequest): Result<FeePaymentDto> {
        return try {
            val response = apiService.makePayment(request)
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Failed to make payment: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
