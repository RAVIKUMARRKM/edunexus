package com.edunexus.android.navigation

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.compose.material3.Text
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.ui.Alignment
import com.edunexus.android.core.model.enums.Role
import com.edunexus.android.feature.auth.presentation.LoginScreen
import com.edunexus.android.feature.dashboard.DashboardScreen
import com.edunexus.android.feature.students.presentation.list.StudentsScreen
import com.edunexus.android.feature.students.presentation.detail.StudentDetailScreen
import com.edunexus.android.feature.students.presentation.addedit.AddEditStudentScreen
import com.edunexus.android.feature.teachers.TeachersScreen
import com.edunexus.android.feature.teachers.TeacherDetailScreen
import com.edunexus.android.feature.teachers.AddEditTeacherScreen
import com.edunexus.android.feature.settings.presentation.profile.ProfileScreen
import com.edunexus.android.feature.settings.presentation.edit.EditProfileScreen
import com.edunexus.android.feature.settings.presentation.password.ChangePasswordScreen
// Classes
import com.edunexus.android.feature.classes.presentation.list.ClassesScreen
import com.edunexus.android.feature.classes.presentation.detail.ClassDetailScreen
import com.edunexus.android.feature.classes.presentation.addedit.AddEditClassScreen
// Attendance
import com.edunexus.android.feature.attendance.presentation.list.AttendanceListScreen
import com.edunexus.android.feature.attendance.presentation.mark.MarkAttendanceScreen
import com.edunexus.android.feature.attendance.presentation.report.AttendanceReportScreen
// Exams
import com.edunexus.android.feature.exams.presentation.list.ExamsScreen
import com.edunexus.android.feature.exams.presentation.detail.ExamDetailScreen
import com.edunexus.android.feature.exams.presentation.results.ExamResultsScreen
// Fees
import com.edunexus.android.feature.fees.presentation.list.FeesScreen
import com.edunexus.android.feature.fees.presentation.payment.FeePaymentScreen
import com.edunexus.android.feature.fees.presentation.history.FeeHistoryScreen
import com.edunexus.android.feature.fees.presentation.detail.FeeDetailScreen
// Communication
import com.edunexus.android.feature.communication.presentation.notices.NoticesScreen
import com.edunexus.android.feature.communication.presentation.notices.NoticeDetailScreen
import com.edunexus.android.feature.communication.presentation.messages.MessagesScreen
import com.edunexus.android.feature.communication.presentation.messages.MessageDetailScreen
// Library
import com.edunexus.android.feature.library.presentation.books.BooksScreen
import com.edunexus.android.feature.library.presentation.books.BookDetailScreen
import com.edunexus.android.feature.library.presentation.issue.IssueBookScreen
// Transport
import com.edunexus.android.feature.transport.presentation.vehicles.VehiclesScreen
import com.edunexus.android.feature.transport.presentation.routes.RoutesScreen
import com.edunexus.android.feature.transport.presentation.detail.RouteDetailScreen
// Hostel
import com.edunexus.android.feature.hostel.presentation.buildings.BuildingsScreen
import com.edunexus.android.feature.hostel.presentation.rooms.RoomsScreen
import com.edunexus.android.feature.hostel.presentation.detail.RoomDetailScreen
// HR
import com.edunexus.android.feature.hr.presentation.employees.EmployeesScreen
import com.edunexus.android.feature.hr.presentation.detail.EmployeeDetailScreen
import com.edunexus.android.feature.hr.presentation.payroll.PayrollScreen
import com.edunexus.android.feature.hr.presentation.leave.LeaveManagementScreen
// Inventory
import com.edunexus.android.feature.inventory.presentation.items.ItemsScreen
import com.edunexus.android.feature.inventory.presentation.detail.ItemDetailScreen
import com.edunexus.android.feature.inventory.presentation.purchase.PurchaseOrderScreen
// Reports
import com.edunexus.android.feature.reports.presentation.list.ReportsScreen
import com.edunexus.android.feature.reports.presentation.detail.ReportDetailScreen

