import StoreSettings from '@/models/StoreSettings';
import { DEFAULT_SHIPPING_SETTINGS, ShippingSettings } from '@/types/storeSettings';

export async function getShippingSettings(): Promise<ShippingSettings> {
  let doc = await StoreSettings.findOne({ key: 'default' }).lean();

  if (!doc) {
    await StoreSettings.create({ key: 'default', ...DEFAULT_SHIPPING_SETTINGS });
    doc = await StoreSettings.findOne({ key: 'default' }).lean();
  }

  if (!doc) {
    return { ...DEFAULT_SHIPPING_SETTINGS };
  }

  return {
    shippingEnabled: doc.shippingEnabled ?? DEFAULT_SHIPPING_SETTINGS.shippingEnabled,
    freeShippingThreshold: doc.freeShippingThreshold ?? DEFAULT_SHIPPING_SETTINGS.freeShippingThreshold,
    shippingFee: doc.shippingFee ?? DEFAULT_SHIPPING_SETTINGS.shippingFee,
  };
}

export async function updateShippingSettings(payload: Partial<ShippingSettings>): Promise<ShippingSettings> {
  let doc = await StoreSettings.findOne({ key: 'default' });

  if (!doc) {
    doc = await StoreSettings.create({
      key: 'default',
      ...DEFAULT_SHIPPING_SETTINGS,
      ...payload,
    });
  } else {
    if (payload.shippingEnabled !== undefined) doc.shippingEnabled = payload.shippingEnabled;
    if (payload.freeShippingThreshold !== undefined) doc.freeShippingThreshold = payload.freeShippingThreshold;
    if (payload.shippingFee !== undefined) doc.shippingFee = payload.shippingFee;
    await doc.save();
  }

  return {
    shippingEnabled: doc.shippingEnabled,
    freeShippingThreshold: doc.freeShippingThreshold,
    shippingFee: doc.shippingFee,
  };
}
