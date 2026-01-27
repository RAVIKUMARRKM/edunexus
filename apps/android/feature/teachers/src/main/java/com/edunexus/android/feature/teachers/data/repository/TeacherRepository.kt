package com.edunexus.android.feature.teachers.data.repository

import com.edunexus.android.core.model.Teacher
import com.edunexus.android.core.model.Department
import com.edunexus.android.core.model.enums.EmployeeStatus

/**
 * Repository interface for Teacher data operations
 */
interface TeacherRepository {

    /**
     * Get all teachers with optional filtering
     * @param status Filter by employee status
     * @param departmentId Filter by department
     * @param search Search by name or employee ID
     */
    suspend fun getTeachers(
        status: EmployeeStatus? = null,
        departmentId: String? = null,
        search: String? = null
    ): Result<List<Teacher>>

    /**
     * Get a single teacher by ID
     */
    suspend fun getTeacher(id: String): Result<Teacher>

    /**
     * Create a new teacher
     */
    suspend fun createTeacher(teacher: Teacher): Result<Teacher>

    /**
     * Update an existing teacher
     */
    suspend fun updateTeacher(id: String, teacher: Teacher): Result<Teacher>

    /**
     * Delete a teacher
     */
    suspend fun deleteTeacher(id: String): Result<Unit>

    /**
     * Get all departments for dropdown
     */
    suspend fun getDepartments(): Result<List<Department>>
}
