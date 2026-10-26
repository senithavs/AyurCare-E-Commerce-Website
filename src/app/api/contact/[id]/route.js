/**
 * Contact Details API
 * GET /api/contact/[id] - Get specific contact
 * PATCH /api/contact/[id] - Update contact status or notes
 */

import dbConnect from '@/lib/mongodb';
import Contact from '@/lib/models/Contact';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid contact ID' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const contact = await Contact.findById(id).lean();

    if (!contact) {
      return new Response(
        JSON.stringify({ success: false, error: 'Contact not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, contact }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching contact:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to fetch contact' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;
    const { status, notes } = await request.json();

    if (!ObjectId.isValid(id)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid contact ID' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate status if provided
    const validStatuses = ['new', 'read', 'replied', 'closed'];
    if (status && !validStatuses.includes(status)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid status value' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Build update object
    const updateData = { updatedAt: new Date() };
    if (status) {
      updateData.status = status;
    }
    if (notes !== undefined) {
      updateData.notes = notes.trim();
    }

    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).lean();

    if (!updatedContact) {
      return new Response(
        JSON.stringify({ success: false, error: 'Contact not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('✅ Contact updated:', {
      id: updatedContact._id,
      status: updatedContact.status,
      hasNotes: !!updatedContact.notes,
    });

    return new Response(
      JSON.stringify({ success: true, contact: updatedContact }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error updating contact:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to update contact' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
