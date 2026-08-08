import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, LocateFixed, MapPin } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import { useTheme } from '@/context/ThemeContext';
import { useDeliveryLocation } from '@/context/LocationContext';
import { findNearestDeliveryBranch } from '@/data/branches';

interface AutoLocationResolverProps {
  enabled: boolean;
}

type ResolverNotice =
  | { type: 'success'; title: string; detail: string }
  | { type: 'outside'; title: string; detail: string }
  | null;

const MAX_DELIVERY_DISTANCE_KM = 35;

export function AutoLocationResolver({ enabled }: AutoLocationResolverProps) {
  const { activeProduct } = useTheme();
  const {
    hasLocation,
    saveGPSLocation,
    openSelector,
  } = useDeliveryLocation();

  const attempted = useRef(false);
  const [notice, setNotice] = useState<ResolverNotice>(null);

  useEffect(() => {
    if (!enabled || hasLocation || attempted.current) return;
    attempted.current = true;

    if (!('geolocation' in navigator)) {
      openSelector();
      return;
    }

    let cancelled = false;

    const useManualFallback = () => {
      if (!cancelled) openSelector();
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (cancelled) return;

        const { latitude, longitude, accuracy } = position.coords;
        const nearest = findNearestDeliveryBranch(latitude, longitude);

        if (!nearest) {
          useManualFallback();
          return;
        }

        // A browser may return a perfectly valid GPS position outside Peshawar.
        // Do not silently route a remote user to a Peshawar branch for delivery.
        if (nearest.distanceKm > MAX_DELIVERY_DISTANCE_KM) {
          setNotice({
            type: 'outside',
            title: 'You seem to be outside our delivery zone',
            detail:
              'Choose a Peshawar delivery area manually if you are ordering for an address inside the city.',
          });

          window.setTimeout(() => {
            if (!cancelled) openSelector();
          }, 900);
          return;
        }

        saveGPSLocation({
          latitude,
          longitude,
          accuracyMeters: accuracy,
          branch: nearest.branch,
          distanceToBranchKm: nearest.distanceKm,
        });

        setNotice({
          type: 'success',
          title: 'Live location locked',
          detail: `${nearest.branch.name} is the nearest MFZ branch · ${nearest.distanceKm.toFixed(1)} km away`,
        });

        window.setTimeout(() => setNotice(null), 4500);
      },
      (error) => {
        if (cancelled) return;

        // PERMISSION_DENIED, POSITION_UNAVAILABLE and TIMEOUT all fall back to
        // the themed 3-step manual selector. The browser itself owns the native
        // Allow/Block permission prompt.
        console.info('MFZ geolocation fallback:', error.code, error.message);
        useManualFallback();
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0,
      },
    );

    return () => {
      cancelled = true;
    };
  }, [enabled, hasLocation, openSelector, saveGPSLocation]);

  return (
    <AnimatePresence>
      {notice && (
        <motion.div
          initial={{ opacity: 0, y: -18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.985 }}
          className="fixed left-3 right-3 top-3 z-[420] mx-auto max-w-[520px] rounded-2xl border p-4 shadow-2xl sm:left-auto sm:right-5 sm:top-5 sm:w-[430px]"
          style={{
            background: `linear-gradient(145deg, ${activeProduct.bgColor}F5, ${activeProduct.dominantColor}DD)`,
            borderColor: `${activeProduct.accentColor}55`,
            color: activeProduct.textColor,
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
              style={{
                background: `${activeProduct.accentColor}18`,
                color: activeProduct.accentColor,
              }}
            >
              {notice.type === 'success' ? (
                <CheckCircle2 size={22} />
              ) : (
                <MapPin size={22} />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <LocateFixed size={14} style={{ color: activeProduct.accentColor }} />
                <span className="text-[10px] font-black uppercase tracking-[0.22em] opacity-55">
                  MFZ Location
                </span>
              </div>
              <div className="mt-1 text-base font-black">{notice.title}</div>
              <div className="mt-1 text-xs leading-5 opacity-60 sm:text-sm">
                {notice.detail}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
