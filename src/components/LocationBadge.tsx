import { useEffect, useRef, useState } from 'react';
import { MapPin, Store } from 'lucide-react';

import { useTheme } from '@/context/ThemeContext';
import { useDeliveryLocation } from '@/context/LocationContext';

const EXPANDED_DURATION_MS = 15_000;

export function LocationBadge() {
  const { activeProduct } = useTheme();
  const {
    deliveryLocation,
    selectedBranch,
    openSelector,
  } = useDeliveryLocation();
  const [expanded, setExpanded] = useState(false);
  const collapseTimer = useRef<number | null>(null);
  const previousSavedAt = useRef(deliveryLocation?.savedAt);

  const showTemporarily = () => {
    setExpanded(true);

    if (collapseTimer.current) {
      window.clearTimeout(collapseTimer.current);
    }

    collapseTimer.current = window.setTimeout(() => {
      setExpanded(false);
      collapseTimer.current = null;
    }, EXPANDED_DURATION_MS);
  };

  useEffect(() => {
    const savedAt = deliveryLocation?.savedAt;

    if (
      savedAt &&
      savedAt !== previousSavedAt.current
    ) {
      showTemporarily();
    }

    previousSavedAt.current = savedAt;
  }, [deliveryLocation?.savedAt]);

  useEffect(
    () => () => {
      if (collapseTimer.current) {
        window.clearTimeout(collapseTimer.current);
      }
    },
    [],
  );

  if (!deliveryLocation || !selectedBranch) return null;

  const active = activeProduct;

  const handleClick = () => {
    showTemporarily();
    openSelector();
  };

  const detailsClassName =
    'min-w-0 whitespace-nowrap pl-3 pr-4 transition-all duration-300 ' +
    (expanded
      ? 'visible translate-x-0 opacity-100'
      : 'invisible -translate-x-2 opacity-0 group-hover:visible group-hover:translate-x-0 group-hover:opacity-100');

  const iconClassName =
    'flex shrink-0 items-center justify-center transition-all duration-300 ' +
    (expanded
      ? 'ml-6 h-14 w-14 rounded-2xl'
      : 'ml-1.5 h-9 w-9 rounded-xl group-hover:ml-6 group-hover:h-14 group-hover:w-14 group-hover:rounded-2xl');

  return (
    <button
      type="button"
      onClick={handleClick}
      className="group fixed left-3 z-[85] flex max-w-[calc(100vw-24px)] items-center overflow-hidden rounded-3xl border text-left shadow-2xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 sm:left-5"
      style={{
        top: 'calc(var(--nav-h) + 10px)',
        width: expanded ? 'min(408px, calc(100vw - 24px))' : '48px',
        height: expanded ? '108px' : '48px',
        background: active.bgColor + 'E8',
        borderColor: active.accentColor + '42',
        color: active.textColor,
        boxShadow: '0 14px 45px rgba(0,0,0,.32)',
      }}
      aria-label="View or change delivery location"
      aria-expanded={expanded}
    >
      <span
        className={iconClassName}
        style={{
          background: active.accentColor,
          color: active.onAccent,
        }}
      >
        <MapPin size={17} />
      </span>

      <span className={detailsClassName}>
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

      <style>{`
        @media (hover: hover) and (pointer: fine) {
          .group:hover {
            width: min(408px, calc(100vw - 24px)) !important;
            height: 108px !important;
          }
        }
      `}</style>
    </button>
  );
}
