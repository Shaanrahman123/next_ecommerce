'use client';

import { Check } from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Address' },
  { id: 2, label: 'Order Summary' },
  { id: 3, label: 'Payment' },
];

export default function CheckoutStepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="relative w-full">
      <div className="absolute top-4 left-0 w-full h-px bg-amber-200/60 z-0" />
      <div
        className="absolute top-4 left-0 h-px bg-linear-to-r from-amber-600 to-rose-600 z-0 transition-all duration-500"
        style={{ width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%' }}
      />

      <div className="flex justify-between w-full relative z-10">
        {STEPS.map((step, idx) => (
          <div
            key={step.id}
            className={`flex flex-col ${
              idx === 0 ? 'items-start' : idx === STEPS.length - 1 ? 'items-end' : 'items-center'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${
                currentStep >= step.id
                  ? 'bg-linear-to-br from-[#1a1209] via-heading to-[#1a1209] text-amber-50 ring-2 ring-amber-400/40'
                  : 'bg-white border-2 border-amber-200/80 text-amber-300'
              }`}
            >
              {currentStep > step.id ? <Check className="w-4 h-4" strokeWidth={3} /> : step.id}
            </div>
            <span
              className={`text-[10px] mt-2 font-bold uppercase tracking-tight ${
                currentStep === step.id ? 'text-heading' : 'text-gray-400'
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
