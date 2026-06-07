import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/apiWrapper';
import { serializeAddress, serializeUserProfile } from '@/lib/userSerializer';
import { AUTH_MESSAGES, GLOBAL_MESSAGES } from '@/constants/messages';
import { IUser } from '@/models/User';

type RouteContext = { params: Promise<{ id: string }> };

export const PATCH = withAuth(async (request: NextRequest, user: IUser, context: RouteContext) => {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const address = user.addresses.find((addr) => addr._id?.toString() === id);
    if (!address) {
      return NextResponse.json(
        { status: false, message: AUTH_MESSAGES.ADDRESS_NOT_FOUND, statusCode: 404 },
        { status: 404 }
      );
    }

    const fields = ['type', 'fullName', 'addressLine1', 'addressLine2', 'city', 'state', 'zipCode', 'country', 'phone'] as const;
    fields.forEach((field) => {
      if (body[field] !== undefined) {
        (address as Record<string, unknown>)[field] = typeof body[field] === 'string' ? body[field].trim() : body[field];
      }
    });

    if (body.isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = addr._id?.toString() === id;
      });
    }

    await user.save();

    return NextResponse.json({
      status: true,
      message: AUTH_MESSAGES.ADDRESS_UPDATED,
      statusCode: 200,
      address: serializeAddress(address),
      user: serializeUserProfile(user),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});

export const DELETE = withAuth(async (_request: NextRequest, user: IUser, context: RouteContext) => {
  try {
    const { id } = await context.params;
    const index = user.addresses.findIndex((addr) => addr._id?.toString() === id);

    if (index === -1) {
      return NextResponse.json(
        { status: false, message: AUTH_MESSAGES.ADDRESS_NOT_FOUND, statusCode: 404 },
        { status: 404 }
      );
    }

    const wasDefault = user.addresses[index].isDefault;
    user.addresses.splice(index, 1);

    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    return NextResponse.json({
      status: true,
      message: AUTH_MESSAGES.ADDRESS_DELETED,
      statusCode: 200,
      user: serializeUserProfile(user),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});
