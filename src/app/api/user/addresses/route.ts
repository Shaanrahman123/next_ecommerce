import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/apiWrapper';
import { serializeAddress, serializeUserProfile } from '@/lib/userSerializer';
import { AUTH_MESSAGES, GLOBAL_MESSAGES } from '@/constants/messages';
import { IUser } from '@/models/User';

export const GET = withAuth(async (_request: NextRequest, user: IUser) => {
  return NextResponse.json({
    status: true,
    message: 'Addresses fetched successfully',
    statusCode: 200,
    addresses: user.addresses.map(serializeAddress),
  });
});

export const POST = withAuth(async (request: NextRequest, user: IUser) => {
  try {
    const body = await request.json();
    const { type, fullName, addressLine1, addressLine2, city, state, zipCode, country, phone, isDefault } = body;

    if (!fullName?.trim() || !addressLine1?.trim() || !city?.trim() || !state?.trim() || !zipCode?.trim()) {
      return NextResponse.json(
        { status: false, message: 'Required address fields are missing', statusCode: 400 },
        { status: 400 }
      );
    }

    if (isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    const isFirstAddress = user.addresses.length === 0;

    user.addresses.push({
      type: type || 'Home',
      fullName: fullName.trim(),
      addressLine1: addressLine1.trim(),
      addressLine2: addressLine2?.trim() ?? '',
      city: city.trim(),
      state: state.trim(),
      zipCode: zipCode.trim(),
      country: country?.trim() || 'India',
      phone: phone?.trim() ?? '',
      isDefault: isDefault ?? isFirstAddress,
    });

    await user.save();

    const newAddress = user.addresses[user.addresses.length - 1];

    return NextResponse.json(
      {
        status: true,
        message: AUTH_MESSAGES.ADDRESS_ADDED,
        statusCode: 201,
        address: serializeAddress(newAddress),
        user: serializeUserProfile(user),
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : GLOBAL_MESSAGES.INTERNAL_SERVER_ERROR;
    return NextResponse.json({ status: false, message, statusCode: 500 }, { status: 500 });
  }
});
