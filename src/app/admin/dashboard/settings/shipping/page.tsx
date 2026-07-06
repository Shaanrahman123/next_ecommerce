import ShippingSettingsForm from '@/components/admin/settings/ShippingSettingsForm';

export default function AdminShippingSettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-1">Settings</p>
        <h1 className="text-2xl font-bold text-heading font-heading">Shipping & Delivery</h1>
        <p className="text-gray-500 mt-1">
          Set the free-shipping minimum and the fee charged on smaller orders. Changes apply to cart and checkout
          immediately.
        </p>
      </div>

      <ShippingSettingsForm />
    </div>
  );
}
