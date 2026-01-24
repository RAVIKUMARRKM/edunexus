import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@edunexus/database';
import { format } from 'date-fns';

// SMS notification for absent students
// This is a template - integrate with your SMS provider (Twilio, MSG91, etc.)
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only teachers and admins can send notifications
    const allowedRoles = ['TEACHER', 'ADMIN', 'SUPER_ADMIN'];
    if (!allowedRoles.includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Only teachers and admins can send notifications' },
        { status: 403 }
      );
    }

    const { date, classId, sectionId } = await request.json();

    if (!date) {
      return NextResponse.json(
        { error: 'Date is required' },
        { status: 400 }
      );
    }

    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    // Get all absent students for the date
    const absentRecords = await prisma.studentAttendance.findMany({
      where: {
        date: attendanceDate,
        status: 'ABSENT',
        student: classId || sectionId ? {
          classId: classId || undefined,
          sectionId: sectionId || undefined,
        } : undefined,
      },
      include: {
        student: {
          include: {
            user: {
              select: {
                phone: true,
                email: true,
              },
            },
            parents: {
              include: {
                parent: {
                  include: {
                    user: {
                      select: {
                        phone: true,
                        email: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const notifications = [];

    for (const record of absentRecords) {
      const student = record.student;
      const studentName = `${student.firstName} ${student.lastName}`;
      const dateStr = format(attendanceDate, 'MMMM dd, yyyy');

      // Get parent phone numbers
      const parentPhones: string[] = [];
      student.parents.forEach((sp) => {
        if (sp.parent.user?.phone) {
          parentPhones.push(sp.parent.user.phone);
        }
      });

      // Also try student's own phone if available
      if (student.user?.phone) {
        parentPhones.push(student.user.phone);
      }

      if (parentPhones.length > 0) {
        const message = `Dear Parent, ${studentName} was marked absent on ${dateStr}. Please contact the school if this is an error. - EduNexus`;

        for (const phone of parentPhones) {
          // TODO: Integrate with your SMS provider here
          // Example with Twilio:
          // await twilioClient.messages.create({
          //   body: message,
          //   from: process.env.TWILIO_PHONE_NUMBER,
          //   to: phone,
          // });

          // For now, just log
          console.log(`SMS to ${phone}: ${message}`);

          notifications.push({
            studentId: student.id,
            studentName,
            phone,
            message,
            status: 'queued', // Would be 'sent' after actual SMS integration
          });
        }
      }
    }

    // TODO: In production, you might want to save notification logs to database
    // await prisma.notification.createMany({
    //   data: notifications.map(n => ({
    //     userId: n.studentId,
    //     title: 'Absence Alert',
    //     message: n.message,
    //     type: 'SMS',
    //   })),
    // });

    return NextResponse.json({
      message: `Notification process initiated for ${absentRecords.length} absent students`,
      count: notifications.length,
      notifications,
      note: 'SMS integration pending. Configure your SMS provider (Twilio, MSG91, etc.) in the API route.',
    });
  } catch (error) {
    console.error('Notify absent error:', error);
    return NextResponse.json(
      { error: 'Failed to send notifications' },
      { status: 500 }
    );
  }
}
