package com.edunexus.android.feature.hr.presentation.leave

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.EventNote
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.edunexus.android.core.network.dto.LeaveApplicationDto
import com.edunexus.android.core.network.dto.LeaveStatus
import com.edunexus.android.core.network.dto.LeaveType
import com.edunexus.android.core.ui.component.EmptyState
import com.edunexus.android.feature.hr.data.repository.HRRepository
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LeaveManagementScreen(
    onNavigateBack: () -> Unit,
    modifier: Modifier = Modifier,
    repository: HRRepository = hiltViewModel<LeaveViewModel>().repository
) {
    var leaveList by remember { mutableStateOf<List<LeaveApplicationDto>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }
    val scope = rememberCoroutineScope()

    LaunchedEffect(Unit) {
        scope.launch {
            repository.getLeaveApplications().fold(
                onSuccess = { leaveList = it; isLoading = false },
                onFailure = { isLoading = false }
            )
        }
    }

    Scaffold(
        modifier = modifier,
        topBar = {
            TopAppBar(
                title = { Text("Leave Management") },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(imageVector = Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primary,
                    titleContentColor = MaterialTheme.colorScheme.onPrimary,
                    navigationIconContentColor = MaterialTheme.colorScheme.onPrimary
                )
            )
        }
    ) { paddingValues ->
        Box(modifier = Modifier.fillMaxSize().padding(paddingValues)) {
            when {
                isLoading -> {
                    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                        CircularProgressIndicator()
                    }
                }
                leaveList.isEmpty() -> {
                    EmptyState(
                        title = "No Leave Applications",
                        description = "No leave applications available",
                        icon = Icons.Default.EventNote,
                        actionLabel = null,
                        onActionClick = null
                    )
                }
                else -> {
                    LazyColumn(
                        modifier = Modifier.fillMaxSize(),
                        contentPadding = PaddingValues(16.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        items(items = leaveList, key = { it.id }) { leave ->
                            LeaveCard(leave = leave)
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun LeaveCard(leave: LeaveApplicationDto) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = leave.employeeName,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
                LeaveStatusBadge(status = leave.status)
            }
            Spacer(modifier = Modifier.height(8.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                LeaveTypeBadge(type = leave.leaveType)
                Text(
                    text = "${leave.days} day${if (leave.days > 1) "s" else ""}",
                    style = MaterialTheme.typography.bodyMedium,
                    fontWeight = FontWeight.Medium,
                    color = MaterialTheme.colorScheme.primary
                )
            }
            Spacer(modifier = Modifier.height(12.dp))
            Text(
                text = "From: ${leave.startDate} to ${leave.endDate}",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "Reason: ${leave.reason}",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            if (leave.approvedBy != null) {
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "Approved by: ${leave.approvedBy}",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.tertiary
                )
            }
        }
    }
}

@Composable
fun LeaveStatusBadge(status: LeaveStatus) {
    val (text, containerColor, contentColor) = when (status) {
        LeaveStatus.APPROVED -> Triple(
            "Approved",
            MaterialTheme.colorScheme.primaryContainer,
            MaterialTheme.colorScheme.onPrimaryContainer
        )
        LeaveStatus.PENDING -> Triple(
            "Pending",
            MaterialTheme.colorScheme.tertiaryContainer,
            MaterialTheme.colorScheme.onTertiaryContainer
        )
        LeaveStatus.REJECTED -> Triple(
            "Rejected",
            MaterialTheme.colorScheme.errorContainer,
            MaterialTheme.colorScheme.onErrorContainer
        )
        LeaveStatus.CANCELLED -> Triple(
            "Cancelled",
            MaterialTheme.colorScheme.surfaceVariant,
            MaterialTheme.colorScheme.onSurfaceVariant
        )
    }
    Surface(
        color = containerColor,
        shape = MaterialTheme.shapes.small
    ) {
        Text(
            text = text,
            style = MaterialTheme.typography.labelSmall,
            fontWeight = FontWeight.Medium,
            color = contentColor,
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
        )
    }
}

@Composable
fun LeaveTypeBadge(type: LeaveType) {
    val text = when (type) {
        LeaveType.SICK -> "Sick Leave"
        LeaveType.CASUAL -> "Casual Leave"
        LeaveType.EARNED -> "Earned Leave"
        LeaveType.MATERNITY -> "Maternity Leave"
        LeaveType.PATERNITY -> "Paternity Leave"
    }
    Surface(
        color = MaterialTheme.colorScheme.secondaryContainer,
        shape = MaterialTheme.shapes.small
    ) {
        Text(
            text = text,
            style = MaterialTheme.typography.labelSmall,
            fontWeight = FontWeight.Medium,
            color = MaterialTheme.colorScheme.onSecondaryContainer,
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
        )
    }
}

class LeaveViewModel @javax.inject.Inject constructor(val repository: HRRepository) : androidx.lifecycle.ViewModel()
