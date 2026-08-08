import {
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  MapPin,
  Navigation,
  Search,
  Store,
} from 'lucide-react';
import {
  AnimatePresence,
  motion,
} from 'framer-motion';

import { useTheme } from '@/context/ThemeContext';
import { useDeliveryLocation } from '@/context/LocationContext';
import {
  deliveryAreas,
  getDeliveryAreaById,
  type DeliveryArea,
} from '@/data/deliveryAreas';
import { branches } from '@/data/branches';

interface DeliveryLocationModalProps {
  enabled: boolean;
}

export function DeliveryLocationModal({
  enabled,
}: DeliveryLocationModalProps) {
  const { activeProduct } = useTheme();
  const {
    deliveryLocation,
    selectorOpen,
    closeSelector,
    saveLocation,
  } = useDeliveryLocation();

  const active = activeProduct;
  const [step, setStep] = useState(1);
  const [query, setQuery] = useState('');
  const [areaId, setAreaId] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [landmark, setLandmark] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  useEffect(() => {
    if (!selectorOpen) return;

    setStep(1);
    setQuery('');
    setAreaId(deliveryLocation?.areaId ?? '');
    setAddressLine(deliveryLocation?.addressLine ?? '');
    setLandmark(deliveryLocation?.landmark ?? '');
    setDeliveryNotes(deliveryLocation?.deliveryNotes ?? '');
  }, [deliveryLocation, selectorOpen]);

  useEffect(() => {
    if (!enabled || !selectorOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
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

  const selectedArea = areaId
    ? getDeliveryAreaById(areaId) ?? null
    : null;

  const selectedBranch = selectedArea
    ? branches.find((branch) => branch.id === selectedArea.branchId) ?? null
    : null;

  const canClose = Boolean(deliveryLocation);

  const handleAreaSelect = (area: DeliveryArea) => {
    setAreaId(area.id);
  };

  const handleSave = () => {
    if (!selectedArea || !addressLine.trim()) return;

    saveLocation({
      area: selectedArea,
      addressLine,
      landmark,
      deliveryNotes,
    });
  };

  const progress = `${Math.round((step / 3) * 100)}%`;

  return (
    <AnimatePresence>
      {enabled && selectorOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[350] flex items-center justify-center overflow-y-auto px-4 py-6 sm:px-6"
          style={{
            background: 'rgba(8, 5, 4, 0.68)',
            backdropFilter: 'blur(18px) saturate(0.75)',
            WebkitBackdropFilter: 'blur(18px) saturate(0.75)',
          }}
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              canClose
            ) {
              closeSelector();
            }
          }}
        >
          <motion.section
            initial={{ y: 24, opacity: 0, scale: 0.985 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 18, opacity: 0, scale: 0.99 }}
            transition={{ type: 'spring', stiffness: 250, damping: 26 }}
            className="relative w-full max-w-[720px] overflow-hidden rounded-[30px] border shadow-2xl"
            style={{
              background: `linear-gradient(145deg, ${active.bgColor}, ${active.dominantColor}22 140%)`,
              borderColor: `${active.accentColor}45`,
              color: active.textColor,
              boxShadow: `0 40px 120px rgba(0,0,0,.58), 0 0 70px ${active.accentColor}18`,
            }}
          >
            <div
              className="absolute inset-x-0 top-0 h-1"
              style={{ background: `${active.textColor}10` }}
            >
              <motion.div
                animate={{ width: progress }}
                className="h-full rounded-full"
                style={{ background: active.accentColor }}
              />
            </div>

            <div className="p-6 sm:p-8 md:p-10">
              <div className="mb-7 flex items-start justify-between gap-5">
                <div>
                  <div
                    className="mb-2 text-[10px] font-black uppercase tracking-[0.34em]"
                    style={{ color: active.accentColor }}
                  >
                    MFZ Delivery Setup · Step {step} of 3
                  </div>
                  <h2
                    className="max-w-[560px] text-4xl font-black leading-[0.96] sm:text-5xl"
                    style={{ fontFamily: 'Anton, sans-serif' }}
                  >
                    {step === 1 && 'Where should the crunch land?'}
                    {step === 2 && 'Choose your area.'}
                    {step === 3 && 'Pin down the exact spot.'}
                  </h2>
                  <p className="mt-3 max-w-[560px] text-sm leading-6 opacity-60 sm:text-base">
                    {step === 1 &&
                      'We use your location to route every order to the best MFZ branch for you.'}
                    {step === 2 &&
                      'Search your neighbourhood and we’ll match it with the nearest serving MFZ branch.'}
                    {step === 3 &&
                      'Add the final delivery details once. We’ll remember them for your next order.'}
                  </p>
                </div>

                {canClose && (
                  <button
                    type="button"
                    onClick={closeSelector}
                    className="shrink-0 rounded-full border px-3 py-2 text-[10px] font-black uppercase tracking-widest opacity-60 transition hover:opacity-100"
                    style={{ borderColor: `${active.textColor}25` }}
                  >
                    Close
                  </button>
                )}
              </div>

              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="city"
                    initial={{ x: 28, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -28, opacity: 0 }}
                    className="space-y-4"
                  >
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="group flex w-full items-center justify-between gap-5 rounded-3xl border p-5 text-left transition-transform hover:-translate-y-1 sm:p-6"
                      style={{
                        background: `${active.accentColor}12`,
                        borderColor: `${active.accentColor}55`,
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <span
                          className="flex h-14 w-14 items-center justify-center rounded-2xl"
                          style={{
                            background: active.accentColor,
                            color: active.onAccent,
                          }}
                        >
                          <Navigation size={24} />
                        </span>
                        <span>
                          <strong className="block text-xl font-black">Peshawar</strong>
                          <span className="mt-1 block text-sm opacity-55">
                            3 delivery branches ready to serve you
                          </span>
                        </span>
                      </div>
                      <ArrowRight className="shrink-0 transition-transform group-hover:translate-x-1" />
                    </button>

                    <div
                      className="rounded-2xl border p-4 text-xs leading-5 opacity-60"
                      style={{ borderColor: `${active.textColor}18` }}
                    >
                      More cities can be added later. For now, MFZ delivery routing in this website is configured for Peshawar.
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="area"
                    initial={{ x: 28, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -28, opacity: 0 }}
                  >
                    <div
                      className="mb-4 flex items-center gap-3 rounded-2xl border px-4 py-3"
                      style={{
                        background: 'rgba(255,255,255,.055)',
                        borderColor: `${active.textColor}18`,
                      }}
                    >
                      <Search size={18} className="opacity-45" />
                      <input
                        autoFocus
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search Hayatabad, Town, Gulbahar..."
                        className="w-full bg-transparent text-sm outline-none placeholder:opacity-35"
                        style={{ color: active.textColor }}
                      />
                    </div>

                    <div className="max-h-[330px] space-y-2 overflow-y-auto pr-1">
                      {filteredAreas.map((area) => {
                        const branch = branches.find(
                          (item) => item.id === area.branchId,
                        );
                        const selected = area.id === areaId;

                        return (
                          <button
                            key={area.id}
                            type="button"
                            onClick={() => handleAreaSelect(area)}
                            className="flex w-full items-center justify-between gap-4 rounded-2xl border p-4 text-left transition-all hover:translate-x-1"
                            style={{
                              background: selected
                                ? `${active.accentColor}18`
                                : 'rgba(255,255,255,.035)',
                              borderColor: selected
                                ? active.accentColor
                                : `${active.textColor}12`,
                            }}
                          >
                            <span className="flex min-w-0 items-center gap-3">
                              <MapPin
                                size={18}
                                className="shrink-0"
                                style={{ color: active.accentColor }}
                              />
                              <span className="min-w-0">
                                <strong className="block truncate text-sm font-black sm:text-base">
                                  {area.name}
                                </strong>
                                <span className="mt-0.5 block truncate text-[11px] opacity-45 sm:text-xs">
                                  Nearest MFZ · {branch?.name ?? 'MFZ Peshawar'}
                                </span>
                              </span>
                            </span>
                            {selected && (
                              <span
                                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                                style={{
                                  background: active.accentColor,
                                  color: active.onAccent,
                                }}
                              >
                                <Check size={15} />
                              </span>
                            )}
                          </button>
                        );
                      })}

                      {filteredAreas.length === 0 && (
                        <div className="rounded-2xl border p-5 text-center text-sm opacity-55" style={{ borderColor: `${active.textColor}15` }}>
                          We couldn’t find that area yet. Try a nearby neighbourhood name.
                        </div>
                      )}
                    </div>

                    {selectedArea && selectedBranch && (
                      <div
                        className="mt-4 flex items-center gap-3 rounded-2xl border p-4"
                        style={{
                          background: `${active.accentColor}0f`,
                          borderColor: `${active.accentColor}35`,
                        }}
                      >
                        <Store size={19} style={{ color: active.accentColor }} />
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-widest opacity-45">
                            Your serving branch
                          </div>
                          <div className="mt-0.5 text-sm font-black">
                            {selectedBranch.name}
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="details"
                    initial={{ x: 28, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -28, opacity: 0 }}
                    className="space-y-4"
                  >
                    {selectedArea && selectedBranch && (
                      <div
                        className="flex items-center justify-between gap-4 rounded-2xl border p-4"
                        style={{
                          background: `${active.accentColor}10`,
                          borderColor: `${active.accentColor}35`,
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <MapPin size={19} style={{ color: active.accentColor }} />
                          <div>
                            <div className="font-black">{selectedArea.name}, Peshawar</div>
                            <div className="mt-0.5 text-xs opacity-50">
                              {selectedBranch.name} will serve this area
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="text-[10px] font-black uppercase tracking-widest"
                          style={{ color: active.accentColor }}
                        >
                          Change
                        </button>
                      </div>
                    )}

                    <label className="block">
                      <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] opacity-55">
                        House / Street / Building
                      </span>
                      <input
                        autoFocus
                        value={addressLine}
                        onChange={(event) => setAddressLine(event.target.value)}
                        placeholder="e.g. House 22, Street 4, Phase 3"
                        className="w-full rounded-2xl border px-4 py-4 outline-none transition focus:scale-[1.005]"
                        style={{
                          background: 'rgba(255,255,255,.06)',
                          color: active.textColor,
                          borderColor: `${active.textColor}18`,
                        }}
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] opacity-55">
                        Nearby landmark
                      </span>
                      <input
                        value={landmark}
                        onChange={(event) => setLandmark(event.target.value)}
                        placeholder="e.g. Near mosque / opposite market"
                        className="w-full rounded-2xl border px-4 py-4 outline-none"
                        style={{
                          background: 'rgba(255,255,255,.06)',
                          color: active.textColor,
                          borderColor: `${active.textColor}18`,
                        }}
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] opacity-55">
                        Delivery note · optional
                      </span>
                      <input
                        value={deliveryNotes}
                        onChange={(event) => setDeliveryNotes(event.target.value)}
                        placeholder="Gate colour, floor, call on arrival..."
                        className="w-full rounded-2xl border px-4 py-4 outline-none"
                        style={{
                          background: 'rgba(255,255,255,.06)',
                          color: active.textColor,
                          borderColor: `${active.textColor}18`,
                        }}
                      />
                    </label>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-7 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (step > 1) setStep((current) => current - 1);
                  }}
                  disabled={step === 1}
                  className="inline-flex items-center gap-2 rounded-full border px-5 py-3 text-xs font-black uppercase tracking-wider transition disabled:pointer-events-none disabled:opacity-0"
                  style={{ borderColor: `${active.textColor}20` }}
                >
                  <ArrowLeft size={16} />
                  Back
                </button>

                {step === 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-xs font-black uppercase tracking-wider transition hover:scale-[1.025]"
                    style={{
                      background: active.accentColor,
                      color: active.onAccent,
                    }}
                  >
                    Choose Peshawar
                    <ArrowRight size={16} />
                  </button>
                )}

                {step === 2 && (
                  <button
                    type="button"
                    disabled={!selectedArea}
                    onClick={() => setStep(3)}
                    className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-xs font-black uppercase tracking-wider transition hover:scale-[1.025] disabled:cursor-not-allowed disabled:opacity-35"
                    style={{
                      background: active.accentColor,
                      color: active.onAccent,
                    }}
                  >
                    Continue
                    <ArrowRight size={16} />
                  </button>
                )}

                {step === 3 && (
                  <button
                    type="button"
                    disabled={!selectedArea || !addressLine.trim()}
                    onClick={handleSave}
                    className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-xs font-black uppercase tracking-wider transition hover:scale-[1.025] disabled:cursor-not-allowed disabled:opacity-35"
                    style={{
                      background: active.accentColor,
                      color: active.onAccent,
                    }}
                  >
                    Save & Start Ordering
                    <Check size={16} />
                  </button>
                )}
              </div>
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
