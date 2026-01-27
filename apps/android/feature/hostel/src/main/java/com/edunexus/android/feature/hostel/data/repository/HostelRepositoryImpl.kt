package com.edunexus.android.feature.hostel.data.repository

import com.edunexus.android.core.network.ApiService
import com.edunexus.android.core.network.dto.HostelBuildingDto
import com.edunexus.android.core.network.dto.HostelRoomDto
import javax.inject.Inject

/**
 * Implementation of HostelRepository using ApiService
 */
class HostelRepositoryImpl @Inject constructor(
    private val apiService: ApiService
) : HostelRepository {

    private var cachedBuildings: List<HostelBuildingDto>? = null
    private var cachedRooms: List<HostelRoomDto>? = null

    override suspend fun getBuildings(): Result<List<HostelBuildingDto>> {
        return try {
            val response = apiService.getHostelBuildings()
            if (response.isSuccessful && response.body() != null) {
                cachedBuildings = response.body()!!
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Failed to fetch buildings: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getRooms(): Result<List<HostelRoomDto>> {
        return try {
            val response = apiService.getHostelRooms()
            if (response.isSuccessful && response.body() != null) {
                cachedRooms = response.body()!!
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Failed to fetch rooms: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getRoomsByBuilding(buildingId: String): Result<List<HostelRoomDto>> {
        return try {
            val params = mapOf("buildingId" to buildingId)
            val response = apiService.getHostelRooms(params)
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Failed to fetch rooms: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getBuilding(id: String): Result<HostelBuildingDto> {
        return try {
            // First try to get from cache
            cachedBuildings?.find { it.id == id }?.let {
                return Result.success(it)
            }

            // If not in cache, fetch from API
            val response = apiService.getHostelBuilding(id)
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Building not found"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getRoom(id: String): Result<HostelRoomDto> {
        return try {
            // First try to get from cache
            cachedRooms?.find { it.id == id }?.let {
                return Result.success(it)
            }

            // If not in cache, fetch from API
            val response = apiService.getHostelRoom(id)
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Room not found"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
