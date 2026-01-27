package com.edunexus.android.core.network.interceptor

import com.edunexus.android.core.common.auth.TokenProvider
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.runBlocking
import okhttp3.Interceptor
import okhttp3.Response
import javax.inject.Inject

/**
 * Auth interceptor that adds Bearer token to all requests
 * and handles 401 responses by clearing auth state
 */
class AuthInterceptor @Inject constructor(
    private val tokenProvider: TokenProvider
) : Interceptor {

    override fun intercept(chain: Interceptor.Chain): Response {
        val request = chain.request()

        // Get token from DataStore
        val token = runBlocking {
            tokenProvider.getToken().first()
        }

        // Add Authorization header if token exists
        val authenticatedRequest = if (token != null) {
            request.newBuilder()
                .header("Authorization", "Bearer $token")
                .build()
        } else {
            request
        }

        // Execute request
        val response = chain.proceed(authenticatedRequest)

        // Handle 401 Unauthorized by clearing auth state
        if (response.code == 401) {
            runBlocking {
                tokenProvider.clearAuth()
            }
        }

        return response
    }
}
