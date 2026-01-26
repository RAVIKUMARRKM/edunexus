'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

export default function ComposeMessagePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserList, setShowUserList] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    content: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.role.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
      setShowUserList(true);
    } else {
      setFilteredUsers(users);
      setShowUserList(false);
    }
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users?limit=100');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to load users');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUser) {
      toast.error('Please select a recipient');
      return;
    }

    if (!formData.content.trim()) {
      toast.error('Message content is required');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: selectedUser.id,
          subject: formData.subject,
          content: formData.content,
        }),
      });

      if (response.ok) {
        toast.success('Message sent successfully!');
        router.push('/communication/messages');
        router.refresh();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Send message error:', error);
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const selectUser = (user: User) => {
    setSelectedUser(user);
    setSearchQuery(user.name);
    setShowUserList(false);
  };

  const clearRecipient = () => {
    setSelectedUser(null);
    setSearchQuery('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/communication/messages">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Compose Message</h1>
          <p className="text-gray-600 mt-1">
            Send a private message to a user
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>New Message</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Recipient Search */}
            <div className="space-y-2">
              <Label htmlFor="recipient">To *</Label>
              <div className="relative">
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="recipient"
                      placeholder="Search users by name, email, or role..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setShowUserList(true)}
                      className="pl-10"
                      disabled={!!selectedUser}
                    />
                  </div>
                  {selectedUser && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={clearRecipient}
                    >
                      Change
                    </Button>
                  )}
                </div>

                {/* Selected User Display */}
                {selectedUser && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={selectedUser.avatar} />
                        <AvatarFallback>
                          {selectedUser.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">
                          {selectedUser.name}
                        </p>
                        <div className="flex items-center space-x-2">
                          <p className="text-sm text-gray-600">
                            {selectedUser.email}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {selectedUser.role}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* User List Dropdown */}
                {showUserList && !selectedUser && filteredUsers.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-64 overflow-y-auto">
                    {filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                        onClick={() => selectUser(user)}
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback className="text-xs">
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {user.name}
                            </p>
                            <div className="flex items-center space-x-2">
                              <p className="text-xs text-gray-600 truncate">
                                {user.email}
                              </p>
                              <Badge variant="outline" className="text-xs">
                                {user.role}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {showUserList && !selectedUser && filteredUsers.length === 0 && searchQuery && (
                  <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg p-4 text-center text-gray-600">
                    No users found matching "{searchQuery}"
                  </div>
                )}
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <Label htmlFor="subject">Subject (Optional)</Label>
              <Input
                id="subject"
                placeholder="Enter message subject"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
              />
            </div>

            {/* Message Content */}
            <div className="space-y-2">
              <Label htmlFor="content">Message *</Label>
              <Textarea
                id="content"
                placeholder="Type your message here..."
                rows={8}
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                required
              />
              <p className="text-sm text-gray-500">
                {formData.content.length} characters
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <Link href="/communication/messages">
                <Button type="button" variant="outline" disabled={loading}>
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={loading || !selectedUser || !formData.content.trim()}
              >
                <Send className="h-4 w-4 mr-2" />
                {loading ? 'Sending...' : 'Send Message'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
