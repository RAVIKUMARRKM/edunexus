'use client';

import Link from 'next/link';
import { Bell, MessageSquare, Mail, Send, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function CommunicationPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Communication Hub</h1>
        <p className="text-gray-600 mt-1">
          Manage notices, messages, and announcements
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Notices</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">
              Published notices
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground mt-1">
              New messages
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sent Today</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground mt-1">
              Messages sent
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Communication Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Notice Board */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle>Notice Board</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Create and manage school notices
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Post important announcements, events, holidays, and circulars to
                keep everyone informed.
              </p>
              <div className="flex space-x-3">
                <Link href="/communication/notices" className="flex-1">
                  <Button className="w-full" variant="outline">
                    View Notices
                  </Button>
                </Link>
                <Link href="/communication/notices/new" className="flex-1">
                  <Button className="w-full">
                    <Bell className="h-4 w-4 mr-2" />
                    Create Notice
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Messaging */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <CardTitle>Messages</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Send and receive private messages
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Communicate directly with teachers, staff, parents, and students
                through private messaging.
              </p>
              <div className="flex space-x-3">
                <Link href="/communication/messages" className="flex-1">
                  <Button className="w-full" variant="outline">
                    View Messages
                  </Button>
                </Link>
                <Link href="/communication/messages?compose=true" className="flex-1">
                  <Button className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Compose
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Notifications */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Mail className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <CardTitle>Email Notifications</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Bulk email communication
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Send bulk emails to parents, students, or staff members for
                important updates.
              </p>
              <Button className="w-full" variant="outline" disabled>
                <Mail className="h-4 w-4 mr-2" />
                Coming Soon
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* SMS Alerts */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <CardTitle>SMS Alerts</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Send SMS notifications
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Send quick SMS alerts for attendance, fees, and emergency
                notifications.
              </p>
              <Button className="w-full" variant="outline" disabled>
                <MessageSquare className="h-4 w-4 mr-2" />
                Coming Soon
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
