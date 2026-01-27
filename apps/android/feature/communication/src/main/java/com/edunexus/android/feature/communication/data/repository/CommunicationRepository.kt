package com.edunexus.android.feature.communication.data.repository

import com.edunexus.android.core.network.dto.MessageDto
import com.edunexus.android.core.network.dto.NoticeDto
import com.edunexus.android.core.network.dto.SendMessageRequest

/**
 * Repository interface for Communication operations (Notices & Messages)
 */
interface CommunicationRepository {
    /**
     * Get all notices
     */
    suspend fun getNotices(): Result<List<NoticeDto>>

    /**
     * Get a single notice by ID
     */
    suspend fun getNotice(id: String): Result<NoticeDto>

    /**
     * Get all messages
     */
    suspend fun getMessages(type: String? = null): Result<List<MessageDto>>

    /**
     * Get a single message by ID
     */
    suspend fun getMessage(id: String): Result<MessageDto>

    /**
     * Send a new message
     */
    suspend fun sendMessage(request: SendMessageRequest): Result<MessageDto>

    /**
     * Mark a message as read
     */
    suspend fun markMessageRead(id: String): Result<Unit>

    /**
     * Delete a message
     */
    suspend fun deleteMessage(id: String): Result<Unit>
}
