package com.edunexus.android.feature.teachers

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.ArrowDropDown
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.edunexus.android.core.model.enums.EmployeeStatus
import com.edunexus.android.core.model.enums.Gender
import com.edunexus.android.core.ui.component.LoadingIndicator

/**
 * Add/Edit Teacher Screen
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddEditTeacherScreen(
    onNavigateBack: () -> Unit,
    viewModel: AddEditTeacherViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    // Navigate back if saved
    LaunchedEffect(uiState.isSaved) {
        if (uiState.isSaved) {
            onNavigateBack()
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(if (uiState.isEditMode) "Edit Teacher" else "Add Teacher")
                },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
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
            if (uiState.isLoading) {
                LoadingIndicator(modifier = Modifier.fillMaxSize())
            } else {
                TeacherForm(
                    uiState = uiState,
                    onEvent = viewModel::onEvent
                )
            }
        }
    }
}

@Composable
private fun TeacherForm(
    uiState: AddEditTeacherUiState,
    onEvent: (AddEditTeacherEvent) -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Error Message
        if (uiState.error != null) {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.errorContainer
                )
            ) {
                Text(
                    text = uiState.error,
                    modifier = Modifier.padding(16.dp),
                    color = MaterialTheme.colorScheme.onErrorContainer
                )
            }
        }

        // Personal Information Section
        Text(
            text = "Personal Information",
            style = MaterialTheme.typography.titleMedium,
            color = MaterialTheme.colorScheme.primary
        )

        OutlinedTextField(
            value = uiState.firstName,
            onValueChange = { onEvent(AddEditTeacherEvent.FirstNameChanged(it)) },
            label = { Text("First Name *") },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true
        )

        OutlinedTextField(
            value = uiState.lastName,
            onValueChange = { onEvent(AddEditTeacherEvent.LastNameChanged(it)) },
            label = { Text("Last Name *") },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true
        )

        OutlinedTextField(
            value = uiState.dateOfBirth,
            onValueChange = { onEvent(AddEditTeacherEvent.DateOfBirthChanged(it)) },
            label = { Text("Date of Birth (YYYY-MM-DD)") },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true,
            placeholder = { Text("2000-01-01") }
        )

        GenderDropdown(
            selectedGender = uiState.gender,
            onGenderSelected = { onEvent(AddEditTeacherEvent.GenderChanged(it)) }
        )

        BloodGroupDropdown(
            selectedBloodGroup = uiState.bloodGroup,
            onBloodGroupSelected = { onEvent(AddEditTeacherEvent.BloodGroupChanged(it)) }
        )

        Divider()

        // Contact Information Section
        Text(
            text = "Contact Information",
            style = MaterialTheme.typography.titleMedium,
            color = MaterialTheme.colorScheme.primary
        )

        OutlinedTextField(
            value = uiState.address,
            onValueChange = { onEvent(AddEditTeacherEvent.AddressChanged(it)) },
            label = { Text("Address") },
            modifier = Modifier.fillMaxWidth(),
            minLines = 2,
            maxLines = 3
        )

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            OutlinedTextField(
                value = uiState.city,
                onValueChange = { onEvent(AddEditTeacherEvent.CityChanged(it)) },
                label = { Text("City") },
                modifier = Modifier.weight(1f),
                singleLine = true
            )

            OutlinedTextField(
                value = uiState.state,
                onValueChange = { onEvent(AddEditTeacherEvent.StateChanged(it)) },
                label = { Text("State") },
                modifier = Modifier.weight(1f),
                singleLine = true
            )
        }

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            OutlinedTextField(
                value = uiState.pincode,
                onValueChange = { onEvent(AddEditTeacherEvent.PincodeChanged(it)) },
                label = { Text("Pincode") },
                modifier = Modifier.weight(1f),
                singleLine = true,
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number)
            )

            OutlinedTextField(
                value = uiState.emergencyContact,
                onValueChange = { onEvent(AddEditTeacherEvent.EmergencyContactChanged(it)) },
                label = { Text("Emergency Contact") },
                modifier = Modifier.weight(1f),
                singleLine = true,
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone)
            )
        }

        Divider()

        // Professional Information Section
        Text(
            text = "Professional Information",
            style = MaterialTheme.typography.titleMedium,
            color = MaterialTheme.colorScheme.primary
        )

        OutlinedTextField(
            value = uiState.employeeId,
            onValueChange = { onEvent(AddEditTeacherEvent.EmployeeIdChanged(it)) },
            label = { Text("Employee ID *") },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true
        )

        OutlinedTextField(
            value = uiState.qualification,
            onValueChange = { onEvent(AddEditTeacherEvent.QualificationChanged(it)) },
            label = { Text("Qualification *") },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true,
            placeholder = { Text("B.Ed, M.Sc, etc.") }
        )

        OutlinedTextField(
            value = uiState.specialization,
            onValueChange = { onEvent(AddEditTeacherEvent.SpecializationChanged(it)) },
            label = { Text("Specialization") },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true,
            placeholder = { Text("Mathematics, Physics, etc.") }
        )

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            OutlinedTextField(
                value = uiState.experience,
                onValueChange = { onEvent(AddEditTeacherEvent.ExperienceChanged(it)) },
                label = { Text("Experience (years)") },
                modifier = Modifier.weight(1f),
                singleLine = true,
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number)
            )

            OutlinedTextField(
                value = uiState.joiningDate,
                onValueChange = { onEvent(AddEditTeacherEvent.JoiningDateChanged(it)) },
                label = { Text("Joining Date *") },
                modifier = Modifier.weight(1f),
                singleLine = true,
                placeholder = { Text("2024-01-01") }
            )
        }

        DepartmentDropdown(
            departments = uiState.departments,
            selectedDepartmentId = uiState.departmentId,
            onDepartmentSelected = { onEvent(AddEditTeacherEvent.DepartmentChanged(it)) }
        )

        OutlinedTextField(
            value = uiState.designation,
            onValueChange = { onEvent(AddEditTeacherEvent.DesignationChanged(it)) },
            label = { Text("Designation") },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true,
            placeholder = { Text("Senior Teacher, HOD, etc.") }
        )

        OutlinedTextField(
            value = uiState.basicSalary,
            onValueChange = { onEvent(AddEditTeacherEvent.BasicSalaryChanged(it)) },
            label = { Text("Basic Salary *") },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true,
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
            prefix = { Text("₹") }
        )

        StatusDropdown(
            selectedStatus = uiState.status,
            onStatusSelected = { onEvent(AddEditTeacherEvent.StatusChanged(it)) }
        )

        Divider()

        // Action Buttons
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            OutlinedButton(
                onClick = { /* Navigate back */ },
                modifier = Modifier.weight(1f)
            ) {
                Text("Cancel")
            }

            Button(
                onClick = { onEvent(AddEditTeacherEvent.SaveTeacher) },
                modifier = Modifier.weight(1f),
                enabled = !uiState.isSaving
            ) {
                if (uiState.isSaving) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(20.dp),
                        color = MaterialTheme.colorScheme.onPrimary
                    )
                } else {
                    Text("Save")
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun GenderDropdown(
    selectedGender: Gender,
    onGenderSelected: (Gender) -> Unit
) {
    var expanded by remember { mutableStateOf(false) }

    ExposedDropdownMenuBox(
        expanded = expanded,
        onExpandedChange = { expanded = it }
    ) {
        OutlinedTextField(
            value = selectedGender.name,
            onValueChange = {},
            readOnly = true,
            label = { Text("Gender *") },
            trailingIcon = {
                Icon(Icons.Default.ArrowDropDown, contentDescription = null)
            },
            modifier = Modifier
                .fillMaxWidth()
                .menuAnchor()
        )

        ExposedDropdownMenu(
            expanded = expanded,
            onDismissRequest = { expanded = false }
        ) {
            Gender.values().forEach { gender ->
                DropdownMenuItem(
                    text = { Text(gender.name) },
                    onClick = {
                        onGenderSelected(gender)
                        expanded = false
                    }
                )
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun BloodGroupDropdown(
    selectedBloodGroup: String,
    onBloodGroupSelected: (String) -> Unit
) {
    var expanded by remember { mutableStateOf(false) }
    val bloodGroups = listOf("A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-")

    ExposedDropdownMenuBox(
        expanded = expanded,
        onExpandedChange = { expanded = it }
    ) {
        OutlinedTextField(
            value = selectedBloodGroup,
            onValueChange = {},
            readOnly = true,
            label = { Text("Blood Group") },
            trailingIcon = {
                Icon(Icons.Default.ArrowDropDown, contentDescription = null)
            },
            modifier = Modifier
                .fillMaxWidth()
                .menuAnchor()
        )

        ExposedDropdownMenu(
            expanded = expanded,
            onDismissRequest = { expanded = false }
        ) {
            bloodGroups.forEach { group ->
                DropdownMenuItem(
                    text = { Text(group) },
                    onClick = {
                        onBloodGroupSelected(group)
                        expanded = false
                    }
                )
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun DepartmentDropdown(
    departments: List<com.edunexus.android.core.model.Department>,
    selectedDepartmentId: String?,
    onDepartmentSelected: (String?) -> Unit
) {
    var expanded by remember { mutableStateOf(false) }
    val selectedDept = departments.find { it.id == selectedDepartmentId }

    ExposedDropdownMenuBox(
        expanded = expanded,
        onExpandedChange = { expanded = it }
    ) {
        OutlinedTextField(
            value = selectedDept?.name ?: "Select Department",
            onValueChange = {},
            readOnly = true,
            label = { Text("Department") },
            trailingIcon = {
                Icon(Icons.Default.ArrowDropDown, contentDescription = null)
            },
            modifier = Modifier
                .fillMaxWidth()
                .menuAnchor()
        )

        ExposedDropdownMenu(
            expanded = expanded,
            onDismissRequest = { expanded = false }
        ) {
            DropdownMenuItem(
                text = { Text("None") },
                onClick = {
                    onDepartmentSelected(null)
                    expanded = false
                }
            )
            departments.forEach { dept ->
                DropdownMenuItem(
                    text = { Text(dept.name) },
                    onClick = {
                        onDepartmentSelected(dept.id)
                        expanded = false
                    }
                )
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun StatusDropdown(
    selectedStatus: EmployeeStatus,
    onStatusSelected: (EmployeeStatus) -> Unit
) {
    var expanded by remember { mutableStateOf(false) }

    ExposedDropdownMenuBox(
        expanded = expanded,
        onExpandedChange = { expanded = it }
    ) {
        OutlinedTextField(
            value = selectedStatus.name,
            onValueChange = {},
            readOnly = true,
            label = { Text("Status *") },
            trailingIcon = {
                Icon(Icons.Default.ArrowDropDown, contentDescription = null)
            },
            modifier = Modifier
                .fillMaxWidth()
                .menuAnchor()
        )

        ExposedDropdownMenu(
            expanded = expanded,
            onDismissRequest = { expanded = false }
        ) {
            EmployeeStatus.values().forEach { status ->
                DropdownMenuItem(
                    text = { Text(status.name) },
                    onClick = {
                        onStatusSelected(status)
                        expanded = false
                    }
                )
            }
        }
    }
}
