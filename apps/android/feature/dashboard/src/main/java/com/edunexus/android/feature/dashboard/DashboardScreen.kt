package com.edunexus.android.feature.dashboard

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.edunexus.android.core.model.enums.Role
import com.edunexus.android.core.ui.component.EduNexusCard
import com.edunexus.android.core.ui.component.LoadingIndicator
import com.edunexus.android.core.ui.theme.*
import com.edunexus.android.feature.dashboard.data.model.ActivityType
import com.edunexus.android.feature.dashboard.data.model.DashboardStats
import com.edunexus.android.feature.dashboard.data.model.RecentActivity

/**
 * Dashboard Screen - Main landing screen after login
 *
 * @param userName Current user's name
 * @param userRole Current user's role
 * @param onNavigate Callback for navigation to other screens
 * @param viewModel Dashboard ViewModel (injected by Hilt)
 */
@Composable
fun DashboardScreen(
    userName: String,
    userRole: Role,
    onNavigate: (String) -> Unit,
    viewModel: DashboardViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    val context = LocalContext.current

    // Handle effects
    LaunchedEffect(Unit) {
        viewModel.effect.collect { effect ->
            when (effect) {
                is DashboardEffect.NavigateToScreen -> {
                    onNavigate(effect.route)
                }
                is DashboardEffect.ShowToast -> {
                    Toast.makeText(context, effect.message, Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

    // Pull to refresh state
    var isRefreshing by remember { mutableStateOf(false) }

    LaunchedEffect(uiState) {
        if (uiState is DashboardUiState.Success) {
            isRefreshing = false
        }
    }

    Box(modifier = Modifier.fillMaxSize()) {
        when (val state = uiState) {
            is DashboardUiState.Loading -> {
                LoadingIndicator()
            }
            is DashboardUiState.Success -> {
                DashboardContent(
                    userName = userName,
                    userRole = userRole,
                    stats = state.stats,
                    onRefresh = {
                        isRefreshing = true
                        viewModel.handleIntent(DashboardIntent.RefreshStats)
                    },
                    onQuickActionClick = { route ->
                        viewModel.handleIntent(DashboardIntent.NavigateToModule(route))
                    },
                    viewModel = viewModel
                )
            }
            is DashboardUiState.Error -> {
                ErrorState(
                    message = state.message,
                    onRetry = {
                        viewModel.handleIntent(DashboardIntent.LoadStats)
                    }
                )
            }
        }
    }
}

/**
 * Dashboard content
 */
@Composable
private fun DashboardContent(
    userName: String,
    userRole: Role,
    stats: DashboardStats,
    onRefresh: () -> Unit,
    onQuickActionClick: (String) -> Unit,
    viewModel: DashboardViewModel
) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(Gray50),
        contentPadding = PaddingValues(bottom = 24.dp)
    ) {
        // Welcome Header with gradient background
        item {
            WelcomeHeader(userName = userName, userRole = userRole)
        }

        // Stats Cards
        item {
            StatsSection(stats = stats)
        }

        // Quick Actions
        item {
            QuickActionsSection(
                userRole = userRole,
                onActionClick = onQuickActionClick,
                viewModel = viewModel
            )
        }

        // Recent Activities
        item {
            RecentActivitiesSection(activities = stats.recentActivities)
        }
    }
}

/**
 * Welcome header with gradient background
 */
@Composable
private fun WelcomeHeader(
    userName: String,
    userRole: Role
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .background(
                brush = Brush.verticalGradient(
                    colors = listOf(Indigo600, Indigo700)
                )
            )
            .padding(top = 24.dp, bottom = 48.dp, start = 16.dp, end = 16.dp)
    ) {
        Column {
            Text(
                text = "Welcome back,",
                style = MaterialTheme.typography.titleMedium,
                color = Color.White.copy(alpha = 0.9f)
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = userName,
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold,
                color = Color.White
            )
            Spacer(modifier = Modifier.height(12.dp))
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = Color.White.copy(alpha = 0.2f)
            ) {
                Text(
                    text = userRole.name.replace("_", " "),
                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                    style = MaterialTheme.typography.bodyMedium,
                    color = Color.White
                )
            }
        }
    }
}

/**
 * Stats cards section
 */
@Composable
private fun StatsSection(stats: DashboardStats) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp)
            .offset(y = (-24).dp)
    ) {
        EduNexusCard(
            elevation = 4.dp
        ) {
            Column {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    StatItem(
                        modifier = Modifier.weight(1f),
                        icon = Icons.Default.School,
                        iconColor = Color(0xFF3B82F6),
                        label = "Total Students",
                        value = stats.totalStudents.toString()
                    )
                    StatItem(
                        modifier = Modifier.weight(1f),
                        icon = Icons.Default.Person,
                        iconColor = Color(0xFF10B981),
                        label = "Total Teachers",
                        value = stats.totalTeachers.toString()
                    )
                }
                Spacer(modifier = Modifier.height(16.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    StatItem(
                        modifier = Modifier.weight(1f),
                        icon = Icons.Default.CheckCircle,
                        iconColor = Color(0xFFF59E0B),
                        label = "Today's Attendance",
                        value = "${stats.attendancePercentage.toInt()}%"
                    )
                    StatItem(
                        modifier = Modifier.weight(1f),
                        icon = Icons.Default.AccountBalance,
                        iconColor = Color(0xFFEF4444),
                        label = "Fee Collection",
                        value = "₹${(stats.collectedFees / 1000).toInt()}K"
                    )
                }
            }
        }
    }
}

