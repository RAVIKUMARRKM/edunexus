package com.edunexus.android.feature.attendance.presentation.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Cancel
import androidx.compose.material.icons.filled.QuestionMark
import androidx.compose.material.icons.outlined.CalendarToday
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.edunexus.android.core.network.dto.AttendanceDto
import java.time.LocalDate
import java.time.format.DateTimeFormatter

@Composable
fun AttendanceCard(
    attendance: AttendanceDto,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier.fillMaxWidth().clickable(onClick = onClick),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth().padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(
                modifier = Modifier.weight(1f),
                verticalAlignment = Alignment.CenterVertically
            ) {
                AttendanceStatusIcon(status = attendance.status, size = 48.dp)
                Spacer(modifier = Modifier.width(12.dp))
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = attendance.student?.let { "${it.firstName} ${it.lastName}" } ?: "Student ID: ${attendance.studentId}",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Outlined.CalendarToday, null, Modifier.size(16.dp), MaterialTheme.colorScheme.onSurfaceVariant)
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(formatDate(attendance.date), style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                    attendance.remarks?.let {
                        if (it.isNotBlank()) {
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(it, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant, maxLines = 2, overflow = TextOverflow.Ellipsis)
                        }
                    }
                    Spacer(modifier = Modifier.height(8.dp))
                    AttendanceStatusBadge(status = attendance.status)
                }
            }
        }
    }
}

@Composable
fun AttendanceStatusIcon(status: String, size: androidx.compose.ui.unit.Dp = 48.dp, modifier: Modifier = Modifier) {
    val (bg, icon, tint) = when (status.uppercase()) {
        "PRESENT" -> Triple(Color(0xFF4CAF50).copy(alpha = 0.2f), Icons.Default.CheckCircle, Color(0xFF4CAF50))
        "ABSENT" -> Triple(Color(0xFFF44336).copy(alpha = 0.2f), Icons.Default.Cancel, Color(0xFFF44336))
        "LATE" -> Triple(Color(0xFFFF9800).copy(alpha = 0.2f), Icons.Default.QuestionMark, Color(0xFFFF9800))
        "EXCUSED" -> Triple(Color(0xFF2196F3).copy(alpha = 0.2f), Icons.Default.QuestionMark, Color(0xFF2196F3))
        else -> Triple(MaterialTheme.colorScheme.surfaceVariant, Icons.Default.QuestionMark, MaterialTheme.colorScheme.onSurfaceVariant)
    }
    Box(modifier = modifier.size(size).clip(CircleShape).background(bg), contentAlignment = Alignment.Center) {
        Icon(icon, status, tint = tint, modifier = Modifier.size(size * 0.6f))
    }
}

@Composable
fun AttendanceStatusBadge(status: String, modifier: Modifier = Modifier) {
    val (bg, txt) = when (status.uppercase()) {
        "PRESENT" -> Color(0xFF4CAF50).copy(alpha = 0.2f) to Color(0xFF4CAF50)
        "ABSENT" -> Color(0xFFF44336).copy(alpha = 0.2f) to Color(0xFFF44336)
        "LATE" -> Color(0xFFFF9800).copy(alpha = 0.2f) to Color(0xFFFF9800)
        "EXCUSED" -> Color(0xFF2196F3).copy(alpha = 0.2f) to Color(0xFF2196F3)
        else -> MaterialTheme.colorScheme.surfaceVariant to MaterialTheme.colorScheme.onSurfaceVariant
    }
    Box(modifier = modifier.background(bg, MaterialTheme.shapes.small).padding(horizontal = 8.dp, vertical = 4.dp)) {
        Text(status.uppercase(), style = MaterialTheme.typography.labelSmall, fontWeight = FontWeight.Medium, color = txt)
    }
}

private fun formatDate(dateString: String): String = try {
    LocalDate.parse(dateString).format(DateTimeFormatter.ofPattern("MMM dd, yyyy"))
} catch (e: Exception) { dateString }
