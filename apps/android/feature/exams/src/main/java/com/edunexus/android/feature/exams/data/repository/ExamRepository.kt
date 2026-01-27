package com.edunexus.android.feature.exams.data.repository

import com.edunexus.android.core.network.dto.ExamDto
import com.edunexus.android.core.network.dto.ExamResultDto

/**
 * Repository interface for Exam operations
 */
interface ExamRepository {
    /**
     * Get all exams with optional filters
     * @param status Filter by exam status (UPCOMING, COMPLETED, CANCELLED)
     * @param type Filter by exam type
     * @param search Search by name
     */
    suspend fun getExams(
        status: String? = null,
        type: String? = null,
        search: String? = null
    ): Result<List<ExamDto>>

    /**
     * Get a single exam by ID
     */
    suspend fun getExam(id: String): Result<ExamDto>

    /**
     * Get exam results for a specific exam
     */
    suspend fun getExamResults(examId: String): Result<List<ExamResultDto>>

    /**
     * Get exam results for a specific student
     */
    suspend fun getStudentExamResults(studentId: String): Result<List<ExamResultDto>>
}
