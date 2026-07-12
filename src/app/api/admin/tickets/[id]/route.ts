import { NextRequest, NextResponse } from 'next/server';
import Ticket from '@/models/Ticket';
import { withAdmin } from '@/lib/apiWrapper';
import { GLOBAL_MESSAGES } from '@/constants/messages';
import { IUser } from '@/models/User';

export const GET = withAdmin(async (request: NextRequest, admin: IUser, context: any) => {
  try {
    const params = await context.params;
    console.log('[DEBUG GET TICKET]', params.id);
    const ticket = await Ticket.findById(params.id).populate('user', 'firstName lastName email').lean();

    if (!ticket) {
      return NextResponse.json({ status: false, message: 'Ticket not found', statusCode: 404 }, { status: 404 });
    }

    return NextResponse.json({
      status: true,
      message: 'Ticket details fetched',
      statusCode: 200,
      data: {
        _id: ticket._id,
        orderId: ticket.orderId,
        subject: ticket.subject,
        category: ticket.category,
        status: ticket.status,
        priority: ticket.priority,
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt,
        messageCount: ticket.messages?.length || 0,
        messages: ticket.messages,
        user: (ticket as any).user,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});

export const PUT = withAdmin(async (request: NextRequest, admin: IUser, context: any) => {
  try {
    const params = await context.params;
    const body = await request.json();
    const updateData: any = {};
    if (body.status) updateData.status = body.status;
    if (body.priority) updateData.priority = body.priority;

    const ticket = await Ticket.findByIdAndUpdate(params.id, updateData, { new: true });

    if (!ticket) {
      return NextResponse.json({ status: false, message: 'Ticket not found', statusCode: 404 }, { status: 404 });
    }

    return NextResponse.json({
      status: true,
      message: 'Ticket updated successfully',
      statusCode: 200,
      data: ticket,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});

export const POST = withAdmin(async (request: NextRequest, admin: IUser, context: any) => {
  try {
    const params = await context.params;
    const body = await request.json();

    if (!body.message) {
      return NextResponse.json({ status: false, message: 'Message is required', statusCode: 400 }, { status: 400 });
    }

    const ticket = await Ticket.findById(params.id);

    if (!ticket) {
      return NextResponse.json({ status: false, message: 'Ticket not found', statusCode: 404 }, { status: 404 });
    }

    ticket.messages.push({ sender: 'admin', message: body.message, senderId: admin._id } as any);
    
    // Auto-resolve or mark in-progress when admin replies, if it was open
    if (ticket.status === 'open') {
        ticket.status = 'in-progress';
    }

    await ticket.save();

    return NextResponse.json({
      status: true,
      message: 'Reply sent successfully',
      statusCode: 201,
      data: ticket.messages[ticket.messages.length - 1],
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});