/**
 * Individual stat item
 */
@Composable
private fun StatItem(
    modifier: Modifier = Modifier,
    icon: ImageVector,
    iconColor: Color,
    label: String,
    value: String
) {
    Row(
        modifier = modifier,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Surface(
            shape = RoundedCornerShape(12.dp),
            color = iconColor.copy(alpha = 0.15f),
            modifier = Modifier.size(48.dp)
        ) {
            Box(
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = iconColor,
                    modifier = Modifier.size(24.dp)
                )
            }
        }
        Spacer(modifier = Modifier.width(12.dp))
        Column {
            Text(
                text = value,
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,
                color = Gray900
            )
            Text(
                text = label,
                style = MaterialTheme.typography.bodySmall,
                color = Gray600
            )
        }
    }
}

/**
 * Quick actions section
 */
@Composable
private fun QuickActionsSection(
    userRole: Role,
    onActionClick: (String) -> Unit,
    viewModel: DashboardViewModel
) {
    val filteredActions = viewModel.getFilteredQuickActions(userRole)

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 24.dp)
    ) {
        Text(
            text = "Quick Actions",
            style = MaterialTheme.typography.titleLarge,
            fontWeight = FontWeight.SemiBold,
            color = Gray900
        )
        Spacer(modifier = Modifier.height(16.dp))

        // Display actions in a grid (4 columns)
        val rows = filteredActions.chunked(4)
        rows.forEach { rowActions ->
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                rowActions.forEach { action ->
                    QuickActionItem(
                        modifier = Modifier.weight(1f),
                        action = action,
                        onClick = { onActionClick(action.route) }
                    )
                }
                // Fill remaining slots if less than 4 items
                repeat(4 - rowActions.size) {
                    Spacer(modifier = Modifier.weight(1f))
                }
            }
        }
    }
}

/**
 * Quick action item
 */
@Composable
private fun QuickActionItem(
    modifier: Modifier = Modifier,
    action: QuickAction,
    onClick: () -> Unit
) {
    Column(
        modifier = modifier,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Surface(
            onClick = onClick,
            shape = RoundedCornerShape(16.dp),
            color = Color(action.color).copy(alpha = 0.15f),
            modifier = Modifier.size(64.dp)
        ) {
            Box(
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = getIconForAction(action.icon),
                    contentDescription = action.label,
                    tint = Color(action.color),
                    modifier = Modifier.size(32.dp)
                )
            }
        }
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = action.label,
            style = MaterialTheme.typography.bodySmall,
            color = Gray700,
            maxLines = 1
        )
    }
}

