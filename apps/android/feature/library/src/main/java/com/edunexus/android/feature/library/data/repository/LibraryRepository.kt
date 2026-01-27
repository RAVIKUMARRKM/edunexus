package com.edunexus.android.feature.library.data.repository

import com.edunexus.android.core.network.dto.BookDto
import com.edunexus.android.core.network.dto.BookIssueDto

/**
 * Repository interface for Library operations
 */
interface LibraryRepository {
    /**
     * Get all books
     */
    suspend fun getBooks(): Result<List<BookDto>>

    /**
     * Get a single book by ID
     */
    suspend fun getBook(id: String): Result<BookDto>

    /**
     * Issue a book to a student or teacher
     */
    suspend fun issueBook(
        bookId: String,
        studentId: String?,
        teacherId: String?,
        dueDate: String
    ): Result<BookIssueDto>

    /**
     * Get all book issues
     */
    suspend fun getBookIssues(): Result<List<BookIssueDto>>

    /**
     * Return a book
     */
    suspend fun returnBook(issueId: String, fine: Float? = null, remarks: String? = null): Result<BookIssueDto>
}
