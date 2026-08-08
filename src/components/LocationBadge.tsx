import { MapPin, Store } from 'lucide-react';

import { useTheme } from '@/context/ThemeContext';
import { useDeliveryLocation } from '@/context/LocationContext';

export function LocationBadge() {
  const { activeProduct } = useTheme();
  const {
    deliveryLocation,
    selectedBranch,
    openSelector,
  } = useDeliveryLocation();

  if (!deliveryLocation || !selectedBranch) return null;

  const active = activeProduct;

  return (
    <button
      type="button"
      onClick={openSelector}
      className="fixed left-3 z-[85] flex max-w-[calc(100vw-24px)] items-center gap-3 rounded-2xl border px-3.5 py-2.5 text-left shadow-2xl backdrop-blur-xl transition-all hover:-translate-y-0.5 sm:left-5 sm:px-4"
      style={{
        top: 'calc(var(--nav-h) + 10px)',
        background: `${active.bgColor}E8`,
        borderColor: `${active.accentColor}42`,
        color: active.textColor,
        boxShadow: '0 14px 45px rgba(0,0,0,.32)',
      }}
      aria-label="Change delivery location"
    >
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
        style={{
          background: active.accentColor,
          color: active.onAccent,
        }}
      >
        <MapPin size={17} />
      </span>

      <span className="min-w-0">
        <span className="block text-[9px] font-black uppercase tracking-[0.18em] opacity-45">
          Delivering to
        </span>
        <span className="block truncate text-xs font-black sm:text-sm">
          {deliveryLocation.areaName}
        </span>
        <span className="mt-0.5 flex items-center gap-1 truncate text-[9px] opacity-45 sm:text-[10px]">
          <Store size={10} />
          {selectedBranch.name} · tap to change
        </span>
      </span>
    </button>
  );
}
