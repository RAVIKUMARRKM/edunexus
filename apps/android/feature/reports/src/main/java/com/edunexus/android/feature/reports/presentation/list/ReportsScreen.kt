package com.edunexus.android.feature.reports.presentation.list

import android.widget.Toast
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Assessment
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.edunexus.android.core.network.dto.ReportType
import com.edunexus.android.core.ui.component.EmptyState
import com.edunexus.android.core.ui.component.FilterChipItem
import com.edunexus.android.core.ui.component.SearchBar
import com.edunexus.android.core.ui.component.SingleSelectFilterChips
import com.edunexus.android.feature.reports.presentation.components.ReportCard

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ReportsScreen(
    onNavigateToDetail: (String) -> Unit,
    modifier: Modifier = Modifier,
    viewModel: ReportsViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    val context = LocalContext.current
    var searchQuery by remember { mutableStateOf("") }
    var selectedFilter by remember { mutableStateOf<String?>(null) }

    LaunchedEffect(Unit) {
        viewModel.effect.collect { effect ->
            when (effect) {
                is ReportsEffect.NavigateToDetail -> onNavigateToDetail(effect.reportId)
                is ReportsEffect.ShowToast -> Toast.makeText(context, effect.message, Toast.LENGTH_SHORT).show()
            }
        }
    }

    Scaffold(
        modifier = modifier,
        topBar = {
            TopAppBar(
                title = { Text("Reports") },
                actions = {
                    IconButton(onClick = { viewModel.handleIntent(ReportsIntent.RefreshReports) }) {
                        Icon(Icons.Default.Refresh, "Refresh")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primary,
                    titleContentColor = MaterialTheme.colorScheme.onPrimary,
                    actionIconContentColor = MaterialTheme.colorScheme.onPrimary
                )
            )
        }
    ) { paddingValues ->
        Column(Modifier.fillMaxSize().padding(paddingValues)) {
            SearchBar(
                value = searchQuery,
                onValueChange = { searchQuery = it; viewModel.handleIntent(ReportsIntent.SearchReports(it)) },
                placeholder = "Search reports...",
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
            )
            Spacer(Modifier.height(8.dp))
            SingleSelectFilterChips(
                chips = listOf(
                    FilterChipItem("all", "ALL", selected = selectedFilter == null),
                    FilterChipItem("students", "STUDENTS", selected = selectedFilter == "STUDENTS"),
                    FilterChipItem("teachers", "TEACHERS", selected = selectedFilter == "TEACHERS"),
                    FilterChipItem("attendance", "ATTENDANCE", selected = selectedFilter == "ATTENDANCE"),
                    FilterChipItem("fees", "FEES", selected = selectedFilter == "FEES"),
                    FilterChipItem("exams", "EXAMS", selected = selectedFilter == "EXAMS"),
                    FilterChipItem("library", "LIBRARY", selected = selectedFilter == "LIBRARY")
                ),
                selectedId = selectedFilter,
                onChipSelected = { chip ->
                    selectedFilter = if (chip.id == "all") null else chip.label
                    val reportType = when (selectedFilter) {
                        "STUDENTS" -> ReportType.STUDENTS
                        "TEACHERS" -> ReportType.TEACHERS
                        "ATTENDANCE" -> ReportType.ATTENDANCE
                        "FEES" -> ReportType.FEES
                        "EXAMS" -> ReportType.EXAMS
                        "LIBRARY" -> ReportType.LIBRARY
                        else -> null
                    }
                    viewModel.handleIntent(ReportsIntent.FilterByType(reportType))
                },
                modifier = Modifier.fillMaxWidth()
            )
            Spacer(Modifier.height(8.dp))
            Box(Modifier.fillMaxSize()) {
                when (val state = uiState) {
                    is ReportsUiState.Loading -> Box(Modifier.fillMaxSize(), Alignment.Center) { CircularProgressIndicator() }
                    is ReportsUiState.Success -> LazyColumn(Modifier.fillMaxSize(), PaddingValues(16.dp), Arrangement.spacedBy(12.dp)) {
                        items(state.reports, key = { it.id }) { report ->
                            ReportCard(report, onClick = { viewModel.handleIntent(ReportsIntent.NavigateToDetail(report.id)) })
                        }
                    }
                    is ReportsUiState.Empty -> EmptyState("No Reports Found", state.message, Icons.Default.Assessment, null, null)
                    is ReportsUiState.Error -> EmptyState("Error", state.message, null, "Retry", { viewModel.handleIntent(ReportsIntent.RefreshReports) })
                }
            }
        }
    }
}
