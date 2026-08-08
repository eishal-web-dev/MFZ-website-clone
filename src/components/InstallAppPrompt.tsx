import { useEffect, useMemo, useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import { useTheme } from '@/context/ThemeContext';
import { useDeliveryLocation } from '@/context/LocationContext';

interface DeferredInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
}

const DISMISSED_KEY = 'mfz-pwa-install-dismissed-at';
const INSTALLED_KEY = 'mfz-pwa-installed';
const SHOW_AFTER_MS = 45000;
const REMIND_AFTER_MS = 7 * 24 * 60 * 60 * 1000;

export function InstallAppPrompt() {
  const { activeProduct: active } = useTheme();
  const { selectorOpen } = useDeliveryLocation();
  const [deferredPrompt, setDeferredPrompt] =
    useState<DeferredInstallPromptEvent | null>(null);
  const [timeReady, setTimeReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [iosHelp, setIosHelp] = useState(false);

  const isStandalone = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone)
    );
  }, []);

  const isIOS = useMemo(() => {
    if (typeof navigator === 'undefined') return false;
    return /iphone|ipad|ipod/i.test(navigator.userAgent);
  }, []);

  useEffect(() => {
    if (isStandalone || localStorage.getItem(INSTALLED_KEY) === '1') return;

    const dismissedAt = Number(localStorage.getItem(DISMISSED_KEY) || 0);
    if (dismissedAt && Date.now() - dismissedAt < REMIND_AFTER_MS) return;

    const timer = window.setTimeout(() => setTimeReady(true), SHOW_AFTER_MS);

    const handleBeforeInstall = (event: Event) => {
      const installEvent = event as DeferredInstallPromptEvent;
      installEvent.preventDefault();
      setDeferredPrompt(installEvent);
    };

    const handleInstalled = () => {
      localStorage.setItem(INSTALLED_KEY, '1');
      setOpen(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, [isStandalone]);

  useEffect(() => {
    if (!timeReady || selectorOpen || isStandalone) return;
    if (!deferredPrompt && !isIOS) return;
    setOpen(true);
  }, [deferredPrompt, isIOS, isStandalone, selectorOpen, timeReady]);

  const dismiss = () => {
    localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    setOpen(false);
    setIosHelp(false);
  };

  const install = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        localStorage.setItem(INSTALLED_KEY, '1');
        setOpen(false);
      } else {
        localStorage.setItem(DISMISSED_KEY, String(Date.now()));
      }
      setDeferredPrompt(null);
      return;
    }

    if (isIOS) {
      setIosHelp(true);
    }
  };

  return (
    <AnimatePresence>
      {open && !selectorOpen && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.985 }}
          className="fixed bottom-3 left-3 right-3 z-[330] mx-auto max-w-[520px] rounded-[24px] border p-4 shadow-2xl sm:bottom-5 sm:left-auto sm:right-5 sm:w-[460px] sm:p-5"
          style={{
            background: `linear-gradient(145deg, ${active.bgColor}F5, ${active.dominantColor}F2)`,
            borderColor: `${active.accentColor}45`,
            color: active.textColor,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: `0 28px 80px rgba(0,0,0,.5), 0 0 45px ${active.accentColor}12`,
          }}
        >
          <button
            type="button"
            aria-label="Dismiss install prompt"
            onClick={dismiss}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border opacity-55 transition hover:opacity-100"
            style={{ borderColor: `${active.textColor}20` }}
          >
            <X size={14} />
          </button>

          <div className="flex items-start gap-3 pr-8 sm:gap-4">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl sm:h-14 sm:w-14"
              style={{ background: active.accentColor, color: active.onAccent }}
            >
              <Smartphone size={24} />
            </div>

            <div className="min-w-0">
              <div className="text-[9px] font-black uppercase tracking-[.25em]" style={{ color: active.accentColor }}>
                MFZ in your pocket
              </div>
              <h3 className="mt-1 text-xl font-black leading-tight sm:text-2xl" style={{ fontFamily: 'Anton, sans-serif' }}>
                Install the MFZ app?
              </h3>
              <p className="mt-1.5 text-xs leading-5 opacity-60 sm:text-sm">
                Faster ordering, your saved delivery pin and the full MFZ experience straight from your home screen.
              </p>
            </div>
          </div>

          {iosHelp ? (
            <div className="mt-4 rounded-2xl border p-3.5 text-xs leading-5" style={{ background: `${active.accentColor}0D`, borderColor: `${active.accentColor}30` }}>
              On iPhone/iPad: tap <strong>Share</strong> in Safari, then choose <strong>Add to Home Screen</strong> and confirm <strong>Add</strong>.
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={dismiss}
                className="rounded-full border px-4 py-3 text-[10px] font-black uppercase tracking-wider"
                style={{ borderColor: `${active.textColor}22` }}
              >
                Not now
              </button>
              <button
                type="button"
                onClick={install}
                className="flex items-center justify-center gap-2 rounded-full px-4 py-3 text-[10px] font-black uppercase tracking-wider"
                style={{ background: active.accentColor, color: active.onAccent }}
              >
                <Download size={15} /> Install app
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
