package com.edunexus.android.feature.students.data.repository

import com.edunexus.android.core.network.dto.StudentDto
import com.edunexus.android.core.network.dto.StudentRequest

/**
 * Repository interface for Student operations
 */
interface StudentRepository {
    /**
     * Get all students with optional filters
     * @param status Filter by student status (ACTIVE, INACTIVE, etc.)
     * @param classId Filter by class ID
     * @param sectionId Filter by section ID
     * @param search Search by name or admission number
     */
    suspend fun getStudents(
        status: String? = null,
        classId: String? = null,
        sectionId: String? = null,
        search: String? = null
    ): Result<List<StudentDto>>

    /**
     * Get a single student by ID
     */
    suspend fun getStudent(id: String): Result<StudentDto>

    /**
     * Create a new student
     */
    suspend fun createStudent(request: StudentRequest): Result<StudentDto>

    /**
     * Update an existing student
     */
    suspend fun updateStudent(id: String, request: StudentRequest): Result<StudentDto>

    /**
     * Delete a student
     */
    suspend fun deleteStudent(id: String): Result<Unit>
}
