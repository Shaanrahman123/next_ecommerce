import { NextRequest, NextResponse } from 'next/server';
import Ticket from '@/models/Ticket';
import { withAuth } from '@/lib/apiWrapper';
import { GLOBAL_MESSAGES } from '@/constants/messages';
import { IUser } from '@/models/User';
import type { TicketReplyPayload } from '@/types/ticket';

export const GET = withAuth(async (request: NextRequest, user: IUser, context: any) => {
  try {
    const params = await context.params;
    const ticket = await Ticket.findOne({ _id: params.id, user: user._id }).lean();

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
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});

export const POST = withAuth(async (request: NextRequest, user: IUser, context: any) => {
  try {
    const params = await context.params;
    const body = (await request.json()) as TicketReplyPayload;

    if (!body.message) {
      return NextResponse.json({ status: false, message: 'Message is required', statusCode: 400 }, { status: 400 });
    }

    const ticket = await Ticket.findOne({ _id: params.id, user: user._id });

    if (!ticket) {
      return NextResponse.json({ status: false, message: 'Ticket not found', statusCode: 404 }, { status: 404 });
    }
    
    if (ticket.status === 'closed') {
      return NextResponse.json({ status: false, message: 'Cannot reply to a closed ticket', statusCode: 400 }, { status: 400 });
    }

    ticket.messages.push({ sender: 'user', message: body.message } as any);
    if (ticket.status === 'resolved') {
      ticket.status = 'open'; // Re-open if user replies
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
