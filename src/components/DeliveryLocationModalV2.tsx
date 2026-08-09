import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  LocateFixed,
  MapPin,
  Search,
  Store,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import { useTheme } from '@/context/ThemeContext';
import { useDeliveryLocation } from '@/context/LocationContext';
import {
  deliveryAreas,
  getDeliveryAreaById,
  type DeliveryArea,
} from '@/data/deliveryAreas';
import {
  branches,
  findNearestDeliveryBranch,
} from '@/data/branches';

interface Props {
  enabled: boolean;
}

export function DeliveryLocationModalV2({ enabled }: Props) {
  const { activeProduct: active } = useTheme();
  const {
    deliveryLocation,
    selectorOpen,
    closeSelector,
    saveLocation,
    saveGPSLocation,
  } = useDeliveryLocation();

  const [step, setStep] = useState(1);
  const [query, setQuery] = useState('');
  const [areaId, setAreaId] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [landmark, setLandmark] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [gpsBusy, setGpsBusy] = useState(false);
  const [gpsError, setGpsError] = useState('');

  useEffect(() => {
    if (!selectorOpen) return;
    setStep(1);
    setQuery('');
    setAreaId(deliveryLocation?.source === 'manual' ? deliveryLocation.areaId : '');
    setAddressLine(deliveryLocation?.source === 'manual' ? deliveryLocation.addressLine : '');
    setLandmark(deliveryLocation?.landmark ?? '');
    setDeliveryNotes(deliveryLocation?.deliveryNotes ?? '');
    setGpsError('');
  }, [deliveryLocation, selectorOpen]);

  useEffect(() => {
    if (!enabled || !selectorOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [enabled, selectorOpen]);

  const filteredAreas = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return deliveryAreas;
    return deliveryAreas.filter((area) =>
      [area.name, area.zone, ...area.keywords]
        .join(' ')
        .toLowerCase()
        .includes(normalized),
    );
  }, [query]);

  const selectedArea = areaId ? getDeliveryAreaById(areaId) ?? null : null;
  const selectedBranch = selectedArea
    ? branches.find((branch) => branch.id === selectedArea.branchId) ?? null
    : null;

  const canClose = Boolean(deliveryLocation);

  const tryLiveLocation = () => {
    setGpsError('');

    if (!navigator.geolocation) {
      setGpsError('Live location is not supported in this browser. Please choose your area manually.');
      return;
    }

    setGpsBusy(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const nearest = findNearestDeliveryBranch(latitude, longitude);

        if (!nearest || nearest.distanceKm > 35) {
          setGpsBusy(false);
          setGpsError('This live pin looks outside the MFZ Peshawar delivery zone. Please choose the delivery area manually.');
          return;
        }

        saveGPSLocation({
          latitude,
          longitude,
          accuracyMeters: accuracy,
          branch: nearest.branch,
          distanceToBranchKm: nearest.distanceKm,
        });
        setGpsBusy(false);
      },
      () => {
        setGpsBusy(false);
        setGpsError('Location access is blocked or unavailable. You can continue with the 3-step manual location below.');
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 },
    );
  };

  const saveManual = () => {
    if (!selectedArea || !addressLine.trim()) return;
    saveLocation({ area: selectedArea, addressLine, landmark, deliveryNotes });
  };

  const progress = `${(step / 3) * 100}%`;

  return (
    <AnimatePresence>
      {enabled && selectorOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[360] flex items-end justify-center overflow-hidden px-2 pb-[max(34px,env(safe-area-inset-bottom))] pt-2 sm:items-center sm:p-5"
          style={{
            background: 'rgba(8,5,4,.72)',
            backdropFilter: 'blur(20px) saturate(.72)',
            WebkitBackdropFilter: 'blur(20px) saturate(.72)',
          }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && canClose) closeSelector();
          }}
        >
          <motion.section
            initial={{ y: 48, opacity: 0, scale: 0.99 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.99 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            className="relative flex max-h-[calc(100svh-44px)] w-full max-w-[760px] flex-col overflow-hidden rounded-[28px] border shadow-2xl sm:max-h-[88svh] sm:rounded-[32px]"
            style={{
              background: `linear-gradient(145deg, ${active.bgColor}FA, ${active.dominantColor}F2)`,
              borderColor: `${active.accentColor}45`,
              color: active.textColor,
              boxShadow: `0 35px 120px rgba(0,0,0,.62), 0 0 60px ${active.accentColor}12`,
            }}
          >
            <div className="h-1 shrink-0" style={{ background: `${active.textColor}10` }}>
              <motion.div animate={{ width: progress }} className="h-full" style={{ background: active.accentColor }} />
            </div>

            <div className="overflow-y-auto px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-5 sm:px-8 sm:pb-8 sm:pt-7">
              <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/20 sm:hidden" />

              <div className="mb-5 flex items-start justify-between gap-4 sm:mb-7">
                <div className="min-w-0">
                  <div className="text-[9px] font-black uppercase tracking-[0.28em] sm:text-[10px]" style={{ color: active.accentColor }}>
                    MFZ Delivery Setup · {step}/3
                  </div>
                  <h2 className="mt-2 text-[2rem] font-black leading-[.98] sm:text-5xl" style={{ fontFamily: 'Anton, sans-serif' }}>
                    {step === 1 && 'Where should we deliver?'}
                    {step === 2 && 'Choose your area.'}
                    {step === 3 && 'Confirm the exact spot.'}
                  </h2>
                  <p className="mt-2 max-w-xl text-xs leading-5 opacity-60 sm:mt-3 sm:text-sm sm:leading-6">
                    {step === 1 && 'Use live GPS for the safest delivery pin, or continue manually if location access is unavailable.'}
                    {step === 2 && 'Search your neighbourhood. MFZ will automatically assign the nearest serving branch.'}
                    {step === 3 && 'Add the final address details once and we will remember them for future orders.'}
                  </p>
                </div>

                {canClose && (
                  <button
                    type="button"
                    aria-label="Close location selector"
                    onClick={closeSelector}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition hover:scale-105"
                    style={{ borderColor: `${active.textColor}20` }}
                  >
                    <X size={17} />
                  </button>
                )}
              </div>

              {step === 1 && (
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={tryLiveLocation}
                    disabled={gpsBusy}
                    className="flex w-full items-center justify-between gap-3 rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 disabled:opacity-60 sm:rounded-3xl sm:p-5"
                    style={{ background: `${active.accentColor}14`, borderColor: `${active.accentColor}60` }}
                  >
                    <span className="flex min-w-0 items-center gap-3 sm:gap-4">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl sm:h-14 sm:w-14" style={{ background: active.accentColor, color: active.onAccent }}>
                        <LocateFixed size={23} className={gpsBusy ? 'animate-pulse' : ''} />
                      </span>
                      <span className="min-w-0">
                        <strong className="block text-base font-black sm:text-xl">
                          {gpsBusy ? 'Finding your live location…' : 'Use my live location'}
                        </strong>
                        <span className="mt-1 block text-[11px] leading-4 opacity-55 sm:text-sm">
                          Exact GPS pin + automatic nearest MFZ branch
                        </span>
                      </span>
                    </span>
                    <ArrowRight size={19} className="shrink-0" />
                  </button>

                  {gpsError && (
                    <div className="rounded-2xl border px-4 py-3 text-xs leading-5" style={{ background: '#ef444412', borderColor: '#ef444440' }}>
                      {gpsError}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex w-full items-center justify-between gap-3 rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 sm:rounded-3xl sm:p-5"
                    style={{ background: 'rgba(255,255,255,.045)', borderColor: `${active.textColor}18` }}
                  >
                    <span className="flex items-center gap-3 sm:gap-4">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: `${active.textColor}0B` }}>
                        <MapPin size={22} style={{ color: active.accentColor }} />
                      </span>
                      <span>
                        <strong className="block text-base font-black sm:text-lg">Enter location manually</strong>
                        <span className="mt-1 block text-[11px] opacity-50 sm:text-xs">Peshawar · 3 serving branches</span>
                      </span>
                    </span>
                    <ArrowRight size={19} />
                  </button>
                </div>
              )}

              {step === 2 && (
                <div>
                  <div className="mb-3 flex items-center gap-3 rounded-2xl border px-4 py-3" style={{ background: 'rgba(255,255,255,.055)', borderColor: `${active.textColor}18` }}>
                    <Search size={17} className="opacity-45" />
                    <input
                      autoFocus
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Hayatabad, Town, Gulbahar…"
                      className="w-full bg-transparent text-sm outline-none placeholder:opacity-35"
                      style={{ color: active.textColor }}
                    />
                  </div>

                  <div className="max-h-[42svh] space-y-2 overflow-y-auto pr-1 sm:max-h-[320px]">
                    {filteredAreas.map((area: DeliveryArea) => {
                      const branch = branches.find((item) => item.id === area.branchId);
                      const selected = area.id === areaId;
                      return (
                        <button
                          key={area.id}
                          type="button"
                          onClick={() => setAreaId(area.id)}
                          className="flex w-full items-center justify-between gap-3 rounded-2xl border p-3.5 text-left transition hover:translate-x-0.5 sm:p-4"
                          style={{
                            background: selected ? `${active.accentColor}18` : 'rgba(255,255,255,.035)',
                            borderColor: selected ? active.accentColor : `${active.textColor}12`,
                          }}
                        >
                          <span className="flex min-w-0 items-center gap-3">
                            <MapPin size={17} className="shrink-0" style={{ color: active.accentColor }} />
                            <span className="min-w-0">
                              <strong className="block truncate text-sm font-black sm:text-base">{area.name}</strong>
                              <span className="mt-0.5 block truncate text-[10px] opacity-45 sm:text-xs">Nearest MFZ · {branch?.name}</span>
                            </span>
                          </span>
                          {selected && <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full" style={{ background: active.accentColor, color: active.onAccent }}><Check size={14} /></span>}
                        </button>
                      );
                    })}

                    {!filteredAreas.length && (
                      <div className="rounded-2xl border p-5 text-center text-xs opacity-55" style={{ borderColor: `${active.textColor}15` }}>
                        No matching area yet. Try a nearby neighbourhood name.
                      </div>
                    )}
                  </div>

                  {selectedBranch && (
                    <div className="mt-3 flex items-center gap-3 rounded-2xl border p-3.5" style={{ background: `${active.accentColor}0F`, borderColor: `${active.accentColor}35` }}>
                      <Store size={18} style={{ color: active.accentColor }} />
                      <div>
                        <div className="text-[9px] font-black uppercase tracking-widest opacity-45">Serving branch</div>
                        <div className="text-sm font-black">{selectedBranch.name}</div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-3">
                  {selectedArea && selectedBranch && (
                    <div className="flex items-center justify-between gap-3 rounded-2xl border p-3.5" style={{ background: `${active.accentColor}10`, borderColor: `${active.accentColor}35` }}>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-black">{selectedArea.name}, Peshawar</div>
                        <div className="mt-0.5 truncate text-[10px] opacity-50 sm:text-xs">{selectedBranch.name}</div>
                      </div>
                      <button type="button" onClick={() => setStep(2)} className="text-[9px] font-black uppercase tracking-widest" style={{ color: active.accentColor }}>Change</button>
                    </div>
                  )}

                  {[
                    ['House / street / building', addressLine, setAddressLine, 'e.g. House 22, Street 4, Phase 3'],
                    ['Nearby landmark', landmark, setLandmark, 'e.g. Opposite market / near mosque'],
                    ['Delivery note · optional', deliveryNotes, setDeliveryNotes, 'Gate colour, floor, call on arrival…'],
                  ].map(([label, value, setter, placeholder]) => (
                    <label className="block" key={label as string}>
                      <span className="mb-1.5 block text-[9px] font-black uppercase tracking-[.18em] opacity-55">{label as string}</span>
                      <input
                        value={value as string}
                        onChange={(event) => (setter as React.Dispatch<React.SetStateAction<string>>)(event.target.value)}
                        placeholder={placeholder as string}
                        className="w-full rounded-2xl border px-4 py-3.5 text-sm outline-none sm:py-4"
                        style={{ background: 'rgba(255,255,255,.06)', color: active.textColor, borderColor: `${active.textColor}18` }}
                      />
                    </label>
                  ))}
                </div>
              )}

              {step > 1 && (
                <div className="mt-5 flex items-center justify-between gap-3 sm:mt-7">
                  <button
                    type="button"
                    onClick={() => setStep((current) => Math.max(1, current - 1))}
                    className="flex items-center gap-2 rounded-full border px-4 py-3 text-[10px] font-black uppercase tracking-widest"
                    style={{ borderColor: `${active.textColor}20` }}
                  >
                    <ArrowLeft size={15} /> Back
                  </button>

                  {step === 2 ? (
                    <button
                      type="button"
                      disabled={!selectedArea}
                      onClick={() => setStep(3)}
                      className="flex items-center gap-2 rounded-full px-5 py-3 text-[10px] font-black uppercase tracking-widest disabled:cursor-not-allowed disabled:opacity-35 sm:px-6"
                      style={{ background: active.accentColor, color: active.onAccent }}
                    >
                      Continue <ArrowRight size={15} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={!selectedArea || !addressLine.trim()}
                      onClick={saveManual}
                      className="flex items-center gap-2 rounded-full px-5 py-3 text-[10px] font-black uppercase tracking-widest disabled:cursor-not-allowed disabled:opacity-35 sm:px-6"
                      style={{ background: active.accentColor, color: active.onAccent }}
                    >
                      <Check size={15} /> Save location
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}