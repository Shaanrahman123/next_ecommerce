export interface ShippingSettings {
  shippingEnabled: boolean;
  freeShippingThreshold: number;
  shippingFee: number;
}

export const DEFAULT_SHIPPING_SETTINGS: ShippingSettings = {
  shippingEnabled: true,
  freeShippingThreshold: 999,
  shippingFee: 75,
};

export interface ShippingSettingsPayload {
  shippingEnabled?: boolean;
  freeShippingThreshold?: number;
  shippingFee?: number;
}
