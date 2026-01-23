import { PrismaClient, Role, Gender } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create Academic Year
  const academicYear = await prisma.academicYear.create({
    data: {
      name: '2024-2025',
      startDate: new Date('2024-04-01'),
      endDate: new Date('2025-03-31'),
      isCurrent: true,
    },
  });
  console.log('✅ Created Academic Year');

  // Create Admin User
  const adminPassword = await hash('admin123', 12);
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@edunexus.com',
      password: adminPassword,
      name: 'System Administrator',
      phone: '9876543210',
      role: Role.ADMIN,
      isActive: true,
    },
  });
  console.log('✅ Created Admin User');

  // Create Departments
  const departments = await Promise.all([
    prisma.department.create({
      data: { name: 'Science', code: 'SCI', description: 'Science Department' },
    }),
    prisma.department.create({
      data: { name: 'Mathematics', code: 'MATH', description: 'Mathematics Department' },
    }),
    prisma.department.create({
      data: { name: 'English', code: 'ENG', description: 'English Department' },
    }),
    prisma.department.create({
      data: { name: 'Social Studies', code: 'SS', description: 'Social Studies Department' },
    }),
  ]);
  console.log('✅ Created Departments');

  // Create Classes
  const classes = await Promise.all(
    Array.from({ length: 10 }, (_, i) =>
      prisma.class.create({
        data: {
          name: `Class ${i + 1}`,
          numericValue: i + 1,
          academicYearId: academicYear.id,
          capacity: 40,
        },
      })
    )
  );
  console.log('✅ Created 10 Classes');

  // Create Sections for each class
  for (const cls of classes) {
    await Promise.all(
      ['A', 'B', 'C'].map((section) =>
        prisma.section.create({
          data: {
            name: section,
            classId: cls.id,
            capacity: 40,
          },
        })
      )
    );
  }
  console.log('✅ Created Sections');

  // Create Subjects for each class
  const subjectTemplates = [
    { name: 'English', code: 'ENG' },
    { name: 'Mathematics', code: 'MATH' },
    { name: 'Science', code: 'SCI' },
    { name: 'Social Studies', code: 'SS' },
    { name: 'Hindi', code: 'HIN' },
    { name: 'Computer Science', code: 'CS' },
  ];

  for (const cls of classes) {
    await Promise.all(
      subjectTemplates.map((subject, index) =>
        prisma.subject.create({
          data: {
            name: subject.name,
            code: `${subject.code}${cls.numericValue}`,
            classId: cls.id,
            type: subject.code === 'CS' ? 'BOTH' : 'THEORY',
          },
        })
      )
    );
  }
  console.log('✅ Created Subjects');

  // Create Teachers
  const teacherPassword = await hash('teacher123', 12);
  const teachers = await Promise.all(
    Array.from({ length: 15 }, async (_, i) => {
      const user = await prisma.user.create({
        data: {
          email: `teacher${i + 1}@edunexus.com`,
          password: teacherPassword,
          name: `Teacher ${i + 1}`,
          phone: `98765432${i.toString().padStart(2, '0')}`,
          role: Role.TEACHER,
          isActive: true,
        },
      });

      return prisma.teacher.create({
        data: {
          employeeId: `TCH${(i + 1).toString().padStart(4, '0')}`,
          userId: user.id,
          firstName: `Teacher`,
          lastName: `${i + 1}`,
          dateOfBirth: new Date('1985-01-15'),
          gender: i % 2 === 0 ? Gender.MALE : Gender.FEMALE,
          qualification: 'M.Ed',
          specialization: subjectTemplates[i % subjectTemplates.length].name,
          experience: 5 + (i % 10),
          departmentId: departments[i % departments.length].id,
          designation: i % 5 === 0 ? 'Senior Teacher' : 'Teacher',
          basicSalary: 45000 + (i * 1000),
        },
      });
    })
  );
  console.log('✅ Created 15 Teachers');

  // Create Students with Parents
  const studentPassword = await hash('student123', 12);
  const sections = await prisma.section.findMany({ include: { class: true } });

  let studentCount = 0;
  for (const section of sections) {
    for (let i = 0; i < 10; i++) {
      studentCount++;
      const studentUser = await prisma.user.create({
        data: {
          email: `student${studentCount}@edunexus.com`,
          password: studentPassword,
          name: `Student ${studentCount}`,
          role: Role.STUDENT,
          isActive: true,
        },
      });

      const parentUser = await prisma.user.create({
        data: {
          email: `parent${studentCount}@edunexus.com`,
          password: await hash('parent123', 12),
          name: `Parent of Student ${studentCount}`,
          role: Role.PARENT,
          isActive: true,
        },
      });

      const student = await prisma.student.create({
        data: {
          admissionNo: `ADM2024${studentCount.toString().padStart(4, '0')}`,
          rollNo: `${i + 1}`,
          userId: studentUser.id,
          firstName: `Student`,
          lastName: `${studentCount}`,
          dateOfBirth: new Date(`2010-${((studentCount % 12) + 1).toString().padStart(2, '0')}-15`),
          gender: studentCount % 2 === 0 ? Gender.MALE : Gender.FEMALE,
          bloodGroup: ['A+', 'B+', 'O+', 'AB+'][studentCount % 4],
          nationality: 'Indian',
          address: `${studentCount} Main Street`,
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110001',
          classId: section.class.id,
          sectionId: section.id,
          status: 'ACTIVE',
        },
      });

      const parent = await prisma.parent.create({
        data: {
          userId: parentUser.id,
          fatherName: `Father of Student ${studentCount}`,
          fatherPhone: `91${studentCount.toString().padStart(10, '0')}`,
          motherName: `Mother of Student ${studentCount}`,
          address: `${studentCount} Main Street`,
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110001',
        },
      });

      await prisma.studentParent.create({
        data: {
          studentId: student.id,
          parentId: parent.id,
          relation: 'father',
          isPrimary: true,
        },
      });
    }
  }
  console.log(`✅ Created ${studentCount} Students with Parents`);

  // Create Fee Structures
  const feeStructures = await Promise.all([
    prisma.feeStructure.create({
      data: {
        name: 'Tuition Fee',
        academicYearId: academicYear.id,
        feeType: 'TUITION',
        amount: 5000,
        frequency: 'MONTHLY',
        dueDay: 10,
        lateFee: 100,
      },
    }),
    prisma.feeStructure.create({
      data: {
        name: 'Admission Fee',
        academicYearId: academicYear.id,
        feeType: 'ADMISSION',
        amount: 15000,
        frequency: 'ONE_TIME',
        dueDay: 10,
      },
    }),
    prisma.feeStructure.create({
      data: {
        name: 'Transport Fee',
        academicYearId: academicYear.id,
        feeType: 'TRANSPORT',
        amount: 2000,
        frequency: 'MONTHLY',
        dueDay: 10,
        lateFee: 50,
        isOptional: true,
      },
    }),
    prisma.feeStructure.create({
      data: {
        name: 'Library Fee',
        academicYearId: academicYear.id,
        feeType: 'LIBRARY',
        amount: 500,
        frequency: 'YEARLY',
        dueDay: 10,
      },
    }),
  ]);
  console.log('✅ Created Fee Structures');

  // Create Books
  const bookCategories = ['Fiction', 'Science', 'Mathematics', 'History', 'Literature'];
  await Promise.all(
    Array.from({ length: 50 }, (_, i) =>
      prisma.book.create({
        data: {
          isbn: `ISBN${(i + 1).toString().padStart(10, '0')}`,
          title: `Book Title ${i + 1}`,
          author: `Author ${i + 1}`,
          publisher: 'EduNexus Publications',
          category: bookCategories[i % bookCategories.length],
          language: 'English',
          pages: 200 + (i * 10),
          price: 250 + (i * 10),
          quantity: 10,
          availableQty: 10,
          shelfLocation: `S${Math.floor(i / 10) + 1}-R${(i % 10) + 1}`,
        },
      })
    )
  );
  console.log('✅ Created 50 Books');

  // Create Vehicles and Routes
  const vehicles = await Promise.all(
    Array.from({ length: 5 }, (_, i) =>
      prisma.vehicle.create({
        data: {
          vehicleNo: `DL01AB${1000 + i}`,
          vehicleType: 'BUS',
          capacity: 40,
          driverName: `Driver ${i + 1}`,
          driverPhone: `99887766${i.toString().padStart(2, '0')}`,
          driverLicense: `DL${i + 1}2024`,
          conductorName: `Conductor ${i + 1}`,
          status: 'ACTIVE',
        },
      })
    )
  );

  for (const [index, vehicle] of vehicles.entries()) {
    const route = await prisma.route.create({
      data: {
        name: `Route ${index + 1}`,
        routeNo: `R${index + 1}`,
        vehicleId: vehicle.id,
        startPoint: 'School',
        endPoint: `Area ${index + 1}`,
        distance: 10 + (index * 2),
      },
    });

    await Promise.all(
      Array.from({ length: 5 }, (_, i) =>
        prisma.routeStop.create({
          data: {
            routeId: route.id,
            name: `Stop ${i + 1} - Route ${index + 1}`,
            pickupTime: `07:${(i * 10).toString().padStart(2, '0')}`,
            dropTime: `16:${(30 - i * 5).toString().padStart(2, '0')}`,
            fare: 1500 + (i * 100),
            sequence: i + 1,
          },
        })
      )
    );
  }
  console.log('✅ Created 5 Vehicles with Routes and Stops');

  // Create Hostel Buildings and Rooms
  const buildings = await Promise.all([
    prisma.hostelBuilding.create({
      data: {
        name: 'Boys Hostel',
        code: 'BH1',
        type: 'BOYS',
        wardenName: 'Warden 1',
        wardenPhone: '9988776655',
        capacity: 100,
      },
    }),
    prisma.hostelBuilding.create({
      data: {
        name: 'Girls Hostel',
        code: 'GH1',
        type: 'GIRLS',
        wardenName: 'Warden 2',
        wardenPhone: '9988776644',
        capacity: 100,
      },
    }),
  ]);

  for (const building of buildings) {
    await Promise.all(
      Array.from({ length: 20 }, (_, i) =>
        prisma.hostelRoom.create({
          data: {
            roomNo: `${building.code}-${(i + 1).toString().padStart(3, '0')}`,
            buildingId: building.id,
            floor: Math.floor(i / 5) + 1,
            roomType: i % 4 === 0 ? 'SINGLE' : i % 4 === 1 ? 'DOUBLE' : 'TRIPLE',
            capacity: i % 4 === 0 ? 1 : i % 4 === 1 ? 2 : 3,
            rentPerMonth: i % 4 === 0 ? 5000 : i % 4 === 1 ? 3500 : 2500,
            status: 'AVAILABLE',
          },
        })
      )
    );
  }
  console.log('✅ Created Hostel Buildings and Rooms');

  // Create Inventory Categories and Items
  const inventoryCategories = await Promise.all([
    prisma.inventoryCategory.create({ data: { name: 'Stationery' } }),
    prisma.inventoryCategory.create({ data: { name: 'Furniture' } }),
    prisma.inventoryCategory.create({ data: { name: 'Electronics' } }),
    prisma.inventoryCategory.create({ data: { name: 'Sports Equipment' } }),
  ]);

  for (const [index, category] of inventoryCategories.entries()) {
    await Promise.all(
      Array.from({ length: 5 }, (_, i) =>
        prisma.inventoryItem.create({
          data: {
            name: `${category.name} Item ${i + 1}`,
            code: `${category.name.slice(0, 3).toUpperCase()}${i + 1}`,
            categoryId: category.id,
            unit: category.name === 'Furniture' ? 'pieces' : 'units',
            quantity: 100 + (i * 10),
            minQuantity: 20,
            price: 100 + (index * 50) + (i * 10),
          },
        })
      )
    );
  }
  console.log('✅ Created Inventory Items');

  // Create Vendors
  await Promise.all(
    Array.from({ length: 5 }, (_, i) =>
      prisma.vendor.create({
        data: {
          name: `Vendor ${i + 1}`,
          code: `VND${i + 1}`,
          contactPerson: `Contact Person ${i + 1}`,
          email: `vendor${i + 1}@example.com`,
          phone: `9876${i}${i}${i}${i}${i}${i}`,
          address: `${i + 1} Vendor Street, City`,
          gstNo: `GST${i + 1}ABC1234`,
          isActive: true,
        },
      })
    )
  );
  console.log('✅ Created Vendors');

  // Create Grade Scale
  await Promise.all([
    prisma.gradeScale.create({ data: { name: 'A+', minPercent: 90, maxPercent: 100, gradePoint: 10, remarks: 'Outstanding' } }),
    prisma.gradeScale.create({ data: { name: 'A', minPercent: 80, maxPercent: 89.99, gradePoint: 9, remarks: 'Excellent' } }),
    prisma.gradeScale.create({ data: { name: 'B+', minPercent: 70, maxPercent: 79.99, gradePoint: 8, remarks: 'Very Good' } }),
    prisma.gradeScale.create({ data: { name: 'B', minPercent: 60, maxPercent: 69.99, gradePoint: 7, remarks: 'Good' } }),
    prisma.gradeScale.create({ data: { name: 'C+', minPercent: 50, maxPercent: 59.99, gradePoint: 6, remarks: 'Above Average' } }),
    prisma.gradeScale.create({ data: { name: 'C', minPercent: 40, maxPercent: 49.99, gradePoint: 5, remarks: 'Average' } }),
    prisma.gradeScale.create({ data: { name: 'D', minPercent: 33, maxPercent: 39.99, gradePoint: 4, remarks: 'Below Average' } }),
    prisma.gradeScale.create({ data: { name: 'F', minPercent: 0, maxPercent: 32.99, gradePoint: 0, remarks: 'Fail' } }),
  ]);
  console.log('✅ Created Grade Scale');

  // Create System Settings
  await Promise.all([
    prisma.systemSetting.create({ data: { key: 'school_name', value: 'EduNexus Demo School', category: 'general' } }),
    prisma.systemSetting.create({ data: { key: 'school_address', value: '123 Education Street, New Delhi 110001', category: 'general' } }),
    prisma.systemSetting.create({ data: { key: 'school_phone', value: '011-12345678', category: 'general' } }),
    prisma.systemSetting.create({ data: { key: 'school_email', value: 'info@edunexus.com', category: 'general' } }),
    prisma.systemSetting.create({ data: { key: 'working_days', value: 'Mon,Tue,Wed,Thu,Fri,Sat', category: 'academic' } }),
    prisma.systemSetting.create({ data: { key: 'school_start_time', value: '08:00', category: 'academic' } }),
    prisma.systemSetting.create({ data: { key: 'school_end_time', value: '15:00', category: 'academic' } }),
    prisma.systemSetting.create({ data: { key: 'late_fee_per_day', value: '10', category: 'finance' } }),
    prisma.systemSetting.create({ data: { key: 'library_fine_per_day', value: '5', category: 'library' } }),
    prisma.systemSetting.create({ data: { key: 'max_books_per_student', value: '3', category: 'library' } }),
  ]);
  console.log('✅ Created System Settings');

  // Create Sample Notice
  await prisma.notice.create({
    data: {
      title: 'Welcome to EduNexus',
      content: 'Welcome to EduNexus School Management System. This is a demo notice to showcase the notice board functionality.',
      type: 'GENERAL',
      targetRoles: [Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.PARENT],
      isPublished: true,
      publishedAt: new Date(),
      createdBy: adminUser.id,
    },
  });
  console.log('✅ Created Sample Notice');

  console.log('\n🎉 Database seeding completed successfully!');
  console.log('\n📝 Demo Credentials:');
  console.log('   Admin: admin@edunexus.com / admin123');
  console.log('   Teacher: teacher1@edunexus.com / teacher123');
  console.log('   Student: student1@edunexus.com / student123');
  console.log('   Parent: parent1@edunexus.com / parent123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
