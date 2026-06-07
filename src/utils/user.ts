import { UserProfile } from '@/types/user';
import { User, Address } from '@/types';

export function mapProfileToStoreUser(profile: UserProfile): User {
  return {
    id: profile.id,
    email: profile.email,
    name: `${profile.firstName} ${profile.lastName}`.trim(),
    createdAt: new Date(profile.createdAt),
    loginType: profile.loginType as User['loginType'],
  };
}

export function mapProfileAddresses(profile: UserProfile): Address[] {
  return profile.addresses.map((addr) => ({
    id: addr.id,
    type: addr.type,
    fullName: addr.fullName,
    addressLine1: addr.addressLine1,
    addressLine2: addr.addressLine2,
    city: addr.city,
    state: addr.state,
    zipCode: addr.zipCode,
    country: addr.country,
    phone: addr.phone,
    isDefault: addr.isDefault,
  }));
}
