package com.edunexus.android.feature.teachers

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.edunexus.android.core.model.Teacher
import com.edunexus.android.core.model.enums.Role
import com.edunexus.android.core.ui.component.LoadingIndicator

/**
 * Teacher Detail Screen
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TeacherDetailScreen(
    onNavigateBack: () -> Unit,
    onNavigateToEdit: (String) -> Unit,
    userRole: Role = Role.ADMIN, // TODO: Get from auth state
    viewModel: TeacherDetailViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    var showDeleteDialog by remember { mutableStateOf(false) }

    // Navigate back if deleted
    LaunchedEffect(uiState.isDeleted) {
        if (uiState.isDeleted) {
            onNavigateBack()
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Teacher Details") },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                },
                actions = {
                    // Show edit/delete for ADMIN/PRINCIPAL only
                    if (userRole == Role.ADMIN || userRole == Role.PRINCIPAL) {
                        IconButton(
                            onClick = { uiState.teacher?.let { onNavigateToEdit(it.id) } }
                        ) {
                            Icon(Icons.Default.Edit, contentDescription = "Edit")
                        }
                        IconButton(
                            onClick = { showDeleteDialog = true }
                        ) {
                            Icon(Icons.Default.Delete, contentDescription = "Delete")
                        }
                    }
                }
            )
        }
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            when {
                uiState.isLoading -> {
                    LoadingIndicator(modifier = Modifier.fillMaxSize())
                }

                uiState.error != null -> {
                    Text(
                        text = uiState.error ?: "An error occurred",
                        modifier = Modifier.padding(16.dp),
                        color = MaterialTheme.colorScheme.error
                    )
                }

                uiState.teacher != null -> {
                    TeacherDetailContent(
                        teacher = uiState.teacher!!,
                        userRole = userRole
                    )
                }
            }
        }

        // Delete Confirmation Dialog
        if (showDeleteDialog) {
            AlertDialog(
                onDismissRequest = { showDeleteDialog = false },
                title = { Text("Delete Teacher") },
                text = { Text("Are you sure you want to delete this teacher? This action cannot be undone.") },
                confirmButton = {
                    TextButton(
                        onClick = {
                            viewModel.onEvent(TeacherDetailEvent.DeleteTeacher)
                            showDeleteDialog = false
                        }
                    ) {
                        Text("Delete")
                    }
                },
                dismissButton = {
                    TextButton(onClick = { showDeleteDialog = false }) {
                        Text("Cancel")
                    }
                }
            )
        }
    }
}

@Composable
private fun TeacherDetailContent(
    teacher: Teacher,
    userRole: Role
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Personal Information
        SectionCard(title = "Personal Information") {
            DetailRow(label = "First Name", value = teacher.firstName)
            DetailRow(label = "Last Name", value = teacher.lastName)
            DetailRow(label = "Date of Birth", value = teacher.dateOfBirth)
            DetailRow(label = "Gender", value = teacher.gender.name)
            teacher.bloodGroup?.let {
                DetailRow(label = "Blood Group", value = it)
            }
        }

        // Contact Information
        SectionCard(title = "Contact Information") {
            teacher.address?.let {
                DetailRow(label = "Address", value = it)
            }
            teacher.city?.let {
                DetailRow(label = "City", value = it)
            }
            teacher.state?.let {
                DetailRow(label = "State", value = it)
            }
            teacher.pincode?.let {
                DetailRow(label = "Pincode", value = it)
            }
            teacher.emergencyContact?.let {
                DetailRow(label = "Emergency Contact", value = it)
            }
        }

        // Professional Information
        SectionCard(title = "Professional Information") {
            DetailRow(label = "Employee ID", value = teacher.employeeId)
            DetailRow(label = "Qualification", value = teacher.qualification)
            teacher.specialization?.let {
                DetailRow(label = "Specialization", value = it)
            }
            DetailRow(label = "Experience", value = "${teacher.experience} years")
            DetailRow(label = "Joining Date", value = teacher.joiningDate)
        }

        // Department & Designation
        SectionCard(title = "Department & Designation") {
            teacher.departmentId?.let {
                DetailRow(label = "Department", value = it)
            }
            teacher.designation?.let {
                DetailRow(label = "Designation", value = it)
            }
        }

        // Salary (Show only to ADMIN/ACCOUNTANT)
        if (userRole == Role.ADMIN || userRole == Role.ACCOUNTANT) {
            SectionCard(title = "Salary Details") {
                DetailRow(
                    label = "Basic Salary",
                    value = "₹${String.format("%.2f", teacher.basicSalary)}"
                )
            }
        }

        // Status
        SectionCard(title = "Status") {
            DetailRow(label = "Employment Status", value = teacher.status.name)
            teacher.leftDate?.let {
                DetailRow(label = "Left Date", value = it)
            }
        }
    }
}

@Composable
private fun SectionCard(
    title: String,
    content: @Composable ColumnScope.() -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Text(
                text = title,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.primary
            )
            Divider()
            content()
        }
    }
}

@Composable
private fun DetailRow(
    label: String,
    value: String
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(
            text = label,
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.weight(1f)
        )
        Text(
            text = value,
            style = MaterialTheme.typography.bodyMedium,
            fontWeight = FontWeight.Medium,
            modifier = Modifier.weight(1f)
        )
    }
}
