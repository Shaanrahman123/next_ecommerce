'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Loader2, Save, Truck } from 'lucide-react';
import { settingsService } from '@/services/settings.service';
import type { ShippingSettings } from '@/types/storeSettings';
import { DEFAULT_SHIPPING_SETTINGS, formatINR } from '@/lib/shippingUtils';
import AlertModal from '@/components/ui/AlertModal';

export default function ShippingSettingsForm() {
  const [settings, setSettings] = useState<ShippingSettings>(DEFAULT_SHIPPING_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ title: string; message: string; variant?: 'success' | 'warning' } | null>(
    null
  );

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const res = await settingsService.getAdminShippingSettings();
      if (res.data) setSettings(res.data);
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: string }).message)
          : 'Failed to load shipping settings';
      setLoadError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await settingsService.updateShippingSettings(settings);
      if (res.data) setSettings(res.data);
      setLoadError(null);
      setAlert({ title: 'Saved', message: 'Shipping settings updated successfully.', variant: 'success' });
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: string }).message)
          : 'Failed to save settings';
      setAlert({ title: 'Error', message: msg, variant: 'warning' });
    } finally {
      setIsSaving(false);
    }
  };

  const previewText = settings.shippingEnabled
    ? `Orders of ${formatINR(settings.freeShippingThreshold)} or more get free shipping. Below that, a ${formatINR(settings.shippingFee)} shipping fee applies.`
    : 'Shipping charges are currently disabled — all orders ship free.';

  return (
    <>
      {loadError && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {loadError}. Showing default values — save to apply or refresh after logging in.
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-50 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/60">
            <Truck className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <h2 className="font-bold text-heading text-lg">Shipping Fee Rules</h2>
            <p className="text-sm text-gray-500">
              Control free-shipping threshold and delivery charge on cart & checkout
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="p-6 space-y-6">
            <label className="flex items-center justify-between gap-4 cursor-pointer rounded-xl border border-gray-100 p-4 hover:bg-gray-50/50 transition-colors">
              <div>
                <p className="font-semibold text-heading text-sm">Enable shipping charges</p>
                <p className="text-xs text-gray-500 mt-0.5">When off, shipping is always free for customers</p>
              </div>
              <input
                type="checkbox"
                checked={settings.shippingEnabled}
                onChange={(e) => setSettings((s) => ({ ...s, shippingEnabled: e.target.checked }))}
                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary shrink-0"
              />
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl border border-gray-100 p-5 space-y-2 bg-gray-50/30">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Free shipping above (₹)
                </label>
                <p className="text-xs text-gray-400">Order subtotal at or above this amount ships free</p>
                <input
                  type="number"
                  min={0}
                  disabled={!settings.shippingEnabled}
                  value={settings.freeShippingThreshold}
                  onChange={(e) =>
                    setSettings((s) => ({
                      ...s,
                      freeShippingThreshold: Math.max(0, parseInt(e.target.value, 10) || 0),
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base font-semibold text-heading focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none disabled:opacity-50 bg-white"
                  placeholder="e.g. 999"
                />
              </div>

              <div className="rounded-xl border border-gray-100 p-5 space-y-2 bg-gray-50/30">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Shipping fee below threshold (₹)
                </label>
                <p className="text-xs text-gray-400">Charged when order is below the free-shipping amount</p>
                <input
                  type="number"
                  min={0}
                  disabled={!settings.shippingEnabled}
                  value={settings.shippingFee}
                  onChange={(e) =>
                    setSettings((s) => ({
                      ...s,
                      shippingFee: Math.max(0, parseInt(e.target.value, 10) || 0),
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base font-semibold text-heading focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none disabled:opacity-50 bg-white"
                  placeholder="e.g. 75"
                />
              </div>
            </div>

            <div className="rounded-xl bg-amber-50/80 border border-amber-200/60 px-4 py-4">
              <p className="text-xs font-semibold text-amber-900/80 uppercase tracking-wider mb-1.5">
                Live preview (checkout)
              </p>
              <p className="text-sm text-amber-950/80 leading-relaxed">{previewText}</p>
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-on-primary rounded-xl text-sm font-semibold hover:bg-primary-hover transition-all disabled:opacity-50 shadow-lg shadow-black/5"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Shipping Settings
            </button>
          </div>
        )}
      </div>

      <AlertModal
        isOpen={!!alert}
        title={alert?.title || ''}
        message={alert?.message || ''}
        variant={alert?.variant === 'success' ? 'success' : 'warning'}
        onClose={() => setAlert(null)}
      />
    </>
  );
}
