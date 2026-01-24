'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { studentSchema, type StudentInput } from '@edunexus/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card } from '@/components/ui/card';

interface StudentFormProps {
  initialData?: Partial<StudentInput>;
  onSubmit: (data: StudentInput) => Promise<void>;
  isLoading?: boolean;
  classes?: Array<{ id: string; name: string }>;
  sections?: Array<{ id: string; name: string }>;
}

export function StudentForm({
  initialData,
  onSubmit,
  isLoading = false,
  classes = [],
  sections = [],
}: StudentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<StudentInput>({
    resolver: zodResolver(studentSchema),
    defaultValues: initialData,
  });

  const selectedClassId = watch('classId');

  const filteredSections = sections.filter(
    (section: any) => section.classId === selectedClassId
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="admissionNo">Admission Number *</Label>
            <Input
              id="admissionNo"
              {...register('admissionNo')}
              disabled={!!initialData}
              placeholder="ADM001"
            />
            {errors.admissionNo && (
              <p className="text-sm text-red-500 mt-1">{errors.admissionNo.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              {...register('firstName')}
              placeholder="John"
            />
            {errors.firstName && (
              <p className="text-sm text-red-500 mt-1">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              {...register('lastName')}
              placeholder="Doe"
            />
            {errors.lastName && (
              <p className="text-sm text-red-500 mt-1">{errors.lastName.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="dateOfBirth">Date of Birth *</Label>
            <Input
              id="dateOfBirth"
              type="date"
              {...register('dateOfBirth')}
            />
            {errors.dateOfBirth && (
              <p className="text-sm text-red-500 mt-1">{errors.dateOfBirth.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="gender">Gender *</Label>
            <select
              id="gender"
              {...register('gender')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
            {errors.gender && (
              <p className="text-sm text-red-500 mt-1">{errors.gender.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="bloodGroup">Blood Group</Label>
            <select
              id="bloodGroup"
              {...register('bloodGroup')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>

          <div>
            <Label htmlFor="nationality">Nationality</Label>
            <Input
              id="nationality"
              {...register('nationality')}
              placeholder="Indian"
              defaultValue="Indian"
            />
          </div>

          <div>
            <Label htmlFor="religion">Religion</Label>
            <Input
              id="religion"
              {...register('religion')}
              placeholder="Hindu"
            />
          </div>

          <div>
            <Label htmlFor="caste">Caste</Label>
            <Input
              id="caste"
              {...register('caste')}
              placeholder="General"
            />
          </div>

          <div>
            <Label htmlFor="motherTongue">Mother Tongue</Label>
            <Input
              id="motherTongue"
              {...register('motherTongue')}
              placeholder="Hindi"
            />
          </div>
        </div>
      </Card>

      {/* Academic Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Academic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="classId">Class *</Label>
            <select
              id="classId"
              {...register('classId')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Select Class</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
            {errors.classId && (
              <p className="text-sm text-red-500 mt-1">{errors.classId.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="sectionId">Section *</Label>
            <select
              id="sectionId"
              {...register('sectionId')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              disabled={!selectedClassId}
            >
              <option value="">Select Section</option>
              {filteredSections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.name}
                </option>
              ))}
            </select>
            {errors.sectionId && (
              <p className="text-sm text-red-500 mt-1">{errors.sectionId.message}</p>
            )}
          </div>
        </div>
      </Card>

      {/* Contact Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="student@example.com"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              {...register('phone')}
              placeholder="+91 9876543210"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              {...register('address')}
              placeholder="123 Main St"
            />
          </div>

          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              {...register('city')}
              placeholder="Mumbai"
            />
          </div>

          <div>
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              {...register('state')}
              placeholder="Maharashtra"
            />
          </div>

          <div>
            <Label htmlFor="pincode">Pincode</Label>
            <Input
              id="pincode"
              {...register('pincode')}
              placeholder="400001"
            />
          </div>
        </div>
      </Card>

      {/* Parent Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Parent Information</h3>
        <div className="space-y-6">
          {/* Father Details */}
          <div>
            <h4 className="text-md font-medium mb-3">Father Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fatherName">Father Name</Label>
                <Input
                  id="fatherName"
                  {...register('fatherName')}
                  placeholder="John Doe Sr."
                />
              </div>

              <div>
                <Label htmlFor="fatherPhone">Father Phone</Label>
                <Input
                  id="fatherPhone"
                  {...register('fatherPhone')}
                  placeholder="+91 9876543210"
                />
              </div>

              <div>
                <Label htmlFor="fatherEmail">Father Email</Label>
                <Input
                  id="fatherEmail"
                  type="email"
                  {...register('fatherEmail')}
                  placeholder="father@example.com"
                />
              </div>

              <div>
                <Label htmlFor="fatherOccupation">Father Occupation</Label>
                <Input
                  id="fatherOccupation"
                  {...register('fatherOccupation')}
                  placeholder="Business"
                />
              </div>
            </div>
          </div>

          {/* Mother Details */}
          <div>
            <h4 className="text-md font-medium mb-3">Mother Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="motherName">Mother Name</Label>
                <Input
                  id="motherName"
                  {...register('motherName')}
                  placeholder="Jane Doe"
                />
              </div>

              <div>
                <Label htmlFor="motherPhone">Mother Phone</Label>
                <Input
                  id="motherPhone"
                  {...register('motherPhone')}
                  placeholder="+91 9876543210"
                />
              </div>

              <div>
                <Label htmlFor="motherEmail">Mother Email</Label>
                <Input
                  id="motherEmail"
                  type="email"
                  {...register('motherEmail')}
                  placeholder="mother@example.com"
                />
              </div>

              <div>
                <Label htmlFor="motherOccupation">Mother Occupation</Label>
                <Input
                  id="motherOccupation"
                  {...register('motherOccupation')}
                  placeholder="Teacher"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : initialData ? 'Update Student' : 'Create Student'}
        </Button>
      </div>
    </form>
  );
}
