'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Users,
  Shield,
  UserCheck,
  UserX,
  Mail,
  Loader2,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { adminUserService } from '@/services/adminUser.service';
import { AdminUser, AdminUserStats } from '@/types/adminUser';

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function RoleBadge({ role }: { role: 'user' | 'admin' }) {
  if (role === 'admin') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-violet-50 text-violet-700">
        <Shield className="w-3 h-3" /> Admin
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600">
      Customer
    </span>
  );
}

function VerifiedBadge({ verified }: { verified: boolean }) {
  return verified ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600">
      <UserCheck className="w-3 h-3" /> Verified
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-600">
      <UserX className="w-3 h-3" /> Pending
    </span>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  accent: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</p>
          <p className="text-3xl font-bold text-heading mt-2">{value.toLocaleString()}</p>
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${accent}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

export default function CustomersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<AdminUserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<'all' | 'user' | 'admin'>('all');
  const [verified, setVerified] = useState<'all' | 'true' | 'false'>('all');
  const [loginType, setLoginType] = useState<'all' | 'direct' | 'social'>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await adminUserService.list({
        page,
        limit: 12,
        search: search || undefined,
        role,
        verified,
        loginType,
      });
      setUsers(res.users);
      setStats(res.stats);
      setTotalPages(res.meta.totalPages);
      setTotalDocs(res.meta.totalDocs);
    } catch {
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, search, role, verified, loginType]);

  useEffect(() => {
    const timer = setTimeout(fetchUsers, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [fetchUsers, search]);

  useEffect(() => {
    setPage(1);
  }, [search, role, verified, loginType]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-heading tracking-tight">Customers</h1>
        <p className="text-gray-500 mt-1">
          All registered accounts — customers and administrators
        </p>
      </div>

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard label="Total Accounts" value={stats.total} icon={Users} accent="bg-gray-100 text-gray-600" />
          <StatCard label="Customers" value={stats.customers} icon={Users} accent="bg-blue-50 text-blue-600" />
          <StatCard label="Administrators" value={stats.admins} icon={Shield} accent="bg-violet-50 text-violet-600" />
          <StatCard label="Verified" value={stats.verified} icon={UserCheck} accent="bg-emerald-50 text-emerald-600" />
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="p-4 md:p-5 border-b border-gray-50 bg-gray-50/50 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
            <p className="text-sm text-gray-500 font-medium shrink-0">
              {totalDocs.toLocaleString()} account{totalDocs !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as typeof role)}
              className="px-3 py-2 bg-white border border-gray-100 rounded-xl text-sm font-medium outline-none cursor-pointer"
            >
              <option value="all">All Roles</option>
              <option value="user">Customers</option>
              <option value="admin">Admins</option>
            </select>
            <select
              value={verified}
              onChange={(e) => setVerified(e.target.value as typeof verified)}
              className="px-3 py-2 bg-white border border-gray-100 rounded-xl text-sm font-medium outline-none cursor-pointer"
            >
              <option value="all">All Verification</option>
              <option value="true">Verified</option>
              <option value="false">Unverified</option>
            </select>
            <select
              value={loginType}
              onChange={(e) => setLoginType(e.target.value as typeof loginType)}
              className="px-3 py-2 bg-white border border-gray-100 rounded-xl text-sm font-medium outline-none cursor-pointer"
            >
              <option value="all">All Login Types</option>
              <option value="direct">Email & Password</option>
              <option value="social">Social Login</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-24 space-y-2">
            <Users className="w-12 h-12 text-gray-200 mx-auto" />
            <p className="text-gray-500 font-medium">No accounts found</p>
            <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Member</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Login</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right"> </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50/60 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                          {user.avatar ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={user.avatar} alt="" className="w-full h-full rounded-xl object-cover" />
                          ) : (
                            getInitials(user.fullName)
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-heading">{user.fullName}</p>
                          <p className="text-xs text-gray-400 font-mono">ID: {user._id.slice(-8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        {user.email}
                      </div>
                      {user.phone && (
                        <p className="text-xs text-gray-400 mt-0.5 ml-5">{user.phone}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="px-6 py-4">
                      <VerifiedBadge verified={user.isVerified} />
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold text-gray-500 uppercase">
                        {user.loginType === 'social' ? 'Social' : 'Direct'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{formatDate(user.createdAt)}</td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/dashboard/customers/${user._id}`}
                        className="inline-flex items-center gap-1 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/5 rounded-xl transition-colors opacity-0 group-hover:opacity-100"
                      >
                        View <ChevronRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-50 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-4 py-2 border border-gray-100 rounded-xl text-sm font-medium disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-4 py-2 border border-gray-100 rounded-xl text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
        </div>
    );
}
