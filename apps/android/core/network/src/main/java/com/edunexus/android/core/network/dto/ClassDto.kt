package com.edunexus.android.core.network.dto

import com.google.gson.annotations.SerializedName

/**
 * Class DTO for network responses
 */
data class ClassDto(
    @SerializedName("id")
    val id: String,
    @SerializedName("name")
    val name: String,
    @SerializedName("grade")
    val grade: Int,
    @SerializedName("description")
    val description: String? = null,
    @SerializedName("createdAt")
    val createdAt: String? = null,
    @SerializedName("updatedAt")
    val updatedAt: String? = null,
    @SerializedName("sections")
    val sections: List<SectionDto>? = null
)

/**
 * Section DTO for network responses
 */
data class SectionDto(
    @SerializedName("id")
    val id: String,
    @SerializedName("name")
    val name: String,
    @SerializedName("classId")
    val classId: String,
    @SerializedName("capacity")
    val capacity: Int? = null,
    @SerializedName("teacherId")
    val teacherId: String? = null,
    @SerializedName("createdAt")
    val createdAt: String? = null,
    @SerializedName("updatedAt")
    val updatedAt: String? = null,
    @SerializedName("teacher")
    val teacher: TeacherDto? = null
)