/**
 * Get Material icon for action
 */
private fun getIconForAction(iconName: String): ImageVector {
    return when (iconName) {
        "school" -> Icons.Default.School
        "person" -> Icons.Default.Person
        "class" -> Icons.Default.Class
        "assignment" -> Icons.Default.Assignment
        "payments" -> Icons.Default.Payment
        "library_books" -> Icons.Default.LibraryBooks
        "directions_bus" -> Icons.Default.DirectionsBus
        "notifications" -> Icons.Default.Notifications
        else -> Icons.Default.Info
    }
}

/**
 * Recent activities section
 */
@Composable
private fun RecentActivitiesSection(activities: List<RecentActivity>) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp)
    ) {
        Text(
            text = "Recent Activities",
            style = MaterialTheme.typography.titleLarge,
            fontWeight = FontWeight.SemiBold,
            color = Gray900
        )
        Spacer(modifier = Modifier.height(16.dp))

        if (activities.isEmpty()) {
            EduNexusCard {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 32.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "No recent activities",
                        style = MaterialTheme.typography.bodyMedium,
                        color = Gray500
                    )
                }
            }
        } else {
            EduNexusCard {
                Column {
                    activities.forEachIndexed { index, activity ->
                        ActivityItem(activity = activity)
                        if (index < activities.size - 1) {
                            HorizontalDivider(
                                modifier = Modifier.padding(vertical = 12.dp),
                                color = Gray200
                            )
                        }
                    }
                }
            }
        }
    }
}

/**
 * Activity item
 */
@Composable
private fun ActivityItem(activity: RecentActivity) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.Top
    ) {
        Surface(
            shape = CircleShape,
            color = getActivityColor(activity.type).copy(alpha = 0.15f),
            modifier = Modifier.size(40.dp)
        ) {
            Box(
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = getActivityIcon(activity.type),
                    contentDescription = null,
                    tint = getActivityColor(activity.type),
                    modifier = Modifier.size(20.dp)
                )
            }
        }
        Spacer(modifier = Modifier.width(12.dp))
        Column(
            modifier = Modifier.weight(1f)
        ) {
            Text(
                text = activity.message,
                style = MaterialTheme.typography.bodyMedium,
                color = Gray900
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = activity.timestamp,
                style = MaterialTheme.typography.bodySmall,
                color = Gray500
            )
        }
    }
}

/**
 * Get icon for activity type
 */
private fun getActivityIcon(type: ActivityType): ImageVector {
    return when (type) {
        ActivityType.SUCCESS -> Icons.Default.CheckCircle
        ActivityType.WARNING -> Icons.Default.Warning
        ActivityType.ERROR -> Icons.Default.Error
        ActivityType.INFO -> Icons.Default.Info
    }
}

/**
 * Get color for activity type
 */
private fun getActivityColor(type: ActivityType): Color {
    return when (type) {
        ActivityType.SUCCESS -> Green500
        ActivityType.WARNING -> Amber500
        ActivityType.ERROR -> Red500
        ActivityType.INFO -> Indigo600
    }
}

/**
 * Error state
 */
@Composable
private fun ErrorState(
    message: String,
    onRetry: () -> Unit
) {
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.padding(32.dp)
        ) {
            Icon(
                imageVector = Icons.Default.Error,
                contentDescription = null,
                tint = Red500,
                modifier = Modifier.size(64.dp)
            )
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = message,
                style = MaterialTheme.typography.bodyLarge,
                color = Gray700
            )
            Spacer(modifier = Modifier.height(24.dp))
            Button(onClick = onRetry) {
                Text("Retry")
            }
        }
    }
}
