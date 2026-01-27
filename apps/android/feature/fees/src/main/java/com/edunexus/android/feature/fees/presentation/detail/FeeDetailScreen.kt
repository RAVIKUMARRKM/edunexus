package com.edunexus.android.feature.students.presentation.detail

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.edunexus.android.core.network.dto.StudentDto
import com.edunexus.android.core.ui.component.EmptyState
import com.edunexus.android.feature.students.presentation.components.StudentAvatar
import com.edunexus.android.feature.students.presentation.components.StudentStatusBadge
import java.time.LocalDate
import java.time.Period
import java.time.format.DateTimeFormatter

/**
 * Student Detail Screen
 * Displays comprehensive student information organized in sections
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun StudentDetailScreen(
    onNavigateBack: () -> Unit,
    onNavigateToEdit: (String) -> Unit,
    modifier: Modifier = Modifier,
    viewModel: StudentDetailViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    val context = LocalContext.current
    var showDeleteDialog by remember { mutableStateOf(false) }

    // Handle side effects
    LaunchedEffect(Unit) {
        viewModel.effect.collect { effect ->
            when (effect) {
                is StudentDetailEffect.NavigateBack -> onNavigateBack()
                is StudentDetailEffect.NavigateToEdit -> onNavigateToEdit(effect.studentId)
                is StudentDetailEffect.ShowToast -> {
                    Toast.makeText(context, effect.message, Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

    Scaffold(
        modifier = modifier,
        topBar = {
            TopAppBar(
                title = { Text("Student Details") },
                navigationIcon = {
                    IconButton(onClick = { viewModel.handleIntent(StudentDetailIntent.NavigateBack) }) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                },
                actions = {
                    // TODO: Add role-based check (ADMIN/PRINCIPAL only)
                    IconButton(onClick = { viewModel.handleIntent(StudentDetailIntent.NavigateToEdit) }) {
                        Icon(Icons.Default.Edit, contentDescription = "Edit")
                    }
                    IconButton(onClick = { showDeleteDialog = true }) {
                        Icon(Icons.Default.Delete, contentDescription = "Delete")
                    }
                }
            )
        }
    ) { paddingValues ->
        when (val state = uiState) {
            is StudentDetailUiState.Loading -> {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(paddingValues),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator()
                }
            }

            is StudentDetailUiState.Success -> {
                StudentDetailContent(
                    student = state.student,
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(paddingValues)
                )
            }

            is StudentDetailUiState.Error -> {
                EmptyState(
                    title = "Error",
                    description = state.message,
                    icon = null,
                    actionLabel = "Retry",
                    onActionClick = {
                        viewModel.handleIntent(StudentDetailIntent.LoadStudent)
                    },
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(paddingValues)
                )
            }
        }
    }

    // Delete Confirmation Dialog
    if (showDeleteDialog) {
        AlertDialog(
            onDismissRequest = { showDeleteDialog = false },
            title = { Text("Delete Student") },
            text = { Text("Are you sure you want to delete this student? This action cannot be undone.") },
            confirmButton = {
                Button(
                    onClick = {
                        showDeleteDialog = false
                        viewModel.handleIntent(StudentDetailIntent.DeleteStudent)
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

@Composable
private fun StudentDetailContent(
    student: StudentDto,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .verticalScroll(rememberScrollState())
            .padding(16.dp)
    ) {
        // Header with Avatar and Name
        Column(
            modifier = Modifier.fillMaxWidth(),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            StudentAvatar(
                photoUrl = student.photo,
                firstName = student.firstName,
                lastName = student.lastName,
                size = 120.dp
            )

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = "${student.firstName} ${student.lastName}",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold
            )

            Spacer(modifier = Modifier.height(8.dp))

            StudentStatusBadge(status = student.status)
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Personal Information
        SectionCard(title = "Personal Information") {
            DetailRow("Admission Number", student.admissionNumber)
            student.rollNo?.let { DetailRow("Roll Number", it) }
            DetailRow("Date of Birth", formatDate(student.dateOfBirth))
            DetailRow("Age", calculateAge(student.dateOfBirth))
            DetailRow("Gender", student.gender)
            student.bloodGroup?.let { DetailRow("Blood Group", it) }
            student.religion?.let { DetailRow("Religion", it) }
            student.caste?.let { DetailRow("Caste", it) }
            student.nationality?.let { DetailRow("Nationality", it) }
            student.motherTongue?.let { DetailRow("Mother Tongue", it) }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Contact Information
        SectionCard(title = "Contact Information") {
            student.email?.let { DetailRow("Email", it) }
            student.phone?.let { DetailRow("Phone", it) }
            student.address?.let { DetailRow("Address", it) }
            student.city?.let { DetailRow("City", it) }
            student.state?.let { DetailRow("State", it) }
            student.pincode?.let { DetailRow("Pincode", it) }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Academic Information
        SectionCard(title = "Academic Information") {
            student.classInfo?.let { DetailRow("Class", it.name) }
            student.section?.let { DetailRow("Section", it.name) }
            student.admissionDate?.let { DetailRow("Admission Date", formatDate(it)) }
            student.previousSchool?.let { DetailRow("Previous School", it) }
            if (student.status == "LEFT" || student.status == "GRADUATED") {
                student.leftDate?.let { DetailRow("Left Date", formatDate(it)) }
                student.leftReason?.let { DetailRow("Reason", it) }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Parent Information
        student.parent?.let { parent ->
            SectionCard(title = "Parent Information") {
                parent.fatherName?.let { DetailRow("Father's Name", it) }
                parent.motherName?.let { DetailRow("Mother's Name", it) }
                parent.guardianName?.let { DetailRow("Guardian's Name", it) }
                parent.relationship?.let { DetailRow("Relationship", it) }
                parent.email?.let { DetailRow("Parent Email", it) }
                DetailRow("Parent Phone", parent.phone)
                parent.occupation?.let { DetailRow("Occupation", it) }
                parent.address?.let { DetailRow("Address", it) }
            }

            Spacer(modifier = Modifier.height(16.dp))
        }

        // Medical Information
        if (student.medicalConditions != null || student.allergies != null) {
            SectionCard(title = "Medical Information") {
                student.medicalConditions?.let { DetailRow("Medical Conditions", it) }
                student.allergies?.let { DetailRow("Allergies", it) }
            }
        }
    }
}

@Composable
private fun SectionCard(
    title: String,
    content: @Composable () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceVariant
        )
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            Text(
                text = title,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.primary
            )

            Spacer(modifier = Modifier.height(12.dp))

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
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(
            text = label,
            style = MaterialTheme.typography.bodyMedium,
            fontWeight = FontWeight.Medium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.weight(1f)
        )
        Text(
            text = value,
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurface,
            modifier = Modifier.weight(1f)
        )
    }
}

private fun formatDate(dateString: String): String {
    return try {
        val date = LocalDate.parse(dateString, DateTimeFormatter.ISO_DATE_TIME)
        date.format(DateTimeFormatter.ofPattern("dd MMM yyyy"))
    } catch (e: Exception) {
        try {
            val date = LocalDate.parse(dateString, DateTimeFormatter.ISO_DATE)
            date.format(DateTimeFormatter.ofPattern("dd MMM yyyy"))
        } catch (e: Exception) {
            dateString
        }
    }
}

private fun calculateAge(dateOfBirth: String): String {
    return try {
        val birthDate = LocalDate.parse(dateOfBirth, DateTimeFormatter.ISO_DATE_TIME)
        val age = Period.between(birthDate, LocalDate.now()).years
        "$age years"
    } catch (e: Exception) {
        try {
            val birthDate = LocalDate.parse(dateOfBirth, DateTimeFormatter.ISO_DATE)
            val age = Period.between(birthDate, LocalDate.now()).years
            "$age years"
        } catch (e: Exception) {
            "N/A"
        }
    }
}
