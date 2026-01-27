package com.edunexus.android.feature.exams.presentation.list

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
import com.edunexus.android.core.ui.component.EmptyState
import com.edunexus.android.core.ui.component.FilterChipItem
import com.edunexus.android.core.ui.component.SearchBar
import com.edunexus.android.core.ui.component.SingleSelectFilterChips
import com.edunexus.android.feature.exams.presentation.components.ExamCard

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ExamsScreen(
    onNavigateToDetail: (String) -> Unit,
    onNavigateToResults: (String) -> Unit,
    modifier: Modifier = Modifier,
    viewModel: ExamsViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    val context = LocalContext.current
    var searchQuery by remember { mutableStateOf("") }
    var selectedFilter by remember { mutableStateOf<String?>(null) }

    LaunchedEffect(Unit) {
        viewModel.effect.collect { effect ->
            when (effect) {
                is ExamsEffect.NavigateToDetail -> onNavigateToDetail(effect.examId)
                is ExamsEffect.NavigateToResults -> onNavigateToResults(effect.examId)
                is ExamsEffect.ShowToast -> Toast.makeText(context, effect.message, Toast.LENGTH_SHORT).show()
            }
        }
    }

    Scaffold(
        modifier = modifier,
        topBar = {
            TopAppBar(
                title = { Text("Exams") },
                actions = {
                    IconButton(onClick = { viewModel.handleIntent(ExamsIntent.RefreshExams) }) {
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
                onValueChange = { searchQuery = it; viewModel.handleIntent(ExamsIntent.SearchExams(it)) },
                placeholder = "Search exams...",
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
            )
            Spacer(Modifier.height(8.dp))
            SingleSelectFilterChips(
                chips = listOf(
                    FilterChipItem("all", "ALL", selected = selectedFilter == null),
                    FilterChipItem("upcoming", "UPCOMING", selected = selectedFilter == "UPCOMING"),
                    FilterChipItem("ongoing", "ONGOING", selected = selectedFilter == "ONGOING"),
                    FilterChipItem("completed", "COMPLETED", selected = selectedFilter == "COMPLETED"),
                    FilterChipItem("cancelled", "CANCELLED", selected = selectedFilter == "CANCELLED")
                ),
                selectedId = selectedFilter,
                onChipSelected = { chip ->
                    selectedFilter = if (chip.id == "all") null else chip.label
                    viewModel.handleIntent(ExamsIntent.FilterByStatus(selectedFilter))
                },
                modifier = Modifier.fillMaxWidth()
            )
            Spacer(Modifier.height(8.dp))
            Box(Modifier.fillMaxSize()) {
                when (val state = uiState) {
                    is ExamsUiState.Loading -> Box(Modifier.fillMaxSize(), Alignment.Center) { CircularProgressIndicator() }
                    is ExamsUiState.Success -> LazyColumn(Modifier.fillMaxSize(), PaddingValues(16.dp), Arrangement.spacedBy(12.dp)) {
                        items(state.exams, key = { it.id }) { exam ->
                            ExamCard(exam, onClick = { viewModel.handleIntent(ExamsIntent.NavigateToDetail(exam.id)) })
                        }
                    }
                    is ExamsUiState.Empty -> EmptyState("No Exams Found", state.message, Icons.Default.Assessment, null, null)
                    is ExamsUiState.Error -> EmptyState("Error", state.message, null, "Retry", { viewModel.handleIntent(ExamsIntent.RefreshExams) })
                }
            }
        }
    }
}
