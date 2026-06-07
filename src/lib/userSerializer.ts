import { IUser } from '@/models/User';

export function serializeAddress(addr: IUser['addresses'][number]) {
  return {
    id: addr._id?.toString() ?? '',
    type: addr.type ?? 'Home',
    fullName: addr.fullName,
    addressLine1: addr.addressLine1,
    addressLine2: addr.addressLine2 ?? '',
    city: addr.city,
    state: addr.state,
    zipCode: addr.zipCode,
    country: addr.country,
    phone: addr.phone ?? '',
    isDefault: addr.isDefault ?? false,
  };
}

export function serializeUserProfile(user: IUser) {
  return {
    id: user._id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone ?? '',
    loginType: user.loginType,
    createdAt: user.createdAt,
    addresses: user.addresses.map(serializeAddress),
  };
}
