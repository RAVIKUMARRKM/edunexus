package com.edunexus.android.core.datastore

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import com.edunexus.android.core.common.auth.TokenProvider
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import javax.inject.Inject
import javax.inject.Singleton

private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "edunexus_prefs")

/**
 * DataStore implementation for managing app preferences
 * Implements TokenProvider for network authentication
 */
@Singleton
class PreferencesDataSource @Inject constructor(
    @ApplicationContext private val context: Context
) : TokenProvider {
    private val dataStore = context.dataStore

    companion object {
        val AUTH_TOKEN = stringPreferencesKey("auth_token")
        val USER_ID = stringPreferencesKey("user_id")
        val USER_EMAIL = stringPreferencesKey("user_email")
        val USER_NAME = stringPreferencesKey("user_name")
        val USER_ROLE = stringPreferencesKey("user_role")
        val USER_PHONE = stringPreferencesKey("user_phone")
        val USER_AVATAR = stringPreferencesKey("user_avatar")
    }

    /**
     * Save authentication token
     */
    suspend fun saveAuthToken(token: String) {
        dataStore.edit { preferences ->
            preferences[AUTH_TOKEN] = token
        }
    }

    /**
     * Get authentication token
     */
    fun getAuthToken(): Flow<String?> {
        return dataStore.data.map { preferences ->
            preferences[AUTH_TOKEN]
        }
    }

    /**
     * Save user information
     */
    suspend fun saveUser(
        id: String,
        email: String,
        name: String,
        role: String,
        phone: String? = null,
        avatar: String? = null
    ) {
        dataStore.edit { preferences ->
            preferences[USER_ID] = id
            preferences[USER_EMAIL] = email
            preferences[USER_NAME] = name
            preferences[USER_ROLE] = role
            phone?.let { preferences[USER_PHONE] = it }
            avatar?.let { preferences[USER_AVATAR] = it }
        }
    }

    /**
     * Get user ID
     */
    fun getUserId(): Flow<String?> {
        return dataStore.data.map { preferences ->
            preferences[USER_ID]
        }
    }

    /**
     * Get user email
     */
    fun getUserEmail(): Flow<String?> {
        return dataStore.data.map { preferences ->
            preferences[USER_EMAIL]
        }
    }

    /**
     * Get user name
     */
    fun getUserName(): Flow<String?> {
        return dataStore.data.map { preferences ->
            preferences[USER_NAME]
        }
    }

    /**
     * Get user role
     */
    fun getUserRole(): Flow<String?> {
        return dataStore.data.map { preferences ->
            preferences[USER_ROLE]
        }
    }

    /**
     * Get user phone
     */
    fun getUserPhone(): Flow<String?> {
        return dataStore.data.map { preferences ->
            preferences[USER_PHONE]
        }
    }

    /**
     * Get user avatar
     */
    fun getUserAvatar(): Flow<String?> {
        return dataStore.data.map { preferences ->
            preferences[USER_AVATAR]
        }
    }

    /**
     * Clear all stored data (for logout)
     */
    suspend fun clearAll() {
        dataStore.edit { preferences ->
            preferences.clear()
        }
    }

    /**
     * Check if user is logged in
     */
    fun isLoggedIn(): Flow<Boolean> {
        return dataStore.data.map { preferences ->
            preferences[AUTH_TOKEN] != null
        }
    }

    // TokenProvider implementation
    override suspend fun getToken(): Flow<String?> {
        return getAuthToken()
    }

    override suspend fun clearAuth() {
        clearAll()
    }
}
