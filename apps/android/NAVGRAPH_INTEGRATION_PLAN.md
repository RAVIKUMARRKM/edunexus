# NavGraph Integration Plan

## Routes to Add (After Agents Complete)

### Classes Module
```kotlin
// Classes
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
```

### Attendance Module
```kotlin
composable(Routes.ATTENDANCE) {
    AttendanceListScreen(
        onNavigateToMark = { navController.navigate(Routes.ATTENDANCE_MARK) },
        onNavigateToReport = { navController.navigate(Routes.ATTENDANCE_REPORT) }
    )
}

composable(Routes.ATTENDANCE_MARK) {
    MarkAttendanceScreen(onNavigateBack = { navController.navigateUp() })
}

composable(Routes.ATTENDANCE_REPORT) {
    AttendanceReportScreen(onNavigateBack = { navController.navigateUp() })
}
```

### Exams Module
```kotlin
composable(Routes.EXAMS) {
    ExamsScreen(
        onNavigateToDetail = { examId -> navController.navigate(Routes.examDetail(examId)) },
        onNavigateToAdd = { navController.navigate(Routes.EXAM_ADD) }
    )
}

composable(Routes.EXAM_DETAIL) {
    ExamDetailScreen(
        onNavigateBack = { navController.navigateUp() },
        onNavigateToResults = { id -> navController.navigate(Routes.examResults(id)) }
    )
}

composable(Routes.EXAM_ADD) {
    AddEditExamScreen(onNavigateBack = { navController.navigateUp() })
}

composable(Routes.EXAM_RESULTS) {
    ExamResultsScreen(onNavigateBack = { navController.navigateUp() })
}
```

### Fees Module
```kotlin
composable(Routes.FEES) {
    FeesScreen(
        onNavigateToPayment = { navController.navigate(Routes.FEE_PAYMENT) },
        onNavigateToHistory = { navController.navigate(Routes.FEE_HISTORY) }
    )
}

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
```

### Communication Module
```kotlin
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
```

### Library Module
```kotlin
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
```

### Transport Module
```kotlin
composable(Routes.TRANSPORT) {
    VehiclesScreen(
        onNavigateToRoutes = { navController.navigate(Routes.transportRoutes()) }
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
```

### Hostel Module
```kotlin
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
```

### HR Module
```kotlin
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
```

### Inventory Module
```kotlin
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
```

### Reports Module
```kotlin
composable(Routes.REPORTS) {
    ReportsScreen(
        onNavigateToDetail = { reportType -> navController.navigate(Routes.reportDetail(reportType)) }
    )
}

composable(Routes.REPORT_DETAIL) {
    ReportDetailScreen(onNavigateBack = { navController.navigateUp() })
}
```

## Import Statements to Add

```kotlin
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
import com.edunexus.android.feature.exams.presentation.addedit.AddEditExamScreen
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
```

## Notes
- Replace PlaceholderScreen calls with actual screens
- Ensure all imports are correct after agents complete
- Test navigation flow for each module
- Verify no compilation errors after integration
