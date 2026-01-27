package com.edunexus.android.core.model

import com.edunexus.android.core.model.enums.RoomStatus
import com.edunexus.android.core.model.enums.RoomType
import kotlinx.serialization.Serializable

@Serializable
data class HostelRoom(
    val id: String,
    val roomNo: String,
    val buildingId: String,
    val floor: Int,
    val roomType: RoomType,
    val capacity: Int,
    val occupied: Int = 0,
    val rentPerMonth: Double,
    val facilities: String? = null,
    val status: RoomStatus = RoomStatus.AVAILABLE,
    val createdAt: String,
    val updatedAt: String
)
