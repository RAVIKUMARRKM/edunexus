package com.edunexus.android.core.network.dto

import com.google.gson.annotations.SerializedName

/**
 * Hostel building DTO for network responses
 */
data class HostelBuildingDto(
    @SerializedName("id")
    val id: String,
    @SerializedName("name")
    val name: String,
    @SerializedName("type")
    val type: String,
    @SerializedName("address")
    val address: String? = null,
    @SerializedName("totalRooms")
    val totalRooms: Int,
    @SerializedName("wardenId")
    val wardenId: String? = null,
    @SerializedName("status")
    val status: String,
    @SerializedName("createdAt")
    val createdAt: String? = null,
    @SerializedName("updatedAt")
    val updatedAt: String? = null
)

/**
 * Hostel room DTO for network responses
 */
data class HostelRoomDto(
    @SerializedName("id")
    val id: String,
    @SerializedName("roomNumber")
    val roomNumber: String,
    @SerializedName("buildingId")
    val buildingId: String,
    @SerializedName("floor")
    val floor: Int,
    @SerializedName("capacity")
    val capacity: Int,
    @SerializedName("occupied")
    val occupied: Int,
    @SerializedName("type")
    val type: String,
    @SerializedName("facilities")
    val facilities: List<String>? = null,
    @SerializedName("status")
    val status: String,
    @SerializedName("createdAt")
    val createdAt: String? = null,
    @SerializedName("updatedAt")
    val updatedAt: String? = null,
    @SerializedName("building")
    val building: HostelBuildingDto? = null
)

/**
 * Hostel allocation DTO for network responses
 */
data class HostelAllocationDto(
    @SerializedName("id")
    val id: String,
    @SerializedName("studentId")
    val studentId: String,
    @SerializedName("roomId")
    val roomId: String,
    @SerializedName("bedNumber")
    val bedNumber: String? = null,
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
    @SerializedName("room")
    val room: HostelRoomDto? = null
)

/**
 * Add hostel building request DTO
 */
data class HostelBuildingRequest(
    @SerializedName("name")
    val name: String,
    @SerializedName("type")
    val type: String,
    @SerializedName("address")
    val address: String? = null,
    @SerializedName("totalRooms")
    val totalRooms: Int,
    @SerializedName("wardenId")
    val wardenId: String? = null,
    @SerializedName("status")
    val status: String
)

/**
 * Add hostel room request DTO
 */
data class HostelRoomRequest(
    @SerializedName("roomNumber")
    val roomNumber: String,
    @SerializedName("buildingId")
    val buildingId: String,
    @SerializedName("floor")
    val floor: Int,
    @SerializedName("capacity")
    val capacity: Int,
    @SerializedName("type")
    val type: String,
    @SerializedName("facilities")
    val facilities: List<String>? = null,
    @SerializedName("status")
    val status: String
)

/**
 * Add hostel allocation request DTO
 */
data class HostelAllocationRequest(
    @SerializedName("studentId")
    val studentId: String,
    @SerializedName("roomId")
    val roomId: String,
    @SerializedName("bedNumber")
    val bedNumber: String? = null,
    @SerializedName("startDate")
    val startDate: String,
    @SerializedName("endDate")
    val endDate: String? = null,
    @SerializedName("status")
    val status: String
)
