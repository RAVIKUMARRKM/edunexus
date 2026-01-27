package com.edunexus.android.core.network.dto

import com.google.gson.annotations.SerializedName

/**
 * Vehicle DTO for network responses
 */
data class VehicleDto(
    @SerializedName("id")
    val id: String,
    @SerializedName("vehicleNumber")
    val vehicleNumber: String,
    @SerializedName("type")
    val type: String,
    @SerializedName("model")
    val model: String? = null,
    @SerializedName("capacity")
    val capacity: Int,
    @SerializedName("driverId")
    val driverId: String? = null,
    @SerializedName("status")
    val status: String,
    @SerializedName("registrationDate")
    val registrationDate: String? = null,
    @SerializedName("insuranceExpiry")
    val insuranceExpiry: String? = null,
    @SerializedName("createdAt")
    val createdAt: String? = null,
    @SerializedName("updatedAt")
    val updatedAt: String? = null
)

/**
 * Transport route DTO for network responses
 */
data class TransportRouteDto(
    @SerializedName("id")
    val id: String,
    @SerializedName("name")
    val name: String,
    @SerializedName("routeNumber")
    val routeNumber: String,
    @SerializedName("startPoint")
    val startPoint: String,
    @SerializedName("endPoint")
    val endPoint: String,
    @SerializedName("stops")
    val stops: List<String>? = null,
    @SerializedName("distance")
    val distance: Float? = null,
    @SerializedName("fare")
    val fare: Float,
    @SerializedName("vehicleId")
    val vehicleId: String? = null,
    @SerializedName("status")
    val status: String,
    @SerializedName("createdAt")
    val createdAt: String? = null,
    @SerializedName("updatedAt")
    val updatedAt: String? = null,
    @SerializedName("vehicle")
    val vehicle: VehicleDto? = null
)

/**
 * Transport allocation DTO for network responses
 */
data class TransportAllocationDto(
    @SerializedName("id")
    val id: String,
    @SerializedName("studentId")
    val studentId: String,
    @SerializedName("routeId")
    val routeId: String,
    @SerializedName("pickupPoint")
    val pickupPoint: String,
    @SerializedName("dropPoint")
    val dropPoint: String,
    @SerializedName("startDate")
    val startDate: String,
    @SerializedName("endDate")
    val endDate: String? = null,
    @SerializedName("status")
    val status: String,
    @SerializedName("createdAt")
    val createdAt: String? = null,
    @SerializedName("updatedAt")
    val updatedAt: String? = null,
    @SerializedName("student")
    val student: StudentDto? = null,
    @SerializedName("route")
    val route: TransportRouteDto? = null
)

/**
 * Add/Update vehicle request DTO
 */
data class VehicleRequest(
    @SerializedName("vehicleNumber")
    val vehicleNumber: String,
    @SerializedName("type")
    val type: String,
    @SerializedName("model")
    val model: String? = null,
    @SerializedName("capacity")
    val capacity: Int,
    @SerializedName("driverId")
    val driverId: String? = null,
    @SerializedName("status")
    val status: String,
    @SerializedName("registrationDate")
    val registrationDate: String? = null,
    @SerializedName("insuranceExpiry")
    val insuranceExpiry: String? = null
)

/**
 * Add transport route request DTO
 */
data class TransportRouteRequest(
    @SerializedName("name")
    val name: String,
    @SerializedName("routeNumber")
    val routeNumber: String,
    @SerializedName("startPoint")
    val startPoint: String,
    @SerializedName("endPoint")
    val endPoint: String,
    @SerializedName("stops")
    val stops: List<String>? = null,
    @SerializedName("distance")
    val distance: Float? = null,
    @SerializedName("fare")
    val fare: Float,
    @SerializedName("vehicleId")
    val vehicleId: String? = null,
    @SerializedName("status")
    val status: String
)

/**
 * Add transport allocation request DTO
 */
data class TransportAllocationRequest(
    @SerializedName("studentId")
    val studentId: String,
    @SerializedName("routeId")
    val routeId: String,
    @SerializedName("pickupPoint")
    val pickupPoint: String,
    @SerializedName("dropPoint")
    val dropPoint: String,
    @SerializedName("startDate")
    val startDate: String,
    @SerializedName("endDate")
    val endDate: String? = null,
    @SerializedName("status")
    val status: String
)
