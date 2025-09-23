"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Switch,
} from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Bell,
  Mail,
  MessageSquare,
  Phone,
  Send,
  Settings,
  User,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { LoadingSpinner } from '@/components/ui/loading-spinner';
interface NotificationTemplate {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'push';
  trigger: 'status_change' | 'assignment' | 'completion' | 'reminder';
  subject?: string;
  content: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface NotificationLog {
  id: string;
  reportId: string;
  reportReference: string;
  recipientEmail: string;
  recipientPhone?: string;
  type: 'email' | 'sms' | 'push';
  status: 'sent' | 'delivered' | 'failed' | 'pending';
  templateId: string;
  templateName: string;
  sentAt: string;
  deliveredAt?: string;
  errorMessage?: string;
  content: string;
}

interface CitizenPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  statusUpdates: boolean;
  reminders: boolean;
  marketing: boolean;
  frequency: 'immediate' | 'daily' | 'weekly';
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

/**
 * Citizen Notification System Component
 * Manages notification templates, sending, and citizen preferences
 */
export function CitizenNotificationSystem() {
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [notifications, setNotifications] = useState<NotificationLog[]>([]);
  const [preferences, setPreferences] = useState<CitizenPreferences>({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    statusUpdates: true,
    reminders: true,
    marketing: false,
    frequency: 'immediate',
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00',
    },
  });
  const [loading, setLoading] = useState(true);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null);
  const [newTemplate, setNewTemplate] = useState<Partial<NotificationTemplate>>({
    name: '',
    type: 'email',
    trigger: 'status_change',
    content: '',
    isActive: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Simulate API calls
      const mockTemplates: NotificationTemplate[] = [
        {
          id: '1',
          name: 'Report Acknowledged Email',
          type: 'email',
          trigger: 'status_change',
          subject: 'Your report has been received - {{referenceNumber}}',
          content: 'Dear {{reporterName}},\n\nThank you for reporting: {{reportTitle}}\n\nReference: {{referenceNumber}}\n\nWe have received your report and will review it shortly. You can track its progress using the reference number above.\n\nBest regards,\nCouncil Team',
          isActive: true,
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z',
        },
        {
          id: '2',
          name: 'Report Completed SMS',
          type: 'sms',
          trigger: 'completion',
          content: 'Your report {{referenceNumber}} has been completed. Thank you for helping improve our community!',
          isActive: true,
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z',
        },
        {
          id: '3',
          name: 'Weekly Reminder Email',
          type: 'email',
          trigger: 'reminder',
          subject: 'Weekly Report Summary',
          content: 'Dear {{reporterName}},\n\nHere\'s a summary of your reports this week:\n\n{{reportSummary}}\n\nThank you for your continued engagement with our community.\n\nBest regards,\nCouncil Team',
          isActive: false,
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z',
        },
      ];

      const mockNotifications: NotificationLog[] = [
        {
          id: '1',
          reportId: 'report-1',
          reportReference: 'REF-ABC123XYZ',
          recipientEmail: 'john.smith@email.com',
          type: 'email',
          status: 'delivered',
          templateId: '1',
          templateName: 'Report Acknowledged Email',
          sentAt: '2025-01-13T09:35:00Z',
          deliveredAt: '2025-01-13T09:35:15Z',
          content: 'Your report REF-ABC123XYZ has been received...',
        },
        {
          id: '2',
          reportId: 'report-1',
          reportReference: 'REF-ABC123XYZ',
          recipientEmail: 'john.smith@email.com',
          type: 'email',
          status: 'sent',
          templateId: '1',
          templateName: 'Status Update Email',
          sentAt: '2025-01-13T14:20:00Z',
          content: 'Your report REF-ABC123XYZ status has been updated...',
        },
        {
          id: '3',
          reportId: 'report-2',
          reportReference: 'REF-SSS789DEF',
          recipientEmail: 'anonymous@snapsendsolve.com',
          type: 'sms',
          status: 'failed',
          templateId: '2',
          templateName: 'Report Completed SMS',
          sentAt: '2025-01-13T16:45:00Z',
          errorMessage: 'Invalid phone number format',
          content: 'Your report REF-SSS789DEF has been completed...',
        },
      ];

      await new Promise(resolve => setTimeout(resolve, 1000));
      setTemplates(mockTemplates);
      setNotifications(mockNotifications);
    } catch (error) {
      console.error("Failed to load notification data:", error);
      toast.error("Failed to load notification data");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTemplate = async () => {
    try {
      if (editingTemplate) {
        // Update existing template
        setTemplates(prev => prev.map(t => 
          t.id === editingTemplate.id 
            ? { ...t, ...newTemplate, updatedAt: new Date().toISOString() }
            : t
        ));
        toast.success("Template updated successfully");
      } else {
        // Create new template
        const template: NotificationTemplate = {
          id: `template-${Date.now()}`,
          name: newTemplate.name || 'Untitled Template',
          type: newTemplate.type || 'email',
          trigger: newTemplate.trigger || 'status_change',
          subject: newTemplate.subject,
          content: newTemplate.content || '',
          isActive: newTemplate.isActive || true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        setTemplates(prev => [template, ...prev]);
        toast.success("Template created successfully");
      }
      
      setShowTemplateDialog(false);
      setEditingTemplate(null);
      setNewTemplate({
        name: '',
        type: 'email',
        trigger: 'status_change',
        content: '',
        isActive: true,
      });
    } catch (error) {
      console.error("Failed to save template:", error);
      toast.error("Failed to save template");
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      setTemplates(prev => prev.filter(t => t.id !== templateId));
      toast.success("Template deleted successfully");
    } catch (error) {
      console.error("Failed to delete template:", error);
      toast.error("Failed to delete template");
    }
  };

  const handleSendTestNotification = async (templateId: string) => {
    try {
      toast.info("Sending test notification...");
      // Simulate sending test notification
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Test notification sent successfully");
    } catch (error) {
      console.error("Failed to send test notification:", error);
      toast.error("Failed to send test notification");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent': return <Badge variant="default">Sent</Badge>;
      case 'delivered': return <Badge variant="default">Delivered</Badge>;
      case 'failed': return <Badge variant="destructive">Failed</Badge>;
      case 'pending': return <Badge variant="outline">Pending</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'sms': return <Phone className="h-4 w-4" />;
      case 'push': return <Bell className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-AU", {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
        <span className="ml-2">Loading notification system...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Citizen Notification System</h1>
          
        </div>
        <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Send className="h-4 w-4 mr-2" />
              New Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingTemplate ? 'Edit Template' : 'Create Notification Template'}
              </DialogTitle>
              <DialogDescription>
                {editingTemplate ? 'Update the notification template' : 'Create a new notification template for citizen communications'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="template-name">Template Name</Label>
                <Input
                  id="template-name"
                  placeholder="Enter template name"
                  value={newTemplate.name || ''}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="template-type">Type</Label>
                  <Select 
                    value={newTemplate.type || 'email'} 
                    onValueChange={(value: any) => setNewTemplate(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="push">Push Notification</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="template-trigger">Trigger</Label>
                  <Select 
                    value={newTemplate.trigger || 'status_change'} 
                    onValueChange={(value: any) => setNewTemplate(prev => ({ ...prev, trigger: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="status_change">Status Change</SelectItem>
                      <SelectItem value="assignment">Assignment</SelectItem>
                      <SelectItem value="completion">Completion</SelectItem>
                      <SelectItem value="reminder">Reminder</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {newTemplate.type === 'email' && (
                <div>
                  <Label htmlFor="template-subject">Subject</Label>
                  <Input
                    id="template-subject"
                    placeholder="Email subject line"
                    value={newTemplate.subject || ''}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, subject: e.target.value }))}
                  />
                </div>
              )}
              
              <div>
                <Label htmlFor="template-content">Content</Label>
                <Textarea
                  id="template-content"
                  placeholder="Enter notification content..."
                  rows={8}
                  value={newTemplate.content || ''}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, content: e.target.value }))}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use variables like {{reporterName}}, {{referenceNumber}}, {{reportTitle}} for dynamic content
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="template-active"
                  checked={newTemplate.isActive || false}
                  onCheckedChange={(checked) => setNewTemplate(prev => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="template-active">Active</Label>
              </div>
              
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowTemplateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveTemplate}>
                  {editingTemplate ? 'Update Template' : 'Create Template'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Notification Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Notification Templates
          </CardTitle>
          <CardDescription>
            Manage templates for citizen notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Trigger</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell className="font-medium">{template.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(template.type)}
                      <span className="capitalize">{template.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {template.trigger.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={template.isActive ? "default" : "secondary"}>
                      {template.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatDate(template.updatedAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSendTestNotification(template.id)}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingTemplate(template);
                          setNewTemplate(template);
                          setShowTemplateDialog(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTemplate(template.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Notification Log */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Log
          </CardTitle>
          <CardDescription>
            Track sent notifications and delivery status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Reference</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Template</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sent At</TableHead>
                <TableHead>Delivered At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifications.map((notification) => (
                <TableRow key={notification.id}>
                  <TableCell className="font-mono text-sm">
                    {notification.reportReference}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{notification.recipientEmail}</div>
                      {notification.recipientPhone && (
                        <div className="text-sm text-gray-500">
                          {notification.recipientPhone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(notification.type)}
                      <span className="capitalize">{notification.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>{notification.templateName}</TableCell>
                  <TableCell>{getStatusBadge(notification.status)}</TableCell>
                  <TableCell className="text-sm">
                    {formatDate(notification.sentAt)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {notification.deliveredAt ? formatDate(notification.deliveredAt) : '-'}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Citizen Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5" />
            Citizen Notification Preferences
          </CardTitle>
          <CardDescription>
            Configure default notification preferences for citizens
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Notification Types</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <Switch
                    id="email-notifications"
                    checked={preferences.emailNotifications}
                    onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, emailNotifications: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="sms-notifications">SMS Notifications</Label>
                  <Switch
                    id="sms-notifications"
                    checked={preferences.smsNotifications}
                    onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, smsNotifications: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <Switch
                    id="push-notifications"
                    checked={preferences.pushNotifications}
                    onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, pushNotifications: checked }))}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold">Content Preferences</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="status-updates">Status Updates</Label>
                  <Switch
                    id="status-updates"
                    checked={preferences.statusUpdates}
                    onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, statusUpdates: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="reminders">Reminders</Label>
                  <Switch
                    id="reminders"
                    checked={preferences.reminders}
                    onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, reminders: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="marketing">Marketing</Label>
                  <Switch
                    id="marketing"
                    checked={preferences.marketing}
                    onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, marketing: checked }))}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
