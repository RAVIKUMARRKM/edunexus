package com.edunexus.android.core.model

import com.edunexus.android.core.model.enums.IssueStatus
import kotlinx.serialization.Serializable

@Serializable
data class BookIssue(
    val id: String,
    val bookId: String,
    val studentId: String,
    val issueDate: String,
    val dueDate: String,
    val returnDate: String? = null,
    val status: IssueStatus = IssueStatus.ISSUED,
    val fineAmount: Double = 0.0,
    val finePaid: Boolean = false,
    val issuedBy: String? = null,
    val returnedTo: String? = null,
    val remarks: String? = null,
    val createdAt: String,
    val updatedAt: String
)
