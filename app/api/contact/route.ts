import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Contact form validation schema
const contactFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  organisation: z.string().min(1, 'Organisation is required'),
  role: z.string().optional(),
  interest: z.string().min(1, 'Interest selection is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the form data
    const validatedData = contactFormSchema.parse(body);
    
    // In a real implementation, you would:
    // 1. Send an email notification to Dale
    // 2. Store the inquiry in a database
    // 3. Send an auto-reply to the user
    // 4. Integrate with CRM systems
    
    // For now, we'll just log the data and return a success response
    console.log('Contact form submission:', validatedData);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Thank you for your inquiry. We\'ll get back to you within 24 hours.' 
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Contact form error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Please check your form data and try again.',
          errors: error.errors 
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'An error occurred while processing your request. Please try again later.' 
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
