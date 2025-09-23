"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Camera,
  FileText,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
  Upload,
  X,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

import { LoadingSpinner } from '@/components/ui/loading-spinner';
interface ReportFormData {
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  location: {
    address: string;
    lat?: number;
    lng?: number;
  };
  contactInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  attachments: File[];
  isAnonymous: boolean;
}

interface ReportSubmission {
  id: string;
  referenceNumber: string;
  status: 'submitted' | 'acknowledged' | 'in-progress' | 'completed' | 'closed';
  submittedAt: string;
  estimatedResolution?: string;
}

/**
 * Citizen Report Form Component
 * Public-facing form for citizens to report issues and concerns
 */
export function CitizenReportForm() {
  const [formData, setFormData] = useState<ReportFormData>({
    title: "",
    description: "",
    category: "",
    priority: 'medium',
    location: {
      address: "",
    },
    contactInfo: {
      name: "",
      email: "",
      phone: "",
    },
    attachments: [],
    isAnonymous: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submission, setSubmission] = useState<ReportSubmission | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  const categories = [
    { value: 'road-maintenance', label: 'Road Maintenance' },
    { value: 'street-lighting', label: 'Street Lighting' },
    { value: 'parks-recreation', label: 'Parks & Recreation' },
    { value: 'waste-management', label: 'Waste Management' },
    { value: 'water-sewer', label: 'Water & Sewer' },
    { value: 'building-maintenance', label: 'Building Maintenance' },
    { value: 'safety-hazard', label: 'Safety Hazard' },
    { value: 'noise-complaint', label: 'Noise Complaint' },
    { value: 'environmental', label: 'Environmental Issue' },
    { value: 'other', label: 'Other' },
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800' },
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof ReportFormData],
        [field]: value,
      },
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
      
      if (file.size > maxSize) {
        toast.error(`File ${file.name} is too large. Maximum size is 10MB.`);
        return false;
      }
      
      if (!allowedTypes.includes(file.type)) {
        toast.error(`File ${file.name} is not a supported format.`);
        return false;
      }
      
      return true;
    });

    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...validFiles],
    }));
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error("Please enter a title for your report");
      return false;
    }
    
    if (!formData.description.trim()) {
      toast.error("Please provide a description");
      return false;
    }
    
    if (!formData.category) {
      toast.error("Please select a category");
      return false;
    }
    
    if (!formData.location.address.trim()) {
      toast.error("Please provide the location");
      return false;
    }
    
    if (!formData.isAnonymous) {
      if (!formData.contactInfo.name.trim()) {
        toast.error("Please provide your name");
        return false;
      }
      
      if (!formData.contactInfo.email.trim()) {
        toast.error("Please provide your email");
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newSubmission: ReportSubmission = {
        id: `report-${Date.now()}`,
        referenceNumber: `REF-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        status: 'submitted',
        submittedAt: new Date().toISOString(),
        estimatedResolution: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days
      };

      setSubmission(newSubmission);
      setCurrentStep(4);
      
      toast.success("Report submitted successfully!");
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        priority: 'medium',
        location: { address: "" },
        contactInfo: { name: "", email: "", phone: "" },
        attachments: [],
        isAnonymous: false,
      });
    } catch (error) {
      console.error("Failed to submit report:", error);
      toast.error("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1: return "Report Details";
      case 2: return "Location & Contact";
      case 3: return "Review & Submit";
      case 4: return "Submission Complete";
      default: return "Report Submission";
    }
  };

  if (submission && currentStep === 4) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-600">Report Submitted Successfully!</CardTitle>
          <CardDescription>
            Thank you for your report. We'll review it and take appropriate action.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Reference Number</Label>
                <p className="text-lg font-mono font-bold">{submission.referenceNumber}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Status</Label>
                <Badge variant="default" className="ml-2">Submitted</Badge>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-semibold">What happens next?</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>You'll receive an email confirmation within 24 hours</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>Your report will be reviewed and assigned to the appropriate department</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>You'll receive updates on the progress of your report</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>Estimated resolution: {new Date(submission.estimatedResolution!).toLocaleDateString("en-AU")}</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => {
                setSubmission(null);
                setCurrentStep(1);
              }}
            >
              Submit Another Report
            </Button>
            <Button 
              className="flex-1"
              onClick={() => {
                // In real implementation, this would navigate to status tracking
                toast.info("Status tracking feature coming soon!");
              }}
            >
              Track Status
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Report an Issue</CardTitle>
          <CardDescription>
            Help us keep our community safe and well-maintained by reporting issues you encounter.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                <div className="ml-2">
                  <div className={`text-sm font-medium ${
                    step <= currentStep ? 'text-blue-600' : 'text-gray-600'
                  }`}>
                    {getStepTitle(step)}
                  </div>
                </div>
                {step < 3 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Report Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="title">Report Title *</Label>
                <Input
                  id="title"
                  placeholder="Brief description of the issue"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={formData.priority} onValueChange={(value: any) => handleInputChange('priority', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        <div className="flex items-center gap-2">
                          <Badge className={priority.color}>
                            {priority.label}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Please provide detailed information about the issue..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="attachments">Attachments (Optional)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600 mb-2">
                    Upload photos or documents (max 10MB each)
                  </p>
                  <Input
                    id="attachments"
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('attachments')?.click()}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Upload Files
                  </Button>
                </div>
                
                {formData.attachments.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {formData.attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm">{file.name}</span>
                          <span className="text-xs text-gray-500">
                            ({(file.size / 1024 / 1024).toFixed(1)} MB)
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAttachment(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setCurrentStep(2)}>
                  Next Step
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Location & Contact */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="location">Location *</Label>
                <div className="flex gap-2">
                  <Input
                    id="location"
                    placeholder="Enter address or location description"
                    value={formData.location.address}
                    onChange={(e) => handleNestedInputChange('location', 'address', e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline">
                    <MapPin className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Be as specific as possible to help us locate the issue
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={formData.isAnonymous}
                  onChange={(e) => handleInputChange('isAnonymous', e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="anonymous" className="text-sm">
                  Submit anonymously
                </Label>
              </div>

              {!formData.isAnonymous && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Contact Information</h3>
                  
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="Your full name"
                      value={formData.contactInfo.name}
                      onChange={(e) => handleNestedInputChange('contactInfo', 'name', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.contactInfo.email}
                      onChange={(e) => handleNestedInputChange('contactInfo', 'email', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="0400 000 000"
                      value={formData.contactInfo.phone}
                      onChange={(e) => handleNestedInputChange('contactInfo', 'phone', e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  Previous
                </Button>
                <Button onClick={() => setCurrentStep(3)}>
                  Next Step
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Review & Submit */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Review Your Report</h3>
              
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Title</Label>
                  <p className="font-medium">{formData.title}</p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-600">Category</Label>
                  <p>{categories.find(c => c.value === formData.category)?.label}</p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-600">Priority</Label>
                  <Badge className={priorities.find(p => p.value === formData.priority)?.color}>
                    {priorities.find(p => p.value === formData.priority)?.label}
                  </Badge>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-600">Description</Label>
                  <p className="text-sm">{formData.description}</p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-600">Location</Label>
                  <p className="text-sm">{formData.location.address}</p>
                </div>
                
                {!formData.isAnonymous && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Contact Information</Label>
                    <p className="text-sm">
                      {formData.contactInfo.name} ({formData.contactInfo.email})
                      {formData.contactInfo.phone && ` - ${formData.contactInfo.phone}`}
                    </p>
                  </div>
                )}
                
                {formData.attachments.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Attachments</Label>
                    <p className="text-sm">{formData.attachments.length} file(s) uploaded</p>
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(2)}>
                  Previous
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="min-w-32"
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="sm" mr-2 />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Report
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
