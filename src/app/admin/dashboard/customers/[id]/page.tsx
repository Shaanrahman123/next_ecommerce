'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Shield,
  UserCheck,
  UserX,
  Loader2,
  Clock,
  Hash,
  Globe,
} from 'lucide-react';
import { adminUserService } from '@/services/adminUser.service';
import { AdminUser } from '@/types/adminUser';

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-gray-50 last:border-0 gap-1">
      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</span>
      <span className="text-sm font-semibold text-heading text-right sm:text-right">{value}</span>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/40">
        <h2 className="text-sm font-bold text-heading uppercase tracking-wide">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');

  const loadUser = () => {
    setIsLoading(true);
    adminUserService
      .getById(id)
      .then((res) => setUser(res.data || null))
      .catch((err) => setError(err.message || 'Failed to load user'))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadUser();
  }, [id]);

  const toggleVerified = async () => {
    if (!user) return;
    setIsUpdating(true);
    try {
      const res = await adminUserService.update(user._id, { isVerified: !user.isVerified });
      setUser(res.data || user);
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'message' in err ? String((err as { message: string }).message) : 'Update failed';
      alert(msg);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-red-500 font-medium">{error || 'User not found'}</p>
        <Link href="/admin/dashboard/customers" className="text-primary font-semibold hover:underline">
          ← Back to Customers
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/admin/dashboard/customers"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-heading transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Customers
        </Link>
        <button
          onClick={toggleVerified}
          disabled={isUpdating}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-60 ${
            user.isVerified
              ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              : 'bg-emerald-600 text-white hover:bg-emerald-700'
          }`}
        >
          {isUpdating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : user.isVerified ? (
            <UserX className="w-4 h-4" />
          ) : (
            <UserCheck className="w-4 h-4" />
          )}
          {user.isVerified ? 'Mark Unverified' : 'Mark Verified'}
        </button>
      </div>

      {/* Profile header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-primary text-on-primary flex items-center justify-center text-2xl font-bold shrink-0 shadow-lg shadow-primary/20">
            {user.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatar} alt="" className="w-full h-full rounded-2xl object-cover" />
            ) : (
              getInitials(user.fullName)
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-bold text-heading tracking-tight">{user.fullName}</h1>
              {user.role === 'admin' ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase bg-violet-100 text-violet-700">
                  <Shield className="w-3.5 h-3.5" /> Administrator
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-blue-100 text-blue-700">
                  Customer
                </span>
              )}
              {user.isVerified ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-100 text-emerald-700">
                  <UserCheck className="w-3.5 h-3.5" /> Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase bg-amber-100 text-amber-700">
                  <UserX className="w-3.5 h-3.5" /> Unverified
                </span>
              )}
            </div>
            <p className="text-gray-500 mt-2 flex items-center gap-2">
              <Mail className="w-4 h-4" /> {user.email}
            </p>
            {user.phone && (
              <p className="text-gray-500 mt-1 flex items-center gap-2">
                <Phone className="w-4 h-4" /> {user.phone}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="Personal Information">
          <DetailRow label="First Name" value={user.firstName} />
          <DetailRow label="Last Name" value={user.lastName} />
          <DetailRow
            label="Gender"
            value={user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : '—'}
          />
          <DetailRow
            label="Date of Birth"
            value={user.dob ? new Date(user.dob).toLocaleDateString('en-IN') : '—'}
          />
        </SectionCard>

        <SectionCard title="Account Details">
          <DetailRow
            label="Account ID"
            value={
              <span className="font-mono text-xs flex items-center gap-1 justify-end">
                <Hash className="w-3 h-3" /> {user._id}
              </span>
            }
          />
          <DetailRow label="Role" value={user.role === 'admin' ? 'Administrator' : 'Customer'} />
          <DetailRow
            label="Login Method"
            value={user.loginType === 'social' ? 'Social Login' : 'Email & Password'}
          />
          <DetailRow
            label="Verification"
            value={user.isVerified ? 'Verified' : 'Not Verified'}
          />
        </SectionCard>

        <SectionCard title="Timeline">
          <DetailRow
            label="Registered"
            value={
              <span className="flex items-center gap-1.5 justify-end">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                {formatDateTime(user.createdAt)}
              </span>
            }
          />
          <DetailRow
            label="Last Updated"
            value={
              <span className="flex items-center gap-1.5 justify-end">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                {formatDateTime(user.updatedAt)}
              </span>
            }
          />
        </SectionCard>

        <SectionCard title="Summary">
          <DetailRow label="Saved Addresses" value={user.addresses.length} />
          <DetailRow
            label="Account Age"
            value={`${Math.max(0, Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)))} days`}
          />
        </SectionCard>
      </div>

      {/* Addresses */}
      <SectionCard title={`Saved Addresses (${user.addresses.length})`}>
        {user.addresses.length === 0 ? (
          <p className="text-sm text-gray-400 italic text-center py-6">No saved addresses</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.addresses.map((addr, i) => (
              <div
                key={addr._id || i}
                className={`p-5 rounded-xl border ${
                  addr.isDefault ? 'border-primary/30 bg-primary/5' : 'border-gray-100 bg-gray-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-gray-400 uppercase">{addr.type || 'Address'}</span>
                  {addr.isDefault && (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-primary text-on-primary px-2 py-0.5 rounded-full">
                      Default
                    </span>
                  )}
                </div>
                <p className="font-semibold text-heading">{addr.fullName}</p>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                  {addr.addressLine1}
                  {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}
                  <br />
                  {addr.city}, {addr.state} {addr.zipCode}
                </p>
                <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Globe className="w-3 h-3" /> {addr.country}
                  </span>
                  {addr.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {addr.phone}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {addr.city}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
