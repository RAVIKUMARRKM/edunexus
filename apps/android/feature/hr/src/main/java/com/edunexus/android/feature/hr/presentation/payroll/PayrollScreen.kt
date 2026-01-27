package com.edunexus.android.feature.hr.presentation.payroll

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.AttachMoney
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.edunexus.android.core.network.dto.PayrollDto
import com.edunexus.android.core.network.dto.PayrollStatus
import com.edunexus.android.core.ui.component.EmptyState
import com.edunexus.android.feature.hr.data.repository.HRRepository
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PayrollScreen(
    onNavigateBack: () -> Unit,
    modifier: Modifier = Modifier,
    repository: HRRepository = hiltViewModel<PayrollViewModel>().repository
) {
    var payrollList by remember { mutableStateOf<List<PayrollDto>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }
    val scope = rememberCoroutineScope()

    LaunchedEffect(Unit) {
        scope.launch {
            repository.getPayroll().fold(
                onSuccess = { payrollList = it; isLoading = false },
                onFailure = { isLoading = false }
            )
        }
    }

    Scaffold(
        modifier = modifier,
        topBar = {
            TopAppBar(
                title = { Text("Payroll Management") },
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
                payrollList.isEmpty() -> {
                    EmptyState(
                        title = "No Payroll Records",
                        description = "No payroll data available",
                        icon = Icons.Default.AttachMoney,
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
                        items(items = payrollList, key = { it.id }) { payroll ->
                            PayrollCard(payroll = payroll)
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun PayrollCard(payroll: PayrollDto) {
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
                    text = payroll.employeeName,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
                PayrollStatusBadge(status = payroll.status)
            }
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "${payroll.month} ${payroll.year}",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Spacer(modifier = Modifier.height(12.dp))
            Divider()
            Spacer(modifier = Modifier.height(12.dp))
            PayrollInfoRow(label = "Basic Salary", amount = payroll.basicSalary)
            PayrollInfoRow(label = "Allowances", amount = payroll.allowances)
            PayrollInfoRow(label = "Deductions", amount = -payroll.deductions)
            Spacer(modifier = Modifier.height(8.dp))
            Divider()
            Spacer(modifier = Modifier.height(8.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = "Net Salary",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary
                )
                Text(
                    text = "$${String.format("%.2f", payroll.netSalary)}",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary
                )
            }
        }
    }
}

@Composable
fun PayrollInfoRow(label: String, amount: Double) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(text = label, style = MaterialTheme.typography.bodyMedium)
        Text(
            text = "$${String.format("%.2f", amount)}",
            style = MaterialTheme.typography.bodyMedium,
            fontWeight = FontWeight.Medium
        )
    }
}

@Composable
fun PayrollStatusBadge(status: PayrollStatus) {
    val (text, containerColor, contentColor) = when (status) {
        PayrollStatus.PAID -> Triple(
            "Paid",
            MaterialTheme.colorScheme.primaryContainer,
            MaterialTheme.colorScheme.onPrimaryContainer
        )
        PayrollStatus.PENDING -> Triple(
            "Pending",
            MaterialTheme.colorScheme.tertiaryContainer,
            MaterialTheme.colorScheme.onTertiaryContainer
        )
        PayrollStatus.FAILED -> Triple(
            "Failed",
            MaterialTheme.colorScheme.errorContainer,
            MaterialTheme.colorScheme.onErrorContainer
        )
    }
    Box(
        modifier = Modifier
            .wrapContentSize()
            .padding(horizontal = 8.dp, vertical = 4.dp)
    ) {
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
}

class PayrollViewModel @javax.inject.Inject constructor(val repository: HRRepository) : androidx.lifecycle.ViewModel()
