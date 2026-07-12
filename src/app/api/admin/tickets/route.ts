import { NextRequest, NextResponse } from 'next/server';
import Ticket from '@/models/Ticket';
import { withAdmin } from '@/lib/apiWrapper';
import { GLOBAL_MESSAGES } from '@/constants/messages';

export const GET = withAdmin(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const query: any = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const tickets = await Ticket.find(query)
      .populate('user', 'firstName lastName email')
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
        user: t.user,
      })),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});
