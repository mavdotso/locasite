'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { 
  MessageSquare, 
  Search,
  Filter,
  Mail,
  Phone,
  Clock,
  Check,
  Reply,
  User,
  Building
} from 'lucide-react';
import { toast } from 'sonner';

type MessageStatus = 'all' | 'unread' | 'read' | 'responded';

interface MessageWithBusiness {
  _id: Id<"contactMessages">;
  businessId: Id<"businesses">;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: 'unread' | 'read' | 'responded';
  createdAt: number;
  updatedAt?: number;
  business?: {
    name: string;
    _id: Id<"businesses">;
  };
}

export default function MessagesManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<MessageStatus>('all');
  const [selectedMessage, setSelectedMessage] = useState<MessageWithBusiness | null>(null);
  const [replyText, setReplyText] = useState('');

  const user = useQuery(api.helpers.getCurrentUser);
  const allMessages = useQuery(api.contactMessages.getAllUserMessages) || [];

  const markAsRead = useMutation(api.contactMessages.markAsRead);
  const markAsResponded = useMutation(api.contactMessages.markAsResponded);

  // Filter messages based on search and status
  const filteredMessages = allMessages.filter(message => {
    const matchesSearch = message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.business?.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || message.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleMarkAsRead = async (messageId: Id<"contactMessages">) => {
    try {
      await markAsRead({ messageId });
      toast.success('Message marked as read');
    } catch (error) {
      console.error('Error marking message as read:', error);
      toast.error('Failed to mark message as read');
    }
  };

  const handleMarkAsResponded = async (messageId: Id<"contactMessages">) => {
    try {
      await markAsResponded({ messageId });
      toast.success('Message marked as responded');
      setSelectedMessage(null);
      setReplyText('');
    } catch (error) {
      console.error('Error marking message as responded:', error);
      toast.error('Failed to mark message as responded');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'unread':
        return <Badge className="bg-primary/10 text-primary">Unread</Badge>;
      case 'read':
        return <Badge variant="outline">Read</Badge>;
      case 'responded':
        return <Badge className="bg-green-100 text-green-800">Responded</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const statusCounts = {
    all: filteredMessages.length,
    unread: filteredMessages.filter(m => m.status === 'unread').length,
    read: filteredMessages.filter(m => m.status === 'read').length,
    responded: filteredMessages.filter(m => m.status === 'responded').length,
  };

  if (!user) {
    return (
      <Card className="p-8 text-center">
        <div className="text-muted-foreground">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Please sign in to view your messages.</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Messages List */}
      <div className="lg:col-span-2 space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground/50 w-4 h-4" />
              <Input
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
          {(['all', 'unread', 'read', 'responded'] as MessageStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                statusFilter === status
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)} ({statusCounts[status]})
            </button>
          ))}
        </div>

        {/* Messages List */}
        {filteredMessages.length > 0 ? (
          <div className="space-y-4">
            {filteredMessages.map((message) => (
              <Card 
                key={message._id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedMessage?._id === message._id ? 'ring-2 ring-primary' : ''
                } ${message.status === 'unread' ? 'bg-muted border-border' : ''}`}
                onClick={() => {
                  setSelectedMessage(message);
                  if (message.status === 'unread') {
                    handleMarkAsRead(message._id);
                  }
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-foreground">{message.name}</h3>
                          {getStatusBadge(message.status)}
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div className="flex items-center gap-2">
                            <Mail className="w-3 h-3" />
                            <span>{message.email}</span>
                          </div>
                          {message.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-3 h-3" />
                              <span>{message.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Building className="w-3 h-3" />
                            <span>{message.business?.name}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      {new Date(message.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-2">
                    {message.message}
                  </p>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMessage(message);
                    }}>
                      <Reply className="w-3 h-3 mr-1" />
                      Reply
                    </Button>
                    {message.status === 'unread' && (
                      <Button size="sm" variant="ghost" onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(message._id);
                      }}>
                        <Check className="w-3 h-3 mr-1" />
                        Mark Read
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="text-muted-foreground">
              {searchQuery || statusFilter !== 'all' ? (
                <>
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No messages found</h3>
                  <p className="mb-4">Try adjusting your search or filter criteria.</p>
                  <Button variant="outline" onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                  }}>
                    Clear filters
                  </Button>
                </>
              ) : (
                <>
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No messages yet</h3>
                  <p className="mb-4">When customers contact you through your sites, messages will appear here.</p>
                </>
              )}
            </div>
          </Card>
        )}
      </div>

      {/* Message Detail / Reply Panel */}
      <div className="space-y-6">
        {selectedMessage ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Message Details</CardTitle>
                <CardDescription>
                  From {selectedMessage.business?.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">From</label>
                    <div className="text-sm text-foreground">{selectedMessage.name}</div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <div className="text-sm text-foreground">{selectedMessage.email}</div>
                  </div>
                  
                  {selectedMessage.phone && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Phone</label>
                      <div className="text-sm text-foreground">{selectedMessage.phone}</div>
                    </div>
                  )}
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Received</label>
                    <div className="text-sm text-foreground">
                      {new Date(selectedMessage.createdAt).toLocaleString()}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <div className="mt-1">
                      {getStatusBadge(selectedMessage.status)}
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Message</label>
                  <div className="mt-1 p-3 bg-muted rounded-lg text-sm text-foreground">
                    {selectedMessage.message}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Reply</CardTitle>
                <CardDescription>
                  Send a response to {selectedMessage.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Type your reply here..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={4}
                />
                
                <div className="flex gap-2">
                  <Button 
                    onClick={() => {
                      // TODO: Implement actual email sending
                      handleMarkAsResponded(selectedMessage._id);
                    }}
                    disabled={!replyText.trim()}
                  >
                    Send Reply
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleMarkAsResponded(selectedMessage._id)}
                  >
                    Mark as Responded
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card className="p-8 text-center">
            <div className="text-muted-foreground">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-foreground mb-2">Select a message</h3>
              <p>Choose a message from the list to view details and reply.</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}