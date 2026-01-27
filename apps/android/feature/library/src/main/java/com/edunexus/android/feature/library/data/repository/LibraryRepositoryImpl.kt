package com.edunexus.android.feature.library.data.repository

import com.edunexus.android.core.network.ApiService
import com.edunexus.android.core.network.dto.BookDto
import com.edunexus.android.core.network.dto.BookIssueDto
import com.edunexus.android.core.network.dto.IssueBookRequest
import com.edunexus.android.core.network.dto.ReturnBookRequest
import javax.inject.Inject

/**
 * Implementation of LibraryRepository using ApiService
 */
class LibraryRepositoryImpl @Inject constructor(
    private val apiService: ApiService
) : LibraryRepository {

    private var cachedBooks: List<BookDto>? = null

    override suspend fun getBooks(): Result<List<BookDto>> {
        return try {
            val response = apiService.getBooks()
            if (response.isSuccessful && response.body() \!= null) {
                cachedBooks = response.body()\!\!
                Result.success(response.body()\!\!)
            } else {
                Result.failure(Exception("Failed to fetch books: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getBook(id: String): Result<BookDto> {
        return try {
            cachedBooks?.find { it.id == id }?.let {
                return Result.success(it)
            }

            val response = apiService.getBook(id)
            if (response.isSuccessful && response.body() \!= null) {
                Result.success(response.body()\!\!)
            } else {
                Result.failure(Exception("Failed to fetch book: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun issueBook(
        bookId: String,
        studentId: String?,
        teacherId: String?,
        dueDate: String
    ): Result<BookIssueDto> {
        return try {
            val request = IssueBookRequest(
                bookId = bookId,
                studentId = studentId,
                teacherId = teacherId,
                dueDate = dueDate
            )
            val response = apiService.issueBook(request)
            if (response.isSuccessful && response.body() \!= null) {
                Result.success(response.body()\!\!)
            } else {
                Result.failure(Exception("Failed to issue book: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getBookIssues(): Result<List<BookIssueDto>> {
        return try {
            val response = apiService.getBookIssues()
            if (response.isSuccessful && response.body() \!= null) {
                Result.success(response.body()\!\!)
            } else {
                Result.failure(Exception("Failed to fetch book issues: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun returnBook(issueId: String, fine: Float?, remarks: String?): Result<BookIssueDto> {
        return try {
            val request = if (fine \!= null || remarks \!= null) {
                ReturnBookRequest(fine = fine, remarks = remarks)
            } else null
            val response = apiService.returnBook(issueId, request)
            if (response.isSuccessful && response.body() \!= null) {
                Result.success(response.body()\!\!)
            } else {
                Result.failure(Exception("Failed to return book: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
