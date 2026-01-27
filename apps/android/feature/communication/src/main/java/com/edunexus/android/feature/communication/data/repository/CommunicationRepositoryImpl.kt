package com.edunexus.android.feature.communication.data.repository

import com.edunexus.android.core.network.ApiService
import com.edunexus.android.core.network.dto.MessageDto
import com.edunexus.android.core.network.dto.NoticeDto
import com.edunexus.android.core.network.dto.SendMessageRequest
import javax.inject.Inject

/**
 * Implementation of CommunicationRepository using ApiService
 */
class CommunicationRepositoryImpl @Inject constructor(
    private val apiService: ApiService
) : CommunicationRepository {

    private var cachedNotices: List<NoticeDto>? = null
    private var cachedMessages: List<MessageDto>? = null

    override suspend fun getNotices(): Result<List<NoticeDto>> {
        return try {
            val response = apiService.getNotices()
            if (response.isSuccessful && response.body() != null) {
                cachedNotices = response.body()!!
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Failed to fetch notices: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getNotice(id: String): Result<NoticeDto> {
        return try {
            // First try to get from cache
            cachedNotices?.find { it.id == id }?.let {
                return Result.success(it)
            }

            // If not in cache, fetch all notices
            val response = apiService.getNotices()
            if (response.isSuccessful && response.body() != null) {
                cachedNotices = response.body()!!
                val notice = cachedNotices?.find { it.id == id }
                if (notice != null) {
                    Result.success(notice)
                } else {
                    Result.failure(Exception("Notice not found"))
                }
            } else {
                Result.failure(Exception("Failed to fetch notice: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getMessages(type: String?): Result<List<MessageDto>> {
        return try {
            val response = apiService.getMessages(type)
            if (response.isSuccessful && response.body() != null) {
                cachedMessages = response.body()!!
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Failed to fetch messages: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getMessage(id: String): Result<MessageDto> {
        return try {
            val response = apiService.getMessage(id)
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Failed to fetch message: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun sendMessage(request: SendMessageRequest): Result<MessageDto> {
        return try {
            val response = apiService.sendMessage(request)
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Failed to send message: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun markMessageRead(id: String): Result<Unit> {
        return try {
            val response = apiService.markMessageRead(id)
            if (response.isSuccessful) {
                Result.success(Unit)
            } else {
                Result.failure(Exception("Failed to mark message as read: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun deleteMessage(id: String): Result<Unit> {
        return try {
            val response = apiService.deleteMessage(id)
            if (response.isSuccessful) {
                Result.success(Unit)
            } else {
                Result.failure(Exception("Failed to delete message: ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
