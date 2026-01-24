'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Key, Search, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';

const searchSchema = z.object({
  query: z.string().min(2, 'Enter at least 2 characters'),
});

const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  forcePasswordChange: z.boolean().default(true),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type SearchFormData = z.infer<typeof searchSchema>;
type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
}

export default function PasswordManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const searchForm = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
  });

  const resetForm = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      forcePasswordChange: true,
    },
  });

  const onSearch = async (data: SearchFormData) => {
    setIsSearching(true);
    try {
      const response = await fetch(`/api/users/search?q=${encodeURIComponent(data.query)}`);

      if (response.ok) {
        const result = await response.json();
        setUsers(result.users || []);
        if (result.users.length === 0) {
          toast.info('No users found');
        }
      } else {
        toast.error('Failed to search users');
      }
    } catch (error) {
      toast.error('An error occurred while searching');
    } finally {
      setIsSearching(false);
    }
  };

  const onResetPassword = async (data: ResetPasswordFormData) => {
    if (!selectedUser) return;

    setIsResetting(true);
    try {
      const response = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser.id,
          newPassword: data.newPassword,
          forcePasswordChange: data.forcePasswordChange,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
        setDialogOpen(false);
        resetForm.reset();
        setSelectedUser(null);
      } else {
        toast.error(result.error || 'Failed to reset password');
      }
    } catch (error) {
      toast.error('An error occurred while resetting password');
    } finally {
      setIsResetting(false);
    }
  };

  const openResetDialog = (user: User) => {
    setSelectedUser(user);
    resetForm.reset({
      newPassword: '',
      confirmPassword: '',
      forcePasswordChange: true,
    });
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Key className="h-8 w-8" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Password Management</h1>
          <p className="text-muted-foreground">
            Reset passwords for teachers, students, and staff
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Users</CardTitle>
          <CardDescription>
            Search by name or email to reset a user's password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={searchForm.handleSubmit(onSearch)} className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Search by name or email..."
                {...searchForm.register('query')}
                disabled={isSearching}
              />
              {searchForm.formState.errors.query && (
                <p className="text-sm text-destructive mt-1">
                  {searchForm.formState.errors.query.message}
                </p>
              )}
            </div>
            <Button type="submit" disabled={isSearching}>
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              <span className="ml-2">Search</span>
            </Button>
          </form>
        </CardContent>
      </Card>

      {users.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
            <CardDescription>Found {users.length} user(s)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.isActive ? 'default' : 'destructive'}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openResetDialog(user)}
                        >
                          Reset Password
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Reset password for {selectedUser?.name} ({selectedUser?.email})
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={resetForm.handleSubmit(onResetPassword)}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  {...resetForm.register('newPassword')}
                  disabled={isResetting}
                />
                {resetForm.formState.errors.newPassword && (
                  <p className="text-sm text-destructive">
                    {resetForm.formState.errors.newPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  {...resetForm.register('confirmPassword')}
                  disabled={isResetting}
                />
                {resetForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-destructive">
                    {resetForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="forcePasswordChange"
                  {...resetForm.register('forcePasswordChange')}
                  disabled={isResetting}
                />
                <Label
                  htmlFor="forcePasswordChange"
                  className="text-sm font-normal cursor-pointer"
                >
                  Force user to change password on next login
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={isResetting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isResetting}>
                {isResetting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Reset Password
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
