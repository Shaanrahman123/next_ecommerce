export interface SerializedUserAddress {
  _id?: string;
  type?: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

export interface SerializedUser {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  loginType: string;
  isVerified: boolean;
  avatar?: string;
  gender?: string;
  dob?: string;
  role: 'user' | 'admin';
  addresses: SerializedUserAddress[];
  createdAt: string;
  updatedAt: string;
}

function toPlain<T extends Record<string, unknown>>(doc: T | { toObject?: () => T }): T {
  if (doc && typeof doc === 'object' && 'toObject' in doc && typeof doc.toObject === 'function') {
    return doc.toObject() as T;
  }
  return { ...doc } as T;
}

export function serializeUser(doc: Record<string, unknown>): SerializedUser {
  const plain = toPlain(doc);
  const firstName = String(plain.firstName || '');
  const lastName = String(plain.lastName || '');

  return {
    _id: String(plain._id),
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`.trim(),
    email: String(plain.email || ''),
    phone: plain.phone ? String(plain.phone) : undefined,
    loginType: String(plain.loginType || 'direct'),
    isVerified: Boolean(plain.isVerified),
    avatar: plain.avatar ? String(plain.avatar) : undefined,
    gender: plain.gender ? String(plain.gender) : undefined,
    dob: plain.dob ? new Date(plain.dob as string).toISOString() : undefined,
    role: (plain.role as 'user' | 'admin') || 'user',
    addresses: ((plain.addresses as SerializedUserAddress[]) || []).map((addr) => ({
      _id: addr._id ? String(addr._id) : undefined,
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
    })),
    createdAt: plain.createdAt
      ? new Date(plain.createdAt as string).toISOString()
      : new Date().toISOString(),
    updatedAt: plain.updatedAt
      ? new Date(plain.updatedAt as string).toISOString()
      : new Date().toISOString(),
  };
}

export function serializeUserList(docs: Record<string, unknown>[]) {
  return docs.map(serializeUser);
}

/** Profile shape for authenticated user APIs (storefront) */
export function serializeUserProfile(user: {
  _id?: { toString(): string } | string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  loginType?: string;
  createdAt?: Date | string;
  addresses?: Array<Record<string, unknown>>;
}) {
  return {
    id: String(user._id),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    loginType: user.loginType,
    createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : new Date().toISOString(),
    addresses: (user.addresses || []).map(serializeAddress),
  };
}

export function serializeAddress(addr: Record<string, unknown>) {
  return {
    id: addr._id ? String(addr._id) : undefined,
    type: addr.type ? String(addr.type) : undefined,
    fullName: String(addr.fullName || ''),
    addressLine1: String(addr.addressLine1 || ''),
    addressLine2: addr.addressLine2 ? String(addr.addressLine2) : undefined,
    city: String(addr.city || ''),
    state: String(addr.state || ''),
    zipCode: String(addr.zipCode || ''),
    country: String(addr.country || 'India'),
    phone: addr.phone ? String(addr.phone) : undefined,
    isDefault: Boolean(addr.isDefault),
  };
}
