'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { LoadingSpinner } from '@/components/ui/loading-spinner';
interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  organisation: string;
  role: string;
  interest: string;
  message: string;
}

interface ContactFormProps {
  className?: string;
}

/**
 * Contact form component with validation and submission handling
 * Follows Australian English conventions and accessibility standards
 * @component ContactForm
 * @example
 * ```tsx
 * <ContactForm />
 * ```
 * @accessibility
 * - ARIA labels: All form fields have proper labels
 * - Keyboard navigation: Full keyboard support
 * - Screen reader: Announces form state and validation messages
 */
export function ContactForm({ className }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    organisation: '',
    role: '',
    interest: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus('success');
        toast.success('Message sent successfully!', {
          description: 'We\'ll get back to you within 24 hours.',
        });
        
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          organisation: '',
          role: '',
          interest: '',
          message: '',
        });
      } else {
        setSubmitStatus('error');
        toast.error('Failed to send message', {
          description: result.message || 'Please try again later.',
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      toast.error('Network error', {
        description: 'Please check your connection and try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.firstName && formData.lastName && formData.email && 
                     formData.organisation && formData.interest && formData.message;

  if (submitStatus === 'success') {
    return (
      <div className={`text-center py-8 ${className}`}>
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Message Sent Successfully!</h3>
        
        <Button 
          onClick={() => setSubmitStatus('idle')}
          variant="outline"
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium mb-2">
            First Name *
          </label>
          <Input
            id="firstName"
            name="firstName"
            type="text"
            required
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="Your first name"
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium mb-2">
            Last Name *
          </label>
          <Input
            id="lastName"
            name="lastName"
            type="text"
            required
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="Your last name"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Email Address *
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleInputChange}
          placeholder="your.email@council.gov.au"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label htmlFor="organisation" className="block text-sm font-medium mb-2">
          Organisation *
        </label>
        <Input
          id="organisation"
          name="organisation"
          type="text"
          required
          value={formData.organisation}
          onChange={handleInputChange}
          placeholder="Your council or organisation"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium mb-2">
          Role
        </label>
        <Input
          id="role"
          name="role"
          type="text"
          value={formData.role}
          onChange={handleInputChange}
          placeholder="Asset Manager, Director, etc."
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label htmlFor="interest" className="block text-sm font-medium mb-2">
          What are you most interested in? *
        </label>
        <select
          id="interest"
          name="interest"
          required
          value={formData.interest}
          onChange={handleInputChange}
          disabled={isSubmitting}
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
        >
          <option value="">Select an option</option>
          <option value="pilot-partnership">Pilot Partnership</option>
          <option value="discovery-call">Discovery Call</option>
          <option value="aegrid-rules">Learning about the Aegrid Rules</option>
          <option value="consultation">Asset Management Consultation</option>
          <option value="demo">Product Demonstration</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-2">
          Message *
        </label>
        <Textarea
          id="message"
          name="message"
          required
          rows={5}
          value={formData.message}
          onChange={handleInputChange}
          placeholder="Tell us about your current asset management challenges, goals, and how we can help..."
          className="min-h-[120px]"
          disabled={isSubmitting}
        />
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={isSubmitting || !isFormValid}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="h-4 w-4 mr-2" />
            Send Message
          </>
        )}
      </Button>

      {submitStatus === 'error' && (
        <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
          <AlertCircle className="h-4 w-4" />
          <span>Failed to send message. Please try again.</span>
        </div>
      )}

      
    </form>
  );
}
