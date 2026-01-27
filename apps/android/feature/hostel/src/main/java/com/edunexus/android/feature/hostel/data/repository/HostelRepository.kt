package com.edunexus.android.feature.hostel.data.repository

import com.edunexus.android.core.network.dto.HostelBuildingDto
import com.edunexus.android.core.network.dto.HostelRoomDto

/**
 * Repository interface for Hostel operations
 */
interface HostelRepository {
    /**
     * Get all hostel buildings
     */
    suspend fun getBuildings(): Result<List<HostelBuildingDto>>

    /**
     * Get all hostel rooms
     */
    suspend fun getRooms(): Result<List<HostelRoomDto>>

    /**
     * Get rooms by building ID
     */
    suspend fun getRoomsByBuilding(buildingId: String): Result<List<HostelRoomDto>>

    /**
     * Get a single building by ID
     */
    suspend fun getBuilding(id: String): Result<HostelBuildingDto>

    /**
     * Get a single room by ID
     */
    suspend fun getRoom(id: String): Result<HostelRoomDto>
}
