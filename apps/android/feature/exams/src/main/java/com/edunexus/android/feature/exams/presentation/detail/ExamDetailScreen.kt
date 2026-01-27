package com.edunexus.android.feature.exams.presentation.detail

import android.widget.Toast
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Assessment
import androidx.compose.material.icons.outlined.CalendarToday
import androidx.compose.material.icons.outlined.Description
import androidx.compose.material.icons.outlined.School
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.edunexus.android.core.network.dto.ExamDto
import com.edunexus.android.feature.exams.presentation.components.ExamStatusBadge
import java.time.LocalDate
import java.time.format.DateTimeFormatter

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ExamDetailScreen(
    examId: String,
    onNavigateBack: () -> Unit,
    onNavigateToResults: (String) -> Unit,
    modifier: Modifier = Modifier,
    viewModel: ExamDetailViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    val context = LocalContext.current

    LaunchedEffect(examId) {
        viewModel.handleIntent(ExamDetailIntent.LoadExam(examId))
    }

    LaunchedEffect(Unit) {
        viewModel.effect.collect { effect ->
            when (effect) {
                is ExamDetailEffect.NavigateBack -> onNavigateBack()
                is ExamDetailEffect.NavigateToResults -> onNavigateToResults(effect.examId)
                is ExamDetailEffect.ShowToast -> Toast.makeText(context, effect.message, Toast.LENGTH_SHORT).show()
            }
        }
    }

    Scaffold(
        modifier = modifier,
        topBar = {
            TopAppBar(
                title = { Text("Exam Details") },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.Default.ArrowBack, "Back")
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
        Box(Modifier.fillMaxSize().padding(paddingValues)) {
            when (val state = uiState) {
                is ExamDetailUiState.Loading -> Box(Modifier.fillMaxSize(), Alignment.Center) { CircularProgressIndicator() }
                is ExamDetailUiState.Success -> ExamDetailContent(state.exam, onViewResults = { onNavigateToResults(examId) })
                is ExamDetailUiState.Error -> Box(Modifier.fillMaxSize(), Alignment.Center) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(state.message, color = MaterialTheme.colorScheme.error)
                        Spacer(Modifier.height(16.dp))
                        Button(onClick = { viewModel.handleIntent(ExamDetailIntent.LoadExam(examId)) }) { Text("Retry") }
                    }
                }
            }
        }
    }
}

@Composable
private fun ExamDetailContent(exam: ExamDto, onViewResults: () -> Unit) {
    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(16.dp)) {
        Card(Modifier.fillMaxWidth(), elevation = CardDefaults.cardElevation(2.dp)) {
            Column(Modifier.padding(16.dp)) {
                Row(Modifier.fillMaxWidth(), Arrangement.SpaceBetween, Alignment.CenterVertically) {
                    Text(exam.name, style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
                    ExamStatusBadge(exam.status)
                }
                Spacer(Modifier.height(16.dp))
                DetailRow(Icons.Outlined.School, "Type", exam.type)
                DetailRow(Icons.Outlined.CalendarToday, "Start Date", formatDate(exam.startDate))
                DetailRow(Icons.Outlined.CalendarToday, "End Date", formatDate(exam.endDate))
                exam.description?.let { DetailRow(Icons.Outlined.Description, "Description", it) }
            }
        }
        Spacer(Modifier.height(16.dp))
        Button(onClick = onViewResults, Modifier.fillMaxWidth()) {
            Icon(Icons.Default.Assessment, null, Modifier.size(20.dp))
            Spacer(Modifier.width(8.dp))
            Text("View Results")
        }
    }
}

@Composable
private fun DetailRow(icon: androidx.compose.ui.graphics.vector.ImageVector, label: String, value: String) {
    Row(Modifier.fillMaxWidth().padding(vertical = 8.dp), verticalAlignment = Alignment.Top) {
        Icon(icon, null, Modifier.size(20.dp), tint = MaterialTheme.colorScheme.primary)
        Spacer(Modifier.width(12.dp))
        Column {
            Text(label, style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
            Text(value, style = MaterialTheme.typography.bodyLarge)
        }
    }
}

private fun formatDate(date: String): String {
    return try {
        val parsed = LocalDate.parse(date, DateTimeFormatter.ofPattern("yyyy-MM-dd"))
        parsed.format(DateTimeFormatter.ofPattern("MMM dd, yyyy"))
    } catch (e: Exception) {
        date
    }
}
