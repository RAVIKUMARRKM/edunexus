package com.edunexus.android.feature.fees.presentation.components
import androidx.compose.foundation.shape.CircleShape

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.outlined.AccountBalance
import androidx.compose.material.icons.outlined.Badge
import androidx.compose.material.icons.outlined.School
import androidx.compose.material3.Badge
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.edunexus.android.core.network.dto.FeeStatusDto

/**
 * Fee Card Component
 * Displays student information in a card format for list views
 */
@Composable
fun FeeCard(
    feeStatus: FeeStatusDto,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier
            .fillMaxWidth()
            .clickable(onClick = onClick),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        )
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Avatar and Info
            Row(
                modifier = Modifier.weight(1f),
                horizontalArrangement = Arrangement.Start,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Avatar
                // Fee Icon
                Box(
                    modifier = Modifier
                        .size(56.dp)
                        .background(
                            color = MaterialTheme.colorScheme.primaryContainer,
                            shape = androidx.compose.foundation.shape.CircleShape
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Outlined.AccountBalance,
                        contentDescription = "Fee",
                        modifier = Modifier.size(32.dp),
                        tint = MaterialTheme.colorScheme.onPrimaryContainer
                    )
                }

                Spacer(modifier = Modifier.width(12.dp))

                // Student Details
                Column(
                    modifier = Modifier.weight(1f),
                    verticalArrangement = Arrangement.Center
                ) {
                    // Name
                    Text(
                        text = "${feeStatus.student?.firstName} ${feeStatus.student?.lastName}",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis,
                        color = MaterialTheme.colorScheme.onSurface
                    )

                    Spacer(modifier = Modifier.height(4.dp))

                    // Admission Number
                    Row(
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Outlined.Badge,
                            contentDescription = null,
                            modifier = Modifier.size(16.dp),
                            tint = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = feeStatus.student?.admissionNumber ?: "",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        feeStatus.student?.rollNo?.let { rollNo ->
                            Text(
                                text = " • Roll: $rollNo",
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(4.dp))

                    // Class & Section
                    Row(
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Outlined.School,
                            contentDescription = null,
                            modifier = Modifier.size(16.dp),
                            tint = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = buildString {
                                append(feeStatus.student?.classInfo?.name ?: "Class ${feeStatus.student?.classId}")
                                feeStatus.student?.section?.name?.let { append(" - $it") }
                            },
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    // Status Badge
                    FeeStatusBadge(status = feeStatus.status)
                }
            }

            // Arrow Icon
            Icon(
                imageVector = Icons.Default.ChevronRight,
                contentDescription = "View details",
                tint = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}

/**
 * Fee Status Badge Component
 * Displays a badge with status color and label
 */
@Composable
fun FeeStatusBadge(status: String) {
    val (backgroundColor, textColor, label) = when (status.uppercase()) {
        "PAID" -> Triple(
            Color(0xFF10B981).copy(alpha = 0.1f),
            Color(0xFF10B981),
            "Paid"
        )
        "PENDING" -> Triple(
            Color(0xFFF59E0B).copy(alpha = 0.1f),
            Color(0xFFF59E0B),
            "Pending"
        )
        "OVERDUE" -> Triple(
            Color(0xFFEF4444).copy(alpha = 0.1f),
            Color(0xFFEF4444),
            "Overdue"
        )
        "PARTIAL" -> Triple(
            Color(0xFF3B82F6).copy(alpha = 0.1f),
            Color(0xFF3B82F6),
            "Partial"
        )
        else -> Triple(
            MaterialTheme.colorScheme.surfaceVariant,
            MaterialTheme.colorScheme.onSurfaceVariant,
            status
        )
    }

    Box(
        modifier = Modifier
            .background(
                color = backgroundColor,
                shape = MaterialTheme.shapes.small
            )
            .padding(horizontal = 8.dp, vertical = 4.dp)
    ) {
        Text(
            text = label,
            style = MaterialTheme.typography.labelSmall,
            color = textColor,
            fontWeight = FontWeight.Medium
        )
    }
}
