package com.edunexus.android.core.model

import com.edunexus.android.core.model.enums.VehicleStatus
import com.edunexus.android.core.model.enums.VehicleType
import kotlinx.serialization.Serializable

@Serializable
data class Vehicle(
    val id: String,
    val vehicleNo: String,
    val vehicleType: VehicleType,
    val capacity: Int,
    val driverName: String,
    val driverPhone: String,
    val driverLicense: String? = null,
    val conductorName: String? = null,
    val conductorPhone: String? = null,
    val insuranceExpiry: String? = null,
    val fitnessExpiry: String? = null,
    val gpsEnabled: Boolean = false,
    val status: VehicleStatus = VehicleStatus.ACTIVE,
    val createdAt: String,
    val updatedAt: String
)
