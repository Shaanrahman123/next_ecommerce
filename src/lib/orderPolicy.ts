import type { OrderStatus, ReturnStatus } from '@/types/order';

/** Indian e-commerce pattern: cancel anytime before delivery (Flipkart/Myntra/Amazon India) */
export const CANCELLABLE_STATUSES: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped'];

export function canCancelOrder(status: OrderStatus, returnStatus?: ReturnStatus): boolean {
  if (returnStatus && returnStatus !== 'none') return false;
  return CANCELLABLE_STATUSES.includes(status);
}

export function getMinReturnDays(items: { returnDays?: number; isReturnable?: boolean }[]): number {
  const days = items
    .filter((i) => i.isReturnable !== false)
    .map((i) => i.returnDays ?? 10)
    .filter((d) => d > 0);
  return days.length ? Math.min(...days) : 0;
}

export function getReturnDeadline(deliveredAt: string | Date | undefined, returnDays: number): Date | null {
  if (!deliveredAt || returnDays <= 0) return null;
  const start = new Date(deliveredAt);
  if (Number.isNaN(start.getTime())) return null;
  const deadline = new Date(start);
  deadline.setDate(deadline.getDate() + returnDays);
  return deadline;
}

export function canReturnOrder(
  status: OrderStatus,
  returnStatus: ReturnStatus | undefined,
  deliveredAt: string | Date | undefined,
  returnDays: number,
  isReturnable = true
): boolean {
  if (!isReturnable || returnDays <= 0) return false;
  if (status !== 'delivered') return false;
  if (returnStatus && returnStatus !== 'none') return false;
  const deadline = getReturnDeadline(deliveredAt, returnDays);
  if (!deadline) return false;
  return new Date() <= deadline;
}

export function getDaysLeftForReturn(deliveredAt: string | Date | undefined, returnDays: number): number {
  const deadline = getReturnDeadline(deliveredAt, returnDays);
  if (!deadline) return 0;
  const diff = deadline.getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function formatRelativeDate(date: string | Date): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function getStatusLabel(status: OrderStatus, returnStatus?: ReturnStatus): string {
  if (returnStatus === 'requested') return 'Return Requested';
  if (returnStatus === 'approved') return 'Return Approved';
  if (returnStatus === 'completed') return 'Returned';
  if (returnStatus === 'rejected') return 'Return Rejected';

  const labels: Record<OrderStatus, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  };
  return labels[status] || status;
}
