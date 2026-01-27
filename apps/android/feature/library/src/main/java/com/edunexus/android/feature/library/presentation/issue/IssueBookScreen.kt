package com.edunexus.android.feature.library.presentation.issue

import android.widget.Toast
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.edunexus.android.feature.library.presentation.LibraryEffect
import com.edunexus.android.feature.library.presentation.LibraryViewModel
import java.text.SimpleDateFormat
import java.util.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun IssueBookScreen(
    bookId: String,
    onNavigateBack: () -> Unit,
    modifier: Modifier = Modifier,
    viewModel: LibraryViewModel = hiltViewModel()
) {
    val context = LocalContext.current
    val book = remember { viewModel.getBook(bookId) }
    var studentId by remember { mutableStateOf("") }
    var teacherId by remember { mutableStateOf("") }
    var selectedUserType by remember { mutableStateOf(UserType.STUDENT) }
    var daysToIssue by remember { mutableStateOf("14") }

    LaunchedEffect(Unit) {
        viewModel.effect.collect { effect ->
            when (effect) {
                is LibraryEffect.NavigateBack -> onNavigateBack()
                is LibraryEffect.ShowToast -> Toast.makeText(context, effect.message, Toast.LENGTH_SHORT).show()
                else -> {}
            }
        }
    }

    Scaffold(
        modifier = modifier,
        topBar = {
            TopAppBar(
                title = { Text("Issue Book") },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
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
        Column(
            modifier = Modifier.fillMaxSize().padding(paddingValues).verticalScroll(rememberScrollState()).padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            book?.let {
                Card(colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)) {
                    Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Text(text = "Book Details", style = MaterialTheme.typography.titleMedium)
                        Text(text = "Title: ${it.title}", style = MaterialTheme.typography.bodyMedium)
                        Text(text = "Author: ${it.author}", style = MaterialTheme.typography.bodyMedium)
                        Text(text = "Available: ${it.available}/${it.quantity}", style = MaterialTheme.typography.bodyMedium)
                    }
                }
            }

            Text(text = "Issue To", style = MaterialTheme.typography.titleMedium)
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                FilterChip(
                    selected = selectedUserType == UserType.STUDENT,
                    onClick = { selectedUserType = UserType.STUDENT },
                    label = { Text("Student") }
                )
                FilterChip(
                    selected = selectedUserType == UserType.TEACHER,
                    onClick = { selectedUserType = UserType.TEACHER },
                    label = { Text("Teacher") }
                )
            }

            if (selectedUserType == UserType.STUDENT) {
                OutlinedTextField(
                    value = studentId,
                    onValueChange = { studentId = it },
                    label = { Text("Student ID") },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true
                )
            } else {
                OutlinedTextField(
                    value = teacherId,
                    onValueChange = { teacherId = it },
                    label = { Text("Teacher ID") },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true
                )
            }

            OutlinedTextField(
                value = daysToIssue,
                onValueChange = { daysToIssue = it.filter { c -> c.isDigit() } },
                label = { Text("Issue Duration (days)") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true
            )

            Spacer(modifier = Modifier.height(8.dp))

            Button(
                onClick = {
                    val days = daysToIssue.toIntOrNull() ?: 14
                    val dueDate = calculateDueDate(days)
                    viewModel.issueBook(
                        bookId = bookId,
                        studentId = if (selectedUserType == UserType.STUDENT) studentId.takeIf { it.isNotBlank() } else null,
                        teacherId = if (selectedUserType == UserType.TEACHER) teacherId.takeIf { it.isNotBlank() } else null,
                        dueDate = dueDate
                    )
                },
                modifier = Modifier.fillMaxWidth(),
                enabled = book \!= null && ((selectedUserType == UserType.STUDENT && studentId.isNotBlank()) || (selectedUserType == UserType.TEACHER && teacherId.isNotBlank()))
            ) {
                Text("Issue Book")
            }
        }
    }
}

private fun calculateDueDate(days: Int): String {
    val calendar = Calendar.getInstance()
    calendar.add(Calendar.DAY_OF_YEAR, days)
    val sdf = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
    return sdf.format(calendar.time)
}

enum class UserType {
    STUDENT, TEACHER
}
