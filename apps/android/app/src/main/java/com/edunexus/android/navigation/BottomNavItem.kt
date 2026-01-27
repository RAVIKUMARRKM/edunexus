package com.edunexus.android.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Assignment
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.Dashboard
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Wallet
import androidx.compose.material.icons.outlined.Assignment
import androidx.compose.material.icons.outlined.CalendarMonth
import androidx.compose.material.icons.outlined.Dashboard
import androidx.compose.material.icons.outlined.Person
import androidx.compose.material.icons.outlined.Wallet
import androidx.compose.ui.graphics.vector.ImageVector

/**
 * Sealed class representing bottom navigation items.
 * Each item has a route, label, and filled/outlined icons.
 */
sealed class BottomNavItem(
    val route: String,
    val title: String,
    val icon: ImageVector,
    val selectedIcon: ImageVector
) {
    data object Dashboard : BottomNavItem(
        route = Routes.DASHBOARD,
        title = "Dashboard",
        icon = Icons.Outlined.Dashboard,
        selectedIcon = Icons.Filled.Dashboard
    )

    data object Attendance : BottomNavItem(
        route = Routes.ATTENDANCE,
        title = "Attendance",
        icon = Icons.Outlined.CalendarMonth,
        selectedIcon = Icons.Filled.CalendarMonth
    )

    data object Exams : BottomNavItem(
        route = Routes.EXAMS,
        title = "Exams",
        icon = Icons.Outlined.Assignment,
        selectedIcon = Icons.Filled.Assignment
    )

    data object Fees : BottomNavItem(
        route = Routes.FEES,
        title = "Fees",
        icon = Icons.Outlined.Wallet,
        selectedIcon = Icons.Filled.Wallet
    )

    data object Profile : BottomNavItem(
        route = Routes.PROFILE,
        title = "Profile",
        icon = Icons.Outlined.Person,
        selectedIcon = Icons.Filled.Person
    )

    companion object {
        val items = listOf(
            Dashboard,
            Attendance,
            Exams,
            Fees,
            Profile
        )
    }
}
