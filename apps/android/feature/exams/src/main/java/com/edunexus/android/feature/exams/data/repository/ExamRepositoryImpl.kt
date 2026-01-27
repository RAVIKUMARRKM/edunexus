package com.edunexus.android.feature.exams.data.repository

import com.edunexus.android.core.network.ApiService
import com.edunexus.android.core.network.dto.ExamDto
import com.edunexus.android.core.network.dto.ExamResultDto
import javax.inject.Inject

/**
 * Implementation of ExamRepository using ApiService
 */
class ExamRepositoryImpl @Inject constructor(
    private val apiService: ApiService
) : ExamRepository {

    override suspend fun getExams(
        status: String?,
        type: String?,
        search: String?
    ): Result<List<ExamDto>> {
        return try {
            val params = buildMap {
                status?.let { put("status", it) }
                type?.let { put("type", it) }
                search?.let { put("search", it) }
            }

            val response = apiService.getExams(params)
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Failed to fetch exams: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getExam(id: String): Result<ExamDto> {
        return try {
            val response = apiService.getExam(id)
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Failed to fetch exam: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getExamResults(examId: String): Result<List<ExamResultDto>> {
        return try {
            val response = apiService.getExamResults(examId)
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Failed to fetch exam results: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getStudentExamResults(studentId: String): Result<List<ExamResultDto>> {
        return try {
            val response = apiService.getStudentExamResults(studentId)
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Failed to fetch student exam results: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