/**
 * Main navigation graph for the app.
 * Handles navigation between all screens including auth and main app screens.
 */
@Composable
fun NavGraph(
    navController: NavHostController,
    startDestination: String,
    modifier: Modifier = Modifier,
    currentUserRole: Role = Role.ADMIN // TODO: Get from auth state
) {
    NavHost(
        navController = navController,
        startDestination = startDestination,
        modifier = modifier
    ) {
        // Splash Screen
        composable(Routes.SPLASH) {
            // Splash handled in MainActivity
            PlaceholderScreen("Loading...")
        }

        // Auth - Login
        composable(Routes.LOGIN) {
            LoginScreen(
                onLoginSuccess = {
                    navController.navigate(Routes.DASHBOARD) {
                        popUpTo(Routes.LOGIN) { inclusive = true }
                    }
                }
            )
        }

        // Main Bottom Nav Screens
        composable(Routes.DASHBOARD) {
            DashboardScreen(
                userName = "Admin User", // TODO: Get from auth state
                userRole = currentUserRole,
                onNavigate = { route -> navController.navigate(route) }
            )
        }

        composable(Routes.ATTENDANCE) {
            AttendanceListScreen(
                onNavigateToMark = { navController.navigate(Routes.ATTENDANCE_MARK) },
                onNavigateToReport = { navController.navigate(Routes.ATTENDANCE_REPORT) }
            )
        }

        composable(Routes.EXAMS) {
            ExamsScreen(
                onNavigateToDetail = { examId -> navController.navigate(Routes.examDetail(examId)) },
                onNavigateToAdd = { navController.navigate(Routes.EXAM_ADD) }
            )
        }

        composable(Routes.FEES) {
            FeesScreen(
                onNavigateToPayment = { navController.navigate(Routes.FEE_PAYMENT) },
                onNavigateToHistory = { navController.navigate(Routes.FEE_HISTORY) }
            )
        }

        composable(Routes.PROFILE) {
            ProfileScreen(
                onNavigateToEditProfile = { navController.navigate(Routes.EDIT_PROFILE) },
                onNavigateToChangePassword = { navController.navigate(Routes.CHANGE_PASSWORD) },
                onNavigateToLogin = {
                    navController.navigate(Routes.LOGIN) {
                        popUpTo(0) { inclusive = true }
                    }
                }
            )
        }

        // Students Routes
        composable(Routes.STUDENTS) {
            StudentsScreen(
                onNavigateToDetail = { studentId ->
                    navController.navigate(Routes.studentDetail(studentId))
                },
                onNavigateToAdd = {
                    navController.navigate(Routes.STUDENT_ADD)
                },
                onNavigateToEdit = { studentId ->
                    navController.navigate(Routes.studentEdit(studentId))
                }
            )
        }

        composable(Routes.STUDENT_DETAIL) {
            // studentId will be retrieved by ViewModel from SavedStateHandle
            StudentDetailScreen(
                onNavigateBack = { navController.navigateUp() },
                onNavigateToEdit = { id ->
                    navController.navigate(Routes.studentEdit(id))
                }
            )
        }

        composable(Routes.STUDENT_ADD) {
            // studentId will be null for add mode, retrieved by ViewModel from SavedStateHandle
            AddEditStudentScreen(
                onNavigateBack = { navController.navigateUp() }
            )
        }

        composable(Routes.STUDENT_EDIT) {
            // studentId will be retrieved by ViewModel from SavedStateHandle
            AddEditStudentScreen(
                onNavigateBack = { navController.navigateUp() }
            )
        }

        // Teachers Routes
        composable(Routes.TEACHERS) {
            TeachersScreen(
                onNavigateToDetail = { teacherId ->
                    navController.navigate(Routes.teacherDetail(teacherId))
                },
                onNavigateToAdd = {
                    navController.navigate(Routes.TEACHER_ADD)
                }
            )
        }

        composable(Routes.TEACHER_DETAIL) {
            // teacherId will be retrieved by ViewModel from SavedStateHandle
            TeacherDetailScreen(
                onNavigateBack = { navController.navigateUp() },
                onNavigateToEdit = { id ->
                    navController.navigate(Routes.teacherEdit(id))
                },
                userRole = currentUserRole
            )
        }

        composable(Routes.TEACHER_ADD) {
            // teacherId will be null for add mode, retrieved by ViewModel from SavedStateHandle
            AddEditTeacherScreen(
                onNavigateBack = { navController.navigateUp() }
            )
        }

        composable(Routes.TEACHER_EDIT) {
            // teacherId will be retrieved by ViewModel from SavedStateHandle
            AddEditTeacherScreen(
                onNavigateBack = { navController.navigateUp() }
            )
        }

        // Profile/Settings Routes
        composable(Routes.EDIT_PROFILE) {
            EditProfileScreen(
                onNavigateBack = { navController.navigateUp() }
            )
        }

        composable(Routes.CHANGE_PASSWORD) {
            ChangePasswordScreen(
                onNavigateBack = { navController.navigateUp() },
                onNavigateToLogin = {
                    navController.navigate(Routes.LOGIN) {
                        popUpTo(0) { inclusive = true }
                    }
                }
            )
        }

        // Classes Routes
        composable(Routes.CLASSES) {
            ClassesScreen(
                onNavigateToDetail = { classId -> navController.navigate(Routes.classDetail(classId)) },
                onNavigateToAdd = { navController.navigate(Routes.CLASS_ADD) }
            )
        }

        composable(Routes.CLASS_DETAIL) {
            ClassDetailScreen(
                onNavigateBack = { navController.navigateUp() },
                onNavigateToEdit = { id -> navController.navigate(Routes.classEdit(id)) }
            )
        }

        composable(Routes.CLASS_ADD) {
            AddEditClassScreen(onNavigateBack = { navController.navigateUp() })
        }

        composable(Routes.CLASS_EDIT) {
            AddEditClassScreen(onNavigateBack = { navController.navigateUp() })
        }

        // Attendance Routes
        composable(Routes.ATTENDANCE_MARK) {
            MarkAttendanceScreen(onNavigateBack = { navController.navigateUp() })
        }

        composable(Routes.ATTENDANCE_REPORT) {
            AttendanceReportScreen(onNavigateBack = { navController.navigateUp() })
        }

        // Exams Routes
        composable(Routes.EXAM_DETAIL) {
            ExamDetailScreen(
                onNavigateBack = { navController.navigateUp() },
                onNavigateToResults = { id -> navController.navigate(Routes.examResults(id)) }
            )
        }

        composable(Routes.EXAM_ADD) {
            PlaceholderScreen("Add Exam - Coming Soon")
        }

        composable(Routes.EXAM_RESULTS) {
            ExamResultsScreen(onNavigateBack = { navController.navigateUp() })
        }

        // Fees Routes
        composable(Routes.FEE_PAYMENT) {
            FeePaymentScreen(onNavigateBack = { navController.navigateUp() })
        }

        composable(Routes.FEE_HISTORY) {
            FeeHistoryScreen(
                onNavigateToDetail = { feeId -> navController.navigate(Routes.feeDetail(feeId)) }
            )
        }

        composable(Routes.FEE_DETAIL) {
            FeeDetailScreen(onNavigateBack = { navController.navigateUp() })
        }

        // Communication Routes
        composable(Routes.NOTICES) {
            NoticesScreen(
                onNavigateToDetail = { noticeId -> navController.navigate(Routes.noticeDetail(noticeId)) }
            )
        }

        composable(Routes.NOTICE_DETAIL) {
            NoticeDetailScreen(onNavigateBack = { navController.navigateUp() })
        }

        composable(Routes.MESSAGES) {
            MessagesScreen(
                onNavigateToDetail = { messageId -> navController.navigate(Routes.messageDetail(messageId)) }
            )
        }

        composable(Routes.MESSAGE_DETAIL) {
            MessageDetailScreen(onNavigateBack = { navController.navigateUp() })
        }

        // Library Routes
        composable(Routes.LIBRARY) {
            BooksScreen(
                onNavigateToDetail = { bookId -> navController.navigate(Routes.bookDetail(bookId)) },
                onNavigateToIssue = { navController.navigate(Routes.BOOK_ISSUE) }
            )
        }

        composable(Routes.BOOK_DETAIL) {
            BookDetailScreen(onNavigateBack = { navController.navigateUp() })
        }

        composable(Routes.BOOK_ISSUE) {
            IssueBookScreen(onNavigateBack = { navController.navigateUp() })
        }

        // Transport Routes
        composable(Routes.TRANSPORT) {
            VehiclesScreen(
                onNavigateToRoutes = { navController.navigate("transport/routes") }
            )
        }

        composable("transport/routes") {
            RoutesScreen(
                onNavigateToDetail = { routeId -> navController.navigate(Routes.routeDetail(routeId)) }
            )
        }

        composable(Routes.ROUTE_DETAIL) {
            RouteDetailScreen(onNavigateBack = { navController.navigateUp() })
        }

        // Hostel Routes
        composable(Routes.HOSTEL) {
            BuildingsScreen(
                onNavigateToRooms = { buildingId -> navController.navigate("hostel/rooms/$buildingId") }
            )
        }

        composable("hostel/rooms/{buildingId}") {
            RoomsScreen(
                onNavigateToDetail = { roomId -> navController.navigate(Routes.roomDetail(roomId)) }
            )
        }

        composable(Routes.ROOM_DETAIL) {
            RoomDetailScreen(onNavigateBack = { navController.navigateUp() })
        }

        // HR Routes
        composable(Routes.HR) {
            EmployeesScreen(
                onNavigateToDetail = { empId -> navController.navigate(Routes.employeeDetail(empId)) },
                onNavigateToPayroll = { navController.navigate(Routes.PAYROLL) },
                onNavigateToLeave = { navController.navigate(Routes.LEAVE_MANAGEMENT) }
            )
        }

        composable(Routes.EMPLOYEE_DETAIL) {
            EmployeeDetailScreen(onNavigateBack = { navController.navigateUp() })
        }

        composable(Routes.PAYROLL) {
            PayrollScreen(onNavigateBack = { navController.navigateUp() })
        }

        composable(Routes.LEAVE_MANAGEMENT) {
            LeaveManagementScreen(onNavigateBack = { navController.navigateUp() })
        }

        // Inventory Routes
        composable(Routes.INVENTORY) {
            ItemsScreen(
                onNavigateToDetail = { itemId -> navController.navigate(Routes.itemDetail(itemId)) },
                onNavigateToPurchase = { navController.navigate(Routes.PURCHASE_ORDER) }
            )
        }

        composable(Routes.ITEM_DETAIL) {
            ItemDetailScreen(onNavigateBack = { navController.navigateUp() })
        }

        composable(Routes.PURCHASE_ORDER) {
            PurchaseOrderScreen(onNavigateBack = { navController.navigateUp() })
        }

        // Reports Routes
        composable(Routes.REPORTS) {
            ReportsScreen(
                onNavigateToDetail = { reportType -> navController.navigate(Routes.reportDetail(reportType)) }
            )
        }

        composable(Routes.REPORT_DETAIL) {
            ReportDetailScreen(onNavigateBack = { navController.navigateUp() })
        }

        // Settings Routes
        composable(Routes.SETTINGS) {
            // Redirect to Profile
            navController.navigate(Routes.PROFILE) {
                popUpTo(Routes.SETTINGS) { inclusive = true }
            }
        }
    }
}

/**
 * Placeholder screen used for routes that haven't been implemented yet.
 * This will be replaced with actual screens as feature modules are completed.
 */
@Composable
private fun PlaceholderScreen(title: String) {
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Text(text = title)
    }
}
