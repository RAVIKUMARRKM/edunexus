package com.edunexus.android.core.network.dto

/**
 * Extension functions to map DTOs to domain models
 * These mappers convert network DTOs to domain model classes
 *
 * Note: Domain models should be defined in the :core:model module
 * For now, these are placeholder mappers that return simple data classes
 * Update these mappers once domain models are created
 */

// ==================== User Mappers ====================

/**
 * Maps UserDto to domain User model
 */
fun UserDto.toDomainModel() = User(
    id = id,
    email = email,
    name = name,
    role = role,
    phone = phone,
    avatar = avatar,
    createdAt = createdAt,
    updatedAt = updatedAt
)

// ==================== Student Mappers ====================

/**
 * Maps StudentDto to domain Student model
 */
fun StudentDto.toDomainModel() = Student(
    id = id,
    admissionNumber = admissionNumber,
    firstName = firstName,
    lastName = lastName,
    dateOfBirth = dateOfBirth,
    gender = gender,
    email = email,
    phone = phone,
    address = address,
    photo = photo,
    bloodGroup = bloodGroup,
    classId = classId,
    sectionId = sectionId,
    parentId = parentId,
    status = status,
    admissionDate = admissionDate,
    createdAt = createdAt,
    updatedAt = updatedAt,
    classInfo = classInfo?.toDomainModel(),
    section = section?.toDomainModel(),
    parent = parent?.toDomainModel()
)

// ==================== Teacher Mappers ====================

/**
 * Maps TeacherDto to domain Teacher model
 */
fun TeacherDto.toDomainModel() = Teacher(
    id = id,
    employeeId = employeeId,
    firstName = firstName,
    lastName = lastName,
    email = email,
    phone = phone,
    dateOfBirth = dateOfBirth,
    gender = gender,
    address = address,
    photo = photo,
    qualification = qualification,
    experience = experience,
    joiningDate = joiningDate,
    departmentId = departmentId,
    status = status,
    createdAt = createdAt,
    updatedAt = updatedAt,
    department = department?.toDomainModel()
)

// ==================== Class & Section Mappers ====================

/**
 * Maps ClassDto to domain Class model
 */
fun ClassDto.toDomainModel() = Class(
    id = id,
    name = name,
    grade = grade,
    description = description,
    createdAt = createdAt,
    updatedAt = updatedAt,
    sections = sections?.map { it.toDomainModel() }
)

/**
 * Maps SectionDto to domain Section model
 */
fun SectionDto.toDomainModel() = Section(
    id = id,
    name = name,
    classId = classId,
    capacity = capacity,
    teacherId = teacherId,
    createdAt = createdAt,
    updatedAt = updatedAt,
    teacher = teacher?.toDomainModel()
)

// ==================== Department Mapper ====================

/**
 * Maps DepartmentDto to domain Department model
 */
fun DepartmentDto.toDomainModel() = Department(
    id = id,
    name = name,
    code = code,
    description = description,
    hodId = hodId,
    createdAt = createdAt,
    updatedAt = updatedAt
)

// ==================== Parent Mapper ====================

/**
 * Maps ParentDto to domain Parent model
 */
fun ParentDto.toDomainModel() = Parent(
    id = id,
    fatherName = fatherName,
    motherName = motherName,
    guardianName = guardianName,
    relationship = relationship,
    email = email,
    phone = phone,
    address = address,
    occupation = occupation,
    createdAt = createdAt,
    updatedAt = updatedAt
)

// ==================== Dashboard Stats Mapper ====================

/**
 * Maps DashboardStatsDto to domain DashboardStats model
 */
fun DashboardStatsDto.toDomainModel() = DashboardStats(
    totalStudents = totalStudents,
    totalTeachers = totalTeachers,
    totalClasses = totalClasses,
    totalParents = totalParents,
    presentToday = presentToday,
    absentToday = absentToday,
    attendancePercentage = attendancePercentage,
    pendingFees = pendingFees,
    totalFees = totalFees,
    collectedFees = collectedFees,
    upcomingExams = upcomingExams,
    recentNotices = recentNotices,
    unreadMessages = unreadMessages,
    libraryBooks = libraryBooks,
    issuedBooks = issuedBooks
)

// ==================== Placeholder Domain Models ====================
// These should be moved to :core:model module

data class User(
    val id: String,
    val email: String,
    val name: String,
    val role: String,
    val phone: String? = null,
    val avatar: String? = null,
    val createdAt: String? = null,
    val updatedAt: String? = null
)

data class Student(
    val id: String,
    val admissionNumber: String,
    val firstName: String,
    val lastName: String,
    val dateOfBirth: String,
    val gender: String,
    val email: String? = null,
    val phone: String? = null,
    val address: String? = null,
    val photo: String? = null,
    val bloodGroup: String? = null,
    val classId: String,
    val sectionId: String,
    val parentId: String? = null,
    val status: String,
    val admissionDate: String? = null,
    val createdAt: String? = null,
    val updatedAt: String? = null,
    val classInfo: Class? = null,
    val section: Section? = null,
    val parent: Parent? = null
)

data class Teacher(
    val id: String,
    val employeeId: String,
    val firstName: String,
    val lastName: String,
    val email: String,
    val phone: String? = null,
    val dateOfBirth: String? = null,
    val gender: String,
    val address: String? = null,
    val photo: String? = null,
    val qualification: String? = null,
    val experience: Int? = null,
    val joiningDate: String? = null,
    val departmentId: String? = null,
    val status: String,
    val createdAt: String? = null,
    val updatedAt: String? = null,
    val department: Department? = null
)

data class Class(
    val id: String,
    val name: String,
    val grade: Int,
    val description: String? = null,
    val createdAt: String? = null,
    val updatedAt: String? = null,
    val sections: List<Section>? = null
)

data class Section(
    val id: String,
    val name: String,
    val classId: String,
    val capacity: Int? = null,
    val teacherId: String? = null,
    val createdAt: String? = null,
    val updatedAt: String? = null,
    val teacher: Teacher? = null
)

data class Department(
    val id: String,
    val name: String,
    val code: String,
    val description: String? = null,
    val hodId: String? = null,
    val createdAt: String? = null,
    val updatedAt: String? = null
)

data class Parent(
    val id: String,
    val fatherName: String? = null,
    val motherName: String? = null,
    val guardianName: String? = null,
    val relationship: String? = null,
    val email: String? = null,
    val phone: String,
    val address: String? = null,
    val occupation: String? = null,
    val createdAt: String? = null,
    val updatedAt: String? = null
)

data class DashboardStats(
    val totalStudents: Int,
    val totalTeachers: Int,
    val totalClasses: Int,
    val totalParents: Int,
    val presentToday: Int,
    val absentToday: Int,
    val attendancePercentage: Float,
    val pendingFees: Float,
    val totalFees: Float,
    val collectedFees: Float,
    val upcomingExams: Int,
    val recentNotices: Int,
    val unreadMessages: Int,
    val libraryBooks: Int,
    val issuedBooks: Int
)
