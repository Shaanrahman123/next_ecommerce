import { cookies } from 'next/headers';
import dbConnect from './dbConnect';
import { verifyToken } from './jwt';
import User, { IUser } from '@/models/User';

export async function getAdminUser(): Promise<IUser | null> {
  try {
    await dbConnect();
    
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('accessToken');

    if (!tokenCookie || !tokenCookie.value) {
      return null;
    }

    const payload = verifyToken(tokenCookie.value);
    if (!payload || !payload.userId) {
      return null;
    }

    const user = await User.findById(payload.userId);
    if (!user || user.role !== 'admin') {
      return null;
    }

    return user;
  } catch (error) {
    console.error('[AUTH] Admin authorization helper failed:', error);
    return null;
  }
}
