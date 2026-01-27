package com.edunexus.android.core.common.auth

import kotlinx.coroutines.flow.Flow

/**
 * Interface for providing auth tokens from DataStore
 * This is implemented in the datastore module
 */
interface TokenProvider {
    suspend fun getToken(): Flow<String?>
    suspend fun clearAuth()
}
