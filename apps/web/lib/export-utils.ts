import { format } from 'date-fns';

// Export to CSV (Excel-compatible)
export function exportToCSV(data: any[], filename: string) {
  if (data.length === 0) {
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);

  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        // Escape quotes and wrap in quotes if contains comma
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${format(new Date(), 'yyyy-MM-dd')}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Print as PDF (using browser print)
export function printToPDF() {
  window.print();
}

// Format data for class report export
export function formatClassReportForExport(students: any[]) {
  return students.map(student => ({
    'Roll No': student.rollNo || '-',
    'Student Name': `${student.firstName} ${student.lastName}`,
    'Admission No': student.admissionNo,
    'Total Days': student.totalDays,
    'Present': student.present,
    'Absent': student.absent,
    'Attendance %': `${student.attendancePercentage}%`,
  }));
}

// Format data for defaulters report export
export function formatDefaultersReportForExport(defaulters: any[]) {
  return defaulters.map(student => ({
    'Student Name': `${student.firstName} ${student.lastName}`,
    'Admission No': student.admissionNo,
    'Class': student.class?.name || '-',
    'Section': student.section?.name || '-',
    'Phone': student.user?.phone || '-',
    'Email': student.user?.email || '-',
    'Total Days': student.totalDays,
    'Present': student.present,
    'Absent': student.absent,
    'Attendance %': `${student.attendancePercentage}%`,
  }));
}

// Format data for overview report export
export function formatOverviewReportForExport(overview: any) {
  return [
    {
      'Metric': 'Total Records',
      'Value': overview.totalRecords,
    },
    {
      'Metric': 'Present',
      'Value': overview.present,
    },
    {
      'Metric': 'Absent',
      'Value': overview.absent,
    },
    {
      'Metric': 'Late',
      'Value': overview.late,
    },
    {
      'Metric': 'Half Day',
      'Value': overview.halfDay,
    },
    {
      'Metric': 'Leave',
      'Value': overview.leave,
    },
    {
      'Metric': 'Attendance %',
      'Value': `${overview.attendancePercentage}%`,
    },
  ];
}
