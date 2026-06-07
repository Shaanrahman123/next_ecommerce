import { AuthUser } from '@/types/auth';
import { User } from '@/types';

export function mapAuthUserToStoreUser(authUser: AuthUser): User {
  return {
    id: authUser.id,
    email: authUser.email,
    name: `${authUser.firstName} ${authUser.lastName}`.trim(),
    createdAt: authUser.createdAt ? new Date(authUser.createdAt) : new Date(),
    loginType: authUser.loginType,
  };
}

export function buildSocialPayload(provider: string) {
  return {
    email: `${provider}.user@example.com`,
    firstName: provider.charAt(0).toUpperCase() + provider.slice(1),
    lastName: 'User',
    loginType: 'social' as const,
  };
}
