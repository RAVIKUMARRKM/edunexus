package com.edunexus.android.feature.teachers.data.repository

import com.edunexus.android.core.model.Teacher
import com.edunexus.android.core.model.Department
import com.edunexus.android.core.model.enums.EmployeeStatus
import com.edunexus.android.core.model.enums.Gender
import com.edunexus.android.core.network.ApiService
import retrofit2.Response
import javax.inject.Inject

/**
 * Implementation of TeacherRepository
 */
class TeacherRepositoryImpl @Inject constructor(
    private val apiService: ApiService
) : TeacherRepository {

    override suspend fun getTeachers(
        status: EmployeeStatus?,
        departmentId: String?,
        search: String?
    ): Result<List<Teacher>> {
        return try {
            val params = mutableMapOf<String, String>()
            status?.let { params["status"] = it.name }
            departmentId?.let { params["departmentId"] = it }
            search?.let { params["search"] = it }

            val response = apiService.getTeachers(params)
            if (response.isSuccessful) {
                val teachers = response.body()?.map { dto ->
                    // Map DTO to domain model with all required fields
                    Teacher(
                        id = dto.id,
                        employeeId = dto.employeeId,
                        userId = "", // Not available in DTO
                        firstName = dto.firstName,
                        lastName = dto.lastName,
                        dateOfBirth = dto.dateOfBirth ?: "",
                        gender = Gender.valueOf(dto.gender.uppercase()),
                        bloodGroup = null,
                        photo = dto.photo,
                        address = dto.address,
                        city = null,
                        state = null,
                        pincode = null,
                        emergencyContact = dto.phone,
                        qualification = dto.qualification ?: "",
                        specialization = null,
                        experience = dto.experience ?: 0,
                        joiningDate = dto.joiningDate ?: "",
                        departmentId = dto.departmentId,
                        designation = null,
                        basicSalary = 0.0, // Not available in DTO
                        status = EmployeeStatus.valueOf(dto.status.uppercase()),
                        leftDate = null,
                        createdAt = dto.createdAt ?: "",
                        updatedAt = dto.updatedAt ?: ""
                    )
                } ?: emptyList()
                Result.success(teachers)
            } else {
                Result.failure(Exception("Failed to fetch teachers: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getTeacher(id: String): Result<Teacher> {
        return try {
            val response = apiService.getTeacher(id)
            if (response.isSuccessful) {
                val dto = response.body()
                if (dto != null) {
                    val teacher = Teacher(
                        id = dto.id,
                        employeeId = dto.employeeId,
                        userId = "",
                        firstName = dto.firstName,
                        lastName = dto.lastName,
                        dateOfBirth = dto.dateOfBirth ?: "",
                        gender = Gender.valueOf(dto.gender.uppercase()),
                        bloodGroup = null,
                        photo = dto.photo,
                        address = dto.address,
                        city = null,
                        state = null,
                        pincode = null,
                        emergencyContact = dto.phone,
                        qualification = dto.qualification ?: "",
                        specialization = null,
                        experience = dto.experience ?: 0,
                        joiningDate = dto.joiningDate ?: "",
                        departmentId = dto.departmentId,
                        designation = null,
                        basicSalary = 0.0,
                        status = EmployeeStatus.valueOf(dto.status.uppercase()),
                        leftDate = null,
                        createdAt = dto.createdAt ?: "",
                        updatedAt = dto.updatedAt ?: ""
                    )
                    Result.success(teacher)
                } else {
                    Result.failure(Exception("Teacher not found"))
                }
            } else {
                Result.failure(Exception("Failed to fetch teacher: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun createTeacher(teacher: Teacher): Result<Teacher> {
        // Note: API doesn't have create endpoint yet, returning mock success
        return try {
            // TODO: Implement when API endpoint is available
            Result.success(teacher.copy(
                id = "temp_${System.currentTimeMillis()}",
                createdAt = java.time.Instant.now().toString(),
                updatedAt = java.time.Instant.now().toString()
            ))
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun updateTeacher(id: String, teacher: Teacher): Result<Teacher> {
        // Note: API doesn't have update endpoint yet, returning mock success
        return try {
            // TODO: Implement when API endpoint is available
            Result.success(teacher.copy(
                updatedAt = java.time.Instant.now().toString()
            ))
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun deleteTeacher(id: String): Result<Unit> {
        // Note: API doesn't have delete endpoint yet, returning mock success
        return try {
            // TODO: Implement when API endpoint is available
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getDepartments(): Result<List<Department>> {
        return try {
            val response = apiService.getDepartments()
            if (response.isSuccessful) {
                val departments = response.body()?.map { dto ->
                    Department(
                        id = dto.id,
                        name = dto.name,
                        code = dto.code,
                        headId = dto.hodId,
                        description = dto.description,
                        createdAt = dto.createdAt ?: "",
                        updatedAt = dto.updatedAt ?: ""
                    )
                } ?: emptyList()
                Result.success(departments)
            } else {
                Result.failure(Exception("Failed to fetch departments: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
