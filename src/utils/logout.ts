import { authService } from '@/services/auth.service';

export async function performLogout(
  clearUser: () => void,
  redirect?: () => void,
  clearAddresses?: () => void
) {
  try {
    await authService.logout();
  } catch {
    // Always clear local session even if the API call fails
  } finally {
    clearUser();
    clearAddresses?.();
    redirect?.();
  }
}
