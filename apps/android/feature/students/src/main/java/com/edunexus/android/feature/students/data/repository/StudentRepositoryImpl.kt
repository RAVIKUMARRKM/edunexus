package com.edunexus.android.feature.students.data.repository

import com.edunexus.android.core.network.ApiService
import com.edunexus.android.core.network.dto.StudentDto
import com.edunexus.android.core.network.dto.StudentRequest
import retrofit2.Response
import javax.inject.Inject

/**
 * Implementation of StudentRepository using ApiService
 */
class StudentRepositoryImpl @Inject constructor(
    private val apiService: ApiService
) : StudentRepository {

    override suspend fun getStudents(
        status: String?,
        classId: String?,
        sectionId: String?,
        search: String?
    ): Result<List<StudentDto>> {
        return try {
            val params = buildMap {
                status?.let { put("status", it) }
                classId?.let { put("classId", it) }
                sectionId?.let { put("sectionId", it) }
                search?.let { put("search", it) }
            }

            val response = apiService.getStudents(params)
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Failed to fetch students: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getStudent(id: String): Result<StudentDto> {
        return try {
            val response = apiService.getStudent(id)
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Failed to fetch student: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun createStudent(request: StudentRequest): Result<StudentDto> {
        return try {
            val response = apiService.createStudent(request)
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Failed to create student: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun updateStudent(id: String, request: StudentRequest): Result<StudentDto> {
        return try {
            val response = apiService.updateStudent(id, request)
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Failed to update student: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun deleteStudent(id: String): Result<Unit> {
        return try {
            val response = apiService.deleteStudent(id)
            if (response.isSuccessful) {
                Result.success(Unit)
            } else {
                Result.failure(Exception("Failed to delete student: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
