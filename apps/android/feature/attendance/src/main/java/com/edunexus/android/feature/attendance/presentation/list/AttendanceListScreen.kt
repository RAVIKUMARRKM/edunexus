package com.edunexus.android.feature.attendance.presentation.list

import android.widget.Toast
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.CalendarToday
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.edunexus.android.core.ui.component.EmptyState
import com.edunexus.android.core.ui.component.FilterChipItem
import com.edunexus.android.core.ui.component.SearchBar
import com.edunexus.android.core.ui.component.SingleSelectFilterChips
import com.edunexus.android.feature.attendance.presentation.components.AttendanceCard
import java.time.LocalDate
import java.time.format.DateTimeFormatter

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AttendanceListScreen(
    onNavigateToMark: () -> Unit,
    onNavigateToReport: () -> Unit,
    modifier: Modifier = Modifier,
    viewModel: AttendanceListViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    val context = LocalContext.current
    var selectedDate by remember { mutableStateOf(LocalDate.now()) }
    var selectedStatus by remember { mutableStateOf<String?>(null) }

    LaunchedEffect(Unit) {
        viewModel.effect.collect { effect ->
            when (effect) {
                is AttendanceListEffect.ShowToast -> Toast.makeText(context, effect.message, Toast.LENGTH_SHORT).show()
                is AttendanceListEffect.NavigateToMark -> onNavigateToMark()
                is AttendanceListEffect.NavigateToReport -> onNavigateToReport()
            }
        }
    }

    Scaffold(
        modifier = modifier,
        topBar = {
            TopAppBar(
                title = { Text("Attendance") },
                actions = {
                    IconButton(onClick = { viewModel.handleIntent(AttendanceListIntent.RefreshAttendance) }) {
                        Icon(Icons.Default.Refresh, "Refresh")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primary,
                    titleContentColor = MaterialTheme.colorScheme.onPrimary,
                    actionIconContentColor = MaterialTheme.colorScheme.onPrimary
                )
            )
        },
        floatingActionButton = {
            FloatingActionButton(
                onClick = { viewModel.handleIntent(AttendanceListIntent.NavigateToMark) },
                containerColor = MaterialTheme.colorScheme.primary
            ) {
                Icon(Icons.Default.Add, "Mark Attendance", tint = MaterialTheme.colorScheme.onPrimary)
            }
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier.fillMaxSize().padding(paddingValues)
        ) {
            // Date Selector
            Card(
                modifier = Modifier.fillMaxWidth().padding(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth().padding(16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(Icons.Default.CalendarToday, "Date", tint = MaterialTheme.colorScheme.primary)
                    Text(
                        text = selectedDate.format(DateTimeFormatter.ofPattern("MMM dd, yyyy")),
                        style = MaterialTheme.typography.titleMedium
                    )
                    TextButton(onClick = { viewModel.handleIntent(AttendanceListIntent.FilterByDate(selectedDate.toString())) }) {
                        Text("Filter")
                    }
                }
            }

            // Status Filter
            val filterChips = listOf(
                FilterChipItem("all", "ALL", selected = selectedStatus == null),
                FilterChipItem("present", "PRESENT", selected = selectedStatus == "PRESENT"),
                FilterChipItem("absent", "ABSENT", selected = selectedStatus == "ABSENT"),
                FilterChipItem("late", "LATE", selected = selectedStatus == "LATE"),
                FilterChipItem("excused", "EXCUSED", selected = selectedStatus == "EXCUSED")
            )

            SingleSelectFilterChips(
                chips = filterChips,
                selectedId = selectedStatus,
                onChipSelected = { chip ->
                    val newFilter = if (chip.id == "all") null else chip.label
                    selectedStatus = newFilter
                    viewModel.handleIntent(AttendanceListIntent.FilterByStatus(newFilter))
                },
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(8.dp))

            Box(modifier = Modifier.fillMaxSize()) {
                when (val state = uiState) {
                    is AttendanceListUiState.Loading -> {
                        Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                            CircularProgressIndicator()
                        }
                    }
                    is AttendanceListUiState.Success -> {
                        LazyColumn(
                            modifier = Modifier.fillMaxSize(),
                            contentPadding = PaddingValues(16.dp),
                            verticalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            items(items = state.attendanceList, key = { it.id }) { attendance ->
                                AttendanceCard(attendance = attendance, onClick = {})
                            }
                        }
                    }
                    is AttendanceListUiState.Empty -> {
                        EmptyState(
                            title = "No Attendance Records",
                            description = state.message,
                            icon = Icons.Default.CalendarToday,
                            actionLabel = "Mark Attendance",
                            onActionClick = { viewModel.handleIntent(AttendanceListIntent.NavigateToMark) }
                        )
                    }
                    is AttendanceListUiState.Error -> {
                        EmptyState(
                            title = "Error",
                            description = state.message,
                            icon = null,
                            actionLabel = "Retry",
                            onActionClick = { viewModel.handleIntent(AttendanceListIntent.RefreshAttendance) }
                        )
                    }
                }
            }
        }
    }
}
