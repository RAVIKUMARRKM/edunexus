import * as Sharing from 'expo-sharing';
import { Alert, Share, Platform } from 'react-native';

/**
 * Share text content
 */
export async function shareText(text: string, title?: string): Promise<boolean> {
  try {
    if (Platform.OS === 'web') {
      // Use Web Share API
      if (navigator.share) {
        await navigator.share({
          title: title || 'Share',
          text: text,
        });
        return true;
      } else {
        // Fallback for web
        await navigator.clipboard.writeText(text);
        Alert.alert('Copied', 'Text copied to clipboard');
        return true;
      }
    } else {
      // Use React Native Share API
      const result = await Share.share({
        message: text,
        title: title,
      });

      if (result.action === Share.sharedAction) {
        return true;
      } else if (result.action === Share.dismissedAction) {
        return false;
      }
    }
    return false;
  } catch (error) {
    console.error('Error sharing text:', error);
    Alert.alert('Error', 'Failed to share content');
    return false;
  }
}

/**
 * Share a file (PDF, image, etc.)
 */
export async function shareFile(
  uri: string,
  mimeType: string = 'application/pdf'
): Promise<boolean> {
  try {
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert('Error', 'Sharing is not available on this device');
      return false;
    }

    await Sharing.shareAsync(uri, {
      mimeType,
      dialogTitle: 'Share File',
    });
    return true;
  } catch (error) {
    console.error('Error sharing file:', error);
    Alert.alert('Error', 'Failed to share file');
    return false;
  }
}

/**
 * Share notice content
 */
export async function shareNotice(notice: {
  title: string;
  content: string;
  date: string;
}): Promise<boolean> {
  const text = `
📢 ${notice.title}

${notice.content}

📅 ${new Date(notice.date).toLocaleDateString()}

---
Shared via EduNexus App
  `.trim();

  return shareText(text, notice.title);
}

/**
 * Share exam result
 */
export async function shareExamResult(result: {
  examName: string;
  studentName: string;
  subjects: Array<{
    name: string;
    marksObtained: number;
    maxMarks: number;
  }>;
  totalMarks: number;
  totalMaxMarks: number;
  percentage: number;
  grade?: string;
}): Promise<boolean> {
  const subjectsText = result.subjects
    .map(
      (subject) =>
        `  ${subject.name}: ${subject.marksObtained}/${subject.maxMarks}`
    )
    .join('\n');

  const text = `
📊 Exam Results - ${result.examName}

Student: ${result.studentName}

Subjects:
${subjectsText}

Total: ${result.totalMarks}/${result.totalMaxMarks}
Percentage: ${result.percentage.toFixed(2)}%
${result.grade ? `Grade: ${result.grade}` : ''}

---
Shared via EduNexus App
  `.trim();

  return shareText(text, `${result.examName} Results`);
}

/**
 * Share attendance summary
 */
export async function shareAttendance(attendance: {
  studentName: string;
  period: string;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  percentage: number;
}): Promise<boolean> {
  const text = `
📅 Attendance Report

Student: ${attendance.studentName}
Period: ${attendance.period}

Total Days: ${attendance.totalDays}
Present: ${attendance.presentDays}
Absent: ${attendance.absentDays}
Attendance: ${attendance.percentage.toFixed(2)}%

---
Shared via EduNexus App
  `.trim();

  return shareText(text, 'Attendance Report');
}

/**
 * Share fee payment receipt
 */
export async function shareFeeReceipt(receipt: {
  receiptNo: string;
  studentName: string;
  amount: number;
  paymentDate: string;
  paymentMode: string;
}): Promise<boolean> {
  const text = `
💰 Fee Payment Receipt

Receipt No: ${receipt.receiptNo}
Student: ${receipt.studentName}

Amount Paid: ₹${receipt.amount.toLocaleString()}
Payment Mode: ${receipt.paymentMode}
Date: ${new Date(receipt.paymentDate).toLocaleDateString()}

---
Shared via EduNexus App
  `.trim();

  return shareText(text, 'Fee Receipt');
}

/**
 * Share timetable
 */
export async function shareTimetable(timetable: {
  className: string;
  section: string;
  schedule: Array<{
    day: string;
    periods: Array<{
      time: string;
      subject: string;
      teacher: string;
    }>;
  }>;
}): Promise<boolean> {
  const scheduleText = timetable.schedule
    .map((day) => {
      const periods = day.periods
        .map((period) => `  ${period.time} - ${period.subject} (${period.teacher})`)
        .join('\n');
      return `${day.day}:\n${periods}`;
    })
    .join('\n\n');

  const text = `
📚 Class Timetable

Class: ${timetable.className} ${timetable.section}

${scheduleText}

---
Shared via EduNexus App
  `.trim();

  return shareText(text, 'Class Timetable');
}

/**
 * Share contact information
 */
export async function shareContact(contact: {
  name: string;
  email?: string;
  phone?: string;
  role?: string;
}): Promise<boolean> {
  const text = `
👤 Contact Information

Name: ${contact.name}
${contact.role ? `Role: ${contact.role}` : ''}
${contact.email ? `Email: ${contact.email}` : ''}
${contact.phone ? `Phone: ${contact.phone}` : ''}

---
Shared via EduNexus App
  `.trim();

  return shareText(text, `Contact: ${contact.name}`);
}
