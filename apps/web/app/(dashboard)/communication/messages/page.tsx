'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { MessageSquare, Send, Inbox, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs } from '@/components/ui/tabs';

interface Message {
  id: string;
  subject?: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: string;
  };
  receiver: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: string;
  };
}

export default function MessagesPage() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');

  useEffect(() => {
    fetchMessages();
  }, [activeTab]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/messages?type=${activeTab}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-1">
            {unreadCount > 0 && `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}`}
          </p>
        </div>
        <Button>
          <Send className="h-4 w-4 mr-2" />
          Compose
        </Button>
      </div>

      {/* Tabs */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex space-x-2">
            <Button
              variant={activeTab === 'received' ? 'default' : 'outline'}
              onClick={() => setActiveTab('received')}
              className="flex-1"
            >
              <Inbox className="h-4 w-4 mr-2" />
              Received
              {unreadCount > 0 && activeTab === 'received' && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </Button>
            <Button
              variant={activeTab === 'sent' ? 'default' : 'outline'}
              onClick={() => setActiveTab('sent')}
              className="flex-1"
            >
              <Send className="h-4 w-4 mr-2" />
              Sent
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Messages List */}
      <div className="space-y-3">
        {messages.length > 0 ? (
          messages.map((message) => {
            const otherUser = activeTab === 'received' ? message.sender : message.receiver;
            return (
              <Card
                key={message.id}
                className={`hover:shadow-md transition-shadow cursor-pointer ${
                  !message.isRead && activeTab === 'received'
                    ? 'bg-blue-50 border-blue-200'
                    : ''
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <Avatar>
                      <AvatarImage src={otherUser.avatar} />
                      <AvatarFallback>
                        {otherUser.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-semibold text-gray-900">
                            {otherUser.name}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            {otherUser.role}
                          </Badge>
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatDate(message.createdAt)}
                        </span>
                      </div>
                      {message.subject && (
                        <p className="text-sm font-medium text-gray-800 mb-1">
                          {message.subject}
                        </p>
                      )}
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {message.content}
                      </p>
                    </div>
                    {!message.isRead && activeTab === 'received' && (
                      <div className="flex-shrink-0">
                        <Badge variant="info">New</Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No messages found</p>
                <p className="text-sm text-gray-500 mt-1">
                  {activeTab === 'received'
                    ? 'Your inbox is empty'
                    : "You haven't sent any messages yet"}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
