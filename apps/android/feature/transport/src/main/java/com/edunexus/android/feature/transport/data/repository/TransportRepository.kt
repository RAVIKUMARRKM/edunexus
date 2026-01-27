package com.edunexus.android.feature.transport.data.repository

import com.edunexus.android.core.network.dto.TransportAllocationDto
import com.edunexus.android.core.network.dto.TransportRouteDto
import com.edunexus.android.core.network.dto.VehicleDto

/**
 * Repository interface for Transport operations
 */
interface TransportRepository {
    /**
     * Get all vehicles with optional filters
     * @param status Filter by vehicle status (ACTIVE, INACTIVE, MAINTENANCE, etc.)
     * @param type Filter by vehicle type (BUS, VAN, CAR, etc.)
     */
    suspend fun getVehicles(
        status: String? = null,
        type: String? = null
    ): Result<List<VehicleDto>>

    /**
     * Get a single vehicle by ID
     */
    suspend fun getVehicle(id: String): Result<VehicleDto>

    /**
     * Get all transport routes with optional filters
     * @param status Filter by route status (ACTIVE, INACTIVE, etc.)
     * @param vehicleId Filter by vehicle ID
     */
    suspend fun getTransportRoutes(
        status: String? = null,
        vehicleId: String? = null
    ): Result<List<TransportRouteDto>>

    /**
     * Get a single transport route by ID
     */
    suspend fun getTransportRoute(id: String): Result<TransportRouteDto>

    /**
     * Get all transport allocations (student assignments)
     * @param routeId Filter by route ID
     * @param studentId Filter by student ID
     * @param status Filter by allocation status
     */
    suspend fun getTransportAllocations(
        routeId: String? = null,
        studentId: String? = null,
        status: String? = null
    ): Result<List<TransportAllocationDto>>
}
