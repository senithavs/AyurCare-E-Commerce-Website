/**
 * Contact Form API
 * POST /api/contact - Save contact form submissions to database
 */

import dbConnect from '@/lib/mongodb';
import Contact from '@/lib/models/Contact';

export async function POST(request) {
  try {
    await dbConnect();

    const { name, email, phone, subject, message } = await request.json();

    // ========================================
    // VALIDATION
    // ========================================

    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Missing required fields: name, email, subject, message',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid email format',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // ========================================
    // CREATE CONTACT SUBMISSION
    // ========================================

    try {
      const newContact = new Contact({
        name: name.trim(),
        email: email.trim(),
        phone: phone?.trim() || '',
        subject: subject.trim(),
        message: message.trim(),
        status: 'new',
      });

      const savedContact = await newContact.save();

      console.log('✅ Contact submission saved:', {
        id: savedContact._id,
        email: savedContact.email,
        subject: savedContact.subject,
        createdAt: savedContact.createdAt,
      });

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Your message has been sent successfully! We will get back to you soon.',
          contactId: savedContact._id,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (dbErr) {
      console.error('❌ Database error saving contact:', dbErr);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to save your message. Please try again.',
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Contact API error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'An error occurred while processing your request.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function GET(request) {
  try {
    await dbConnect();

    // Get all contact submissions (admin only in production)
    const submissions = await Contact.find().sort({ createdAt: -1 }).lean();

    return new Response(
      JSON.stringify({
        success: true,
        count: submissions.length,
        submissions,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Failed to fetch contacts:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to fetch contact submissions',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
