import { NextRequest, NextResponse } from 'next/server';
import Order from '@/models/Order';
import Ticket from '@/models/Ticket';
import User from '@/models/User';
import { withAdmin } from '@/lib/apiWrapper';
import { GLOBAL_MESSAGES } from '@/constants/messages';
import { IUser } from '@/models/User';

export const dynamic = 'force-dynamic';

export const GET = withAdmin(async (request: NextRequest, admin: IUser) => {
  try {
    const lastCheckedOrdersAt = admin.lastCheckedOrdersAt || new Date(0);
    const lastCheckedTicketsAt = admin.lastCheckedTicketsAt || new Date(0);

    const newOrdersCount = await Order.countDocuments({ createdAt: { $gt: lastCheckedOrdersAt } });
    const cancelledOrdersCount = await Order.countDocuments({ status: 'cancelled', updatedAt: { $gt: lastCheckedOrdersAt } });
    const newTicketsCount = await Ticket.countDocuments({ updatedAt: { $gt: lastCheckedTicketsAt }, 'messages.sender': 'user' });

    return NextResponse.json({
      status: true,
      message: 'Notifications fetched',
      statusCode: 200,
      data: {
        newOrders: newOrdersCount,
        cancelledOrders: cancelledOrdersCount,
        newTickets: newTicketsCount,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});

export const POST = withAdmin(async (request: NextRequest, admin: IUser) => {
  try {
    const body = await request.json();
    
    if (body.type === 'orders') {
      await User.collection.updateOne({ _id: admin._id }, { $set: { lastCheckedOrdersAt: new Date() } });
    } else if (body.type === 'tickets') {
      await User.collection.updateOne({ _id: admin._id }, { $set: { lastCheckedTicketsAt: new Date() } });
    }

    return NextResponse.json({
      status: true,
      message: 'Notifications marked as read',
      statusCode: 200,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});
