package com.edunexus.android.core.network.dto

import com.google.gson.annotations.SerializedName

/**
 * Book DTO for network responses
 */
data class BookDto(
    @SerializedName("id")
    val id: String,
    @SerializedName("title")
    val title: String,
    @SerializedName("author")
    val author: String,
    @SerializedName("isbn")
    val isbn: String,
    @SerializedName("publisher")
    val publisher: String? = null,
    @SerializedName("category")
    val category: String? = null,
    @SerializedName("quantity")
    val quantity: Int,
    @SerializedName("available")
    val available: Int,
    @SerializedName("price")
    val price: Float? = null,
    @SerializedName("purchaseDate")
    val purchaseDate: String? = null,
    @SerializedName("location")
    val location: String? = null,
    @SerializedName("status")
    val status: String,
    @SerializedName("createdAt")
    val createdAt: String? = null,
    @SerializedName("updatedAt")
    val updatedAt: String? = null
)

/**
 * Book issue DTO for network responses
 */
data class BookIssueDto(
    @SerializedName("id")
    val id: String,
    @SerializedName("bookId")
    val bookId: String,
    @SerializedName("studentId")
    val studentId: String? = null,
    @SerializedName("teacherId")
    val teacherId: String? = null,
    @SerializedName("issueDate")
    val issueDate: String,
    @SerializedName("dueDate")
    val dueDate: String,
    @SerializedName("returnDate")
    val returnDate: String? = null,
    @SerializedName("status")
    val status: String,
    @SerializedName("fine")
    val fine: Float? = null,
    @SerializedName("remarks")
    val remarks: String? = null,
    @SerializedName("createdAt")
    val createdAt: String? = null,
    @SerializedName("updatedAt")
    val updatedAt: String? = null,
    @SerializedName("book")
    val book: BookDto? = null,
    @SerializedName("student")
    val student: StudentDto? = null,
    @SerializedName("teacher")
    val teacher: TeacherDto? = null
)

/**
 * Issue book request DTO
 */
data class IssueBookRequest(
    @SerializedName("bookId")
    val bookId: String,
    @SerializedName("studentId")
    val studentId: String? = null,
    @SerializedName("teacherId")
    val teacherId: String? = null,
    @SerializedName("dueDate")
    val dueDate: String
)

/**
 * Return book request DTO
 */
data class ReturnBookRequest(
    @SerializedName("fine")
    val fine: Float? = null,
    @SerializedName("remarks")
    val remarks: String? = null
)

/**
 * Add/Update book request DTO
 */
data class BookRequest(
    @SerializedName("title")
    val title: String,
    @SerializedName("author")
    val author: String,
    @SerializedName("isbn")
    val isbn: String,
    @SerializedName("publisher")
    val publisher: String? = null,
    @SerializedName("category")
    val category: String? = null,
    @SerializedName("quantity")
    val quantity: Int,
    @SerializedName("price")
    val price: Float? = null,
    @SerializedName("purchaseDate")
    val purchaseDate: String? = null,
    @SerializedName("location")
    val location: String? = null,
    @SerializedName("status")
    val status: String
)
