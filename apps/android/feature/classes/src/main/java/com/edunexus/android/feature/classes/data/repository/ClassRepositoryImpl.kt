package com.edunexus.android.feature.classes.data.repository

import com.edunexus.android.core.network.ApiService
import com.edunexus.android.core.network.dto.ClassDto
import com.edunexus.android.core.network.dto.SectionDto
import javax.inject.Inject

/**
 * Implementation of ClassRepository using ApiService
 */
class ClassRepositoryImpl @Inject constructor(
    private val apiService: ApiService
) : ClassRepository {

    private var cachedClasses: List<ClassDto>? = null

    override suspend fun getClasses(): Result<List<ClassDto>> {
        return try {
            val response = apiService.getClasses()
            if (response.isSuccessful && response.body() != null) {
                cachedClasses = response.body()!!
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Failed to fetch classes: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getSections(classId: String): Result<List<SectionDto>> {
        return try {
            val response = apiService.getSections(classId)
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Failed to fetch sections: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getClass(id: String): Result<ClassDto> {
        return try {
            // First try to get from cache
            cachedClasses?.find { it.id == id }?.let {
                return Result.success(it)
            }

            // If not in cache, fetch all classes
            val response = apiService.getClasses()
            if (response.isSuccessful && response.body() != null) {
                cachedClasses = response.body()!!
                val classDto = cachedClasses?.find { it.id == id }
                if (classDto != null) {
                    Result.success(classDto)
                } else {
                    Result.failure(Exception("Class not found"))
                }
            } else {
                Result.failure(Exception("Failed to fetch class: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
