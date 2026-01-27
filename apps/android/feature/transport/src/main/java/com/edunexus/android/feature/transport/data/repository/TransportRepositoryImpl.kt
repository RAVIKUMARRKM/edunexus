package com.edunexus.android.feature.transport.data.repository

import com.edunexus.android.core.network.ApiService
import com.edunexus.android.core.network.dto.TransportAllocationDto
import com.edunexus.android.core.network.dto.TransportRouteDto
import com.edunexus.android.core.network.dto.VehicleDto
import javax.inject.Inject

/**
 * Implementation of TransportRepository using ApiService
 */
class TransportRepositoryImpl @Inject constructor(
    private val apiService: ApiService
) : TransportRepository {

    override suspend fun getVehicles(
        status: String?,
        type: String?
    ): Result<List<VehicleDto>> {
        return try {
            val params = buildMap {
                status?.let { put("status", it) }
                type?.let { put("type", it) }
            }

            val response = apiService.getVehicles(params)
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Failed to fetch vehicles: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getVehicle(id: String): Result<VehicleDto> {
        return try {
            val response = apiService.getVehicle(id)
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Failed to fetch vehicle: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getTransportRoutes(
        status: String?,
        vehicleId: String?
    ): Result<List<TransportRouteDto>> {
        return try {
            val params = buildMap {
                status?.let { put("status", it) }
                vehicleId?.let { put("vehicleId", it) }
            }

            val response = apiService.getTransportRoutes(params)
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Failed to fetch routes: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getTransportRoute(id: String): Result<TransportRouteDto> {
        return try {
            val response = apiService.getTransportRoute(id)
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Failed to fetch route: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getTransportAllocations(
        routeId: String?,
        studentId: String?,
        status: String?
    ): Result<List<TransportAllocationDto>> {
        return try {
            val params = buildMap {
                routeId?.let { put("routeId", it) }
                studentId?.let { put("studentId", it) }
                status?.let { put("status", it) }
            }

            val response = apiService.getTransportAllocations(params)
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Failed to fetch allocations: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
