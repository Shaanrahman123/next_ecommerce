import { NextRequest, NextResponse } from 'next/server';
import Ticket from '@/models/Ticket';
import { withAuth } from '@/lib/apiWrapper';
import { GLOBAL_MESSAGES } from '@/constants/messages';
import { IUser } from '@/models/User';
import type { CreateTicketPayload } from '@/types/ticket';

export const GET = withAuth(async (_request: NextRequest, user: IUser) => {
  try {
    const tickets = await Ticket.find({ user: user._id })
      .sort({ updatedAt: -1 })
      .lean();

    return NextResponse.json({
      status: true,
      message: 'Tickets fetched',
      statusCode: 200,
      data: tickets.map((t: any) => ({
        _id: t._id,
        orderId: t.orderId,
        subject: t.subject,
        category: t.category,
        status: t.status,
        priority: t.priority,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
        messageCount: t.messages?.length || 0,
      })),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});

export const POST = withAuth(async (request: NextRequest, user: IUser) => {
  try {
    const body = (await request.json()) as CreateTicketPayload;

    if (!body.subject || !body.category || !body.message) {
      return NextResponse.json({ status: false, message: 'Missing required fields', statusCode: 400 }, { status: 400 });
    }

    const ticket = await Ticket.create({
      user: user._id,
      orderId: body.orderId,
      subject: body.subject,
      category: body.category,
      messages: [{ sender: 'user', message: body.message }],
    });

    return NextResponse.json(
      {
        status: true,
        message: 'Ticket created successfully',
        statusCode: 201,
        data: {
          _id: ticket._id,
          orderId: ticket.orderId,
          subject: ticket.subject,
          category: ticket.category,
          status: ticket.status,
          priority: ticket.priority,
          createdAt: ticket.createdAt,
          updatedAt: ticket.updatedAt,
          messageCount: ticket.messages.length,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});
