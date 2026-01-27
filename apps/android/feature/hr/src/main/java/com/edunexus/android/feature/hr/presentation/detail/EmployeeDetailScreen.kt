package com.edunexus.android.feature.hr.presentation.detail

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.edunexus.android.core.network.dto.EmployeeDto
import com.edunexus.android.feature.hr.presentation.HRViewModel
import com.edunexus.android.feature.hr.presentation.HRIntent
import com.edunexus.android.feature.hr.presentation.components.EmployeeStatusBadge
import com.edunexus.android.feature.hr.presentation.components.EmployeeAvatar

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun EmployeeDetailScreen(
    employeeId: String,
    onNavigateBack: () -> Unit,
    modifier: Modifier = Modifier,
    viewModel: HRViewModel = hiltViewModel()
) {
    var employee by remember { mutableStateOf<EmployeeDto?>(null) }
    
    LaunchedEffect(employeeId) {
        viewModel.uiState.collect { state ->
            if (state is com.edunexus.android.feature.hr.presentation.HRUiState.Success) {
                employee = state.employees.find { it.id == employeeId }
            }
        }
    }

    Scaffold(
        modifier = modifier,
        topBar = {
            TopAppBar(
                title = { Text("Employee Details") },
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
        if (employee == null) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues),
                contentAlignment = Alignment.Center
            ) {
                CircularProgressIndicator()
            }
        } else {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
                    .verticalScroll(rememberScrollState())
                    .padding(16.dp)
            ) {
                EmployeeHeader(employee = employee!!)
                Spacer(modifier = Modifier.height(24.dp))
                EmployeeInfoCard(employee = employee!!)
            }
        }
    }
}

@Composable
fun EmployeeHeader(employee: EmployeeDto) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            EmployeeAvatar(name = employee.name, size = 80.dp)
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = employee.name,
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onPrimaryContainer
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = employee.designation,
                style = MaterialTheme.typography.titleMedium,
                color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.8f)
            )
            Spacer(modifier = Modifier.height(8.dp))
            EmployeeStatusBadge(status = employee.status)
        }
    }
}

@Composable
fun EmployeeInfoCard(employee: EmployeeDto) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(
                text = "Personal Information",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.primary
            )
            Spacer(modifier = Modifier.height(16.dp))
            InfoRow(icon = Icons.Outlined.Badge, label = "Employee ID", value = employee.employeeId)
            InfoRow(icon = Icons.Outlined.Email, label = "Email", value = employee.email)
            employee.phone?.let {
                InfoRow(icon = Icons.Outlined.Phone, label = "Phone", value = it)
            }
            InfoRow(icon = Icons.Outlined.BusinessCenter, label = "Department", value = employee.department)
            InfoRow(icon = Icons.Outlined.CalendarToday, label = "Joining Date", value = employee.joiningDate)
            employee.salary?.let {
                InfoRow(icon = Icons.Outlined.AttachMoney, label = "Salary", value = "$${String.format("%.2f", it)}")
            }
        }
    }
}

@Composable
fun InfoRow(icon: androidx.compose.ui.graphics.vector.ImageVector, label: String, value: String) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            tint = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.size(24.dp)
        )
        Spacer(modifier = Modifier.width(16.dp))
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = label,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Text(
                text = value,
                style = MaterialTheme.typography.bodyLarge,
                fontWeight = FontWeight.Medium,
                color = MaterialTheme.colorScheme.onSurface
            )
        }
    }
}
