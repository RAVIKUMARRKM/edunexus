package com.edunexus.android.feature.students.presentation.addedit

import android.widget.Toast
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.ExposedDropdownMenuDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
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

/**
 * Add/Edit Student Screen
 * Form for creating new students or editing existing ones
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddEditStudentScreen(
    onNavigateBack: () -> Unit,
    modifier: Modifier = Modifier,
    viewModel: AddEditStudentViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    val context = LocalContext.current

    // Handle side effects
    LaunchedEffect(Unit) {
        viewModel.effect.collect { effect ->
            when (effect) {
                is AddEditStudentEffect.NavigateBack -> onNavigateBack()
                is AddEditStudentEffect.ShowSuccess -> {
                    Toast.makeText(context, effect.message, Toast.LENGTH_SHORT).show()
                }
                is AddEditStudentEffect.ShowError -> {
                    Toast.makeText(context, effect.message, Toast.LENGTH_LONG).show()
                }
            }
        }
    }

    Scaffold(
        modifier = modifier,
        topBar = {
            TopAppBar(
                title = {
                    Text(if (uiState.isEditMode) "Edit Student" else "Add Student")
                },
                navigationIcon = {
                    IconButton(onClick = { viewModel.handleIntent(AddEditStudentIntent.Cancel) }) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { paddingValues ->
        if (uiState.isLoading) {
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
                // Personal Information Section
                SectionCard(title = "Personal Information") {
                    OutlinedTextField(
                        value = uiState.firstName,
                        onValueChange = {
                            viewModel.handleIntent(
                                AddEditStudentIntent.UpdateField(StudentField.FIRST_NAME, it)
                            )
                        },
                        label = { Text("First Name *") },
                        modifier = Modifier.fillMaxWidth(),
                        isError = uiState.errors.containsKey(StudentField.FIRST_NAME),
                        supportingText = {
                            uiState.errors[StudentField.FIRST_NAME]?.let { Text(it) }
                        }
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    OutlinedTextField(
                        value = uiState.lastName,
                        onValueChange = {
                            viewModel.handleIntent(
                                AddEditStudentIntent.UpdateField(StudentField.LAST_NAME, it)
                            )
                        },
                        label = { Text("Last Name *") },
                        modifier = Modifier.fillMaxWidth(),
                        isError = uiState.errors.containsKey(StudentField.LAST_NAME),
                        supportingText = {
                            uiState.errors[StudentField.LAST_NAME]?.let { Text(it) }
                        }
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    OutlinedTextField(
                        value = uiState.dateOfBirth,
                        onValueChange = {
                            viewModel.handleIntent(
                                AddEditStudentIntent.UpdateField(StudentField.DATE_OF_BIRTH, it)
                            )
                        },
                        label = { Text("Date of Birth (YYYY-MM-DD) *") },
                        modifier = Modifier.fillMaxWidth(),
                        isError = uiState.errors.containsKey(StudentField.DATE_OF_BIRTH),
                        supportingText = {
                            uiState.errors[StudentField.DATE_OF_BIRTH]?.let { Text(it) }
                        },
                        placeholder = { Text("2010-01-15") }
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    // Gender Dropdown
                    GenderDropdown(
                        value = uiState.gender,
                        onValueChange = {
                            viewModel.handleIntent(
                                AddEditStudentIntent.UpdateField(StudentField.GENDER, it)
                            )
                        },
                        isError = uiState.errors.containsKey(StudentField.GENDER),
                        errorMessage = uiState.errors[StudentField.GENDER]
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    // Blood Group Dropdown
                    BloodGroupDropdown(
                        value = uiState.bloodGroup,
                        onValueChange = {
                            viewModel.handleIntent(
                                AddEditStudentIntent.UpdateField(StudentField.BLOOD_GROUP, it)
                            )
                        }
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    OutlinedTextField(
                        value = uiState.religion,
                        onValueChange = {
                            viewModel.handleIntent(
                                AddEditStudentIntent.UpdateField(StudentField.RELIGION, it)
                            )
                        },
                        label = { Text("Religion") },
                        modifier = Modifier.fillMaxWidth()
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    OutlinedTextField(
                        value = uiState.caste,
                        onValueChange = {
                            viewModel.handleIntent(
                                AddEditStudentIntent.UpdateField(StudentField.CASTE, it)
                            )
                        },
                        label = { Text("Caste") },
                        modifier = Modifier.fillMaxWidth()
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    OutlinedTextField(
                        value = uiState.nationality,
                        onValueChange = {
                            viewModel.handleIntent(
                                AddEditStudentIntent.UpdateField(StudentField.NATIONALITY, it)
                            )
                        },
                        label = { Text("Nationality") },
                        modifier = Modifier.fillMaxWidth()
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    OutlinedTextField(
                        value = uiState.motherTongue,
                        onValueChange = {
                            viewModel.handleIntent(
                                AddEditStudentIntent.UpdateField(StudentField.MOTHER_TONGUE, it)
                            )
                        },
                        label = { Text("Mother Tongue") },
                        modifier = Modifier.fillMaxWidth()
                    )
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Academic Information Section
                SectionCard(title = "Academic Information") {
                    OutlinedTextField(
                        value = uiState.admissionNumber,
                        onValueChange = {
                            viewModel.handleIntent(
                                AddEditStudentIntent.UpdateField(StudentField.ADMISSION_NUMBER, it)
                            )
                        },
                        label = { Text("Admission Number *") },
                        modifier = Modifier.fillMaxWidth(),
                        isError = uiState.errors.containsKey(StudentField.ADMISSION_NUMBER),
                        supportingText = {
                            uiState.errors[StudentField.ADMISSION_NUMBER]?.let { Text(it) }
                        }
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    OutlinedTextField(
                        value = uiState.classId,
                        onValueChange = {
                            viewModel.handleIntent(
                                AddEditStudentIntent.UpdateField(StudentField.CLASS_ID, it)
                            )
                        },
                        label = { Text("Class ID *") },
                        modifier = Modifier.fillMaxWidth(),
                        isError = uiState.errors.containsKey(StudentField.CLASS_ID),
                        supportingText = {
                            uiState.errors[StudentField.CLASS_ID]?.let { Text(it) }
                        },
                        placeholder = { Text("Enter class ID") }
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    OutlinedTextField(
                        value = uiState.sectionId,
                        onValueChange = {
                            viewModel.handleIntent(
                                AddEditStudentIntent.UpdateField(StudentField.SECTION_ID, it)
                            )
                        },
                        label = { Text("Section ID *") },
                        modifier = Modifier.fillMaxWidth(),
                        isError = uiState.errors.containsKey(StudentField.SECTION_ID),
                        supportingText = {
                            uiState.errors[StudentField.SECTION_ID]?.let { Text(it) }
                        },
                        placeholder = { Text("Enter section ID") }
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    OutlinedTextField(
                        value = uiState.admissionDate,
                        onValueChange = {
                            viewModel.handleIntent(
                                AddEditStudentIntent.UpdateField(StudentField.ADMISSION_DATE, it)
                            )
                        },
                        label = { Text("Admission Date (YYYY-MM-DD)") },
                        modifier = Modifier.fillMaxWidth(),
                        placeholder = { Text("2024-04-01") }
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    OutlinedTextField(
                        value = uiState.rollNo,
                        onValueChange = {
                            viewModel.handleIntent(
                                AddEditStudentIntent.UpdateField(StudentField.ROLL_NO, it)
                            )
                        },
                        label = { Text("Roll Number") },
                        modifier = Modifier.fillMaxWidth(),
                        placeholder = { Text("Optional") }
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    OutlinedTextField(
                        value = uiState.previousSchool,
                        onValueChange = {
                            viewModel.handleIntent(
                                AddEditStudentIntent.UpdateField(StudentField.PREVIOUS_SCHOOL, it)
                            )
                        },
                        label = { Text("Previous School") },
                        modifier = Modifier.fillMaxWidth()
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    // Status Dropdown
                    StatusDropdown(
                        value = uiState.status,
                        onValueChange = {
                            viewModel.handleIntent(
                                AddEditStudentIntent.UpdateField(StudentField.STATUS, it)
                            )
                        }
                    )
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Contact Information Section
                SectionCard(title = "Contact Information") {
                    OutlinedTextField(
                        value = uiState.email,
                        onValueChange = {
                            viewModel.handleIntent(
                                AddEditStudentIntent.UpdateField(StudentField.EMAIL, it)
                            )
                        },
                        label = { Text("Email") },
                        modifier = Modifier.fillMaxWidth()
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    OutlinedTextField(
                        value = uiState.phone,
                        onValueChange = {
                            viewModel.handleIntent(
                                AddEditStudentIntent.UpdateField(StudentField.PHONE, it)
                            )
                        },
                        label = { Text("Phone") },
                        modifier = Modifier.fillMaxWidth()
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    OutlinedTextField(
                        value = uiState.address,
                        onValueChange = {
                            viewModel.handleIntent(
                                AddEditStudentIntent.UpdateField(StudentField.ADDRESS, it)
                            )
                        },
                        label = { Text("Address") },
                        modifier = Modifier.fillMaxWidth(),
                        minLines = 2,
                        maxLines = 4
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    OutlinedTextField(
                        value = uiState.city,
                        onValueChange = {
                            viewModel.handleIntent(
                                AddEditStudentIntent.UpdateField(StudentField.CITY, it)
                            )
                        },
                        label = { Text("City") },
                        modifier = Modifier.fillMaxWidth()
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    OutlinedTextField(
                        value = uiState.state,
                        onValueChange = {
                            viewModel.handleIntent(
                                AddEditStudentIntent.UpdateField(StudentField.STATE, it)
                            )
                        },
                        label = { Text("State") },
                        modifier = Modifier.fillMaxWidth()
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    OutlinedTextField(
                        value = uiState.pincode,
                        onValueChange = {
                            viewModel.handleIntent(
                                AddEditStudentIntent.UpdateField(StudentField.PINCODE, it)
                            )
                        },
                        label = { Text("Pincode") },
                        modifier = Modifier.fillMaxWidth()
                    )
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Medical Information Section
                SectionCard(title = "Medical Information") {
                    OutlinedTextField(
                        value = uiState.medicalConditions,
                        onValueChange = {
                            viewModel.handleIntent(
                                AddEditStudentIntent.UpdateField(StudentField.MEDICAL_CONDITIONS, it)
                            )
                        },
                        label = { Text("Medical Conditions") },
                        modifier = Modifier.fillMaxWidth(),
                        minLines = 2,
                        maxLines = 4,
                        placeholder = { Text("Any known medical conditions") }
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    OutlinedTextField(
                        value = uiState.allergies,
                        onValueChange = {
                            viewModel.handleIntent(
                                AddEditStudentIntent.UpdateField(StudentField.ALLERGIES, it)
                            )
                        },
                        label = { Text("Allergies") },
                        modifier = Modifier.fillMaxWidth(),
                        minLines = 2,
                        maxLines = 4,
                        placeholder = { Text("Any known allergies") }
                    )
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Parent Information Section
                SectionCard(title = "Parent Information") {
                    OutlinedTextField(
                        value = uiState.parentId,
                        onValueChange = {
                            viewModel.handleIntent(
                                AddEditStudentIntent.UpdateField(StudentField.PARENT_ID, it)
                            )
                        },
                        label = { Text("Parent ID") },
                        modifier = Modifier.fillMaxWidth(),
                        placeholder = { Text("Enter parent ID if exists") }
                    )
                }

                Spacer(modifier = Modifier.height(24.dp))

                // Action Buttons
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    OutlinedButton(
                        onClick = { viewModel.handleIntent(AddEditStudentIntent.Cancel) },
                        modifier = Modifier.weight(1f)
                    ) {
                        Text("Cancel")
                    }

                    Button(
                        onClick = { viewModel.handleIntent(AddEditStudentIntent.SaveStudent) },
                        modifier = Modifier.weight(1f),
                        enabled = !uiState.isLoading
                    ) {
                        Text(if (uiState.isEditMode) "Update" else "Create")
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))
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

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun GenderDropdown(
    value: String,
    onValueChange: (String) -> Unit,
    isError: Boolean = false,
    errorMessage: String? = null
) {
    var expanded by remember { mutableStateOf(false) }
    val genderOptions = listOf("MALE", "FEMALE", "OTHER")

    ExposedDropdownMenuBox(
        expanded = expanded,
        onExpandedChange = { expanded = it }
    ) {
        OutlinedTextField(
            value = value,
            onValueChange = {},
            readOnly = true,
            label = { Text("Gender *") },
            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expanded) },
            modifier = Modifier
                .fillMaxWidth()
                .menuAnchor(),
            isError = isError,
            supportingText = { errorMessage?.let { Text(it) } }
        )

        ExposedDropdownMenu(
            expanded = expanded,
            onDismissRequest = { expanded = false }
        ) {
            genderOptions.forEach { gender ->
                DropdownMenuItem(
                    text = { Text(gender) },
                    onClick = {
                        onValueChange(gender)
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
    value: String,
    onValueChange: (String) -> Unit
) {
    var expanded by remember { mutableStateOf(false) }
    val bloodGroups = listOf("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-")

    ExposedDropdownMenuBox(
        expanded = expanded,
        onExpandedChange = { expanded = it }
    ) {
        OutlinedTextField(
            value = value,
            onValueChange = {},
            readOnly = true,
            label = { Text("Blood Group") },
            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expanded) },
            modifier = Modifier
                .fillMaxWidth()
                .menuAnchor()
        )

        ExposedDropdownMenu(
            expanded = expanded,
            onDismissRequest = { expanded = false }
        ) {
            bloodGroups.forEach { bloodGroup ->
                DropdownMenuItem(
                    text = { Text(bloodGroup) },
                    onClick = {
                        onValueChange(bloodGroup)
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
    value: String,
    onValueChange: (String) -> Unit
) {
    var expanded by remember { mutableStateOf(false) }
    val statusOptions = listOf("ACTIVE", "INACTIVE", "LEFT", "GRADUATED", "SUSPENDED")

    ExposedDropdownMenuBox(
        expanded = expanded,
        onExpandedChange = { expanded = it }
    ) {
        OutlinedTextField(
            value = value,
            onValueChange = {},
            readOnly = true,
            label = { Text("Status") },
            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expanded) },
            modifier = Modifier
                .fillMaxWidth()
                .menuAnchor()
        )

        ExposedDropdownMenu(
            expanded = expanded,
            onDismissRequest = { expanded = false }
        ) {
            statusOptions.forEach { status ->
                DropdownMenuItem(
                    text = { Text(status) },
                    onClick = {
                        onValueChange(status)
                        expanded = false
                    }
                )
            }
        }
    }
}
