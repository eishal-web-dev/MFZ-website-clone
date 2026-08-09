import { useState } from 'react';
import {
  Check,
  Download,
  MapPin,
  ShieldCheck,
  Smartphone,
  Zap,
} from 'lucide-react';
import { motion } from 'framer-motion';

import { Footer } from '@/components/Footer';
import { usePWAInstall } from '@/context/PWAInstallContext';
import { useTheme } from '@/context/ThemeContext';

export default function InstallAppPage() {
  const { activeProduct: active } = useTheme();
  const {
    canInstall,
    isIOS,
    isInstalled,
    install,
  } = usePWAInstall();

  const [message, setMessage] = useState('');
  const [showIOSHelp, setShowIOSHelp] = useState(false);

  const handleInstall = async () => {
    setMessage('');
    const result = await install();

    if (result === 'accepted' || result === 'installed') {
      setMessage('MFZ is ready on your home screen.');
      return;
    }

    if (result === 'ios') {
      setShowIOSHelp(true);
      return;
    }

    if (result === 'dismissed') {
      setMessage('Installation was cancelled. You can try again anytime.');
      return;
    }

    setMessage(
      'Install is not available in this browser yet. Open this page in Chrome/Edge on Android or Safari on iPhone.',
    );
  };

  const features = [
    {
      icon: Zap,
      title: 'Faster ordering',
      text: 'Open MFZ straight from your home screen without searching for the website.',
    },
    {
      icon: MapPin,
      title: 'Your location stays ready',
      text: 'Your saved delivery area and nearest MFZ branch remain part of the app experience.',
    },
    {
      icon: ShieldCheck,
      title: 'No separate app store needed',
      text: 'The MFZ PWA installs directly from the website when your browser supports it.',
    },
  ];

  return (
    <div
      className="min-h-screen"
      style={{
        background: active.bgColor,
        color: active.textColor,
        paddingTop: 'var(--nav-h)',
      }}
    >
      <main className="overflow-hidden">
        <section className="relative min-h-[78svh] px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
          <div
            className="pointer-events-none absolute left-1/2 top-1/3 h-[420px] w-[420px] -translate-x-1/2 rounded-full blur-[120px]"
            style={{ background: `${active.accentColor}20` }}
          />

          <div className="mfz-container relative grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
            >
              <div
                className="text-[10px] font-black uppercase tracking-[0.32em]"
                style={{ color: active.accentColor }}
              >
                MFZ · Mobile App
              </div>

              <h1
                className="mt-4 max-w-3xl text-[clamp(3.6rem,11vw,8.5rem)] font-black uppercase leading-[0.82] tracking-[-0.035em]"
                style={{ fontFamily: 'Anton, sans-serif' }}
              >
                Crunch.
                <br />
                One tap away.
              </h1>

              <p className="mt-6 max-w-xl text-sm leading-7 opacity-65 sm:text-base">
                Install MFZ on your phone for a quicker, cleaner ordering experience with your saved delivery setup ready to go.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={handleInstall}
                  disabled={isInstalled}
                  className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full px-7 text-sm font-black uppercase tracking-wider transition-transform enabled:hover:scale-[1.03] disabled:cursor-default"
                  style={{
                    background: isInstalled
                      ? `${active.accentColor}35`
                      : active.accentColor,
                    color: isInstalled
                      ? active.textColor
                      : active.onAccent,
                  }}
                >
                  {isInstalled ? (
                    <>
                      <Check size={19} /> Installed
                    </>
                  ) : (
                    <>
                      <Download size={19} /> Install MFZ App
                    </>
                  )}
                </button>

                <div className="text-xs leading-5 opacity-50 sm:max-w-[260px]">
                  {canInstall
                    ? 'Your device is ready. Tap install and confirm the browser prompt.'
                    : isIOS
                      ? 'iPhone users can add MFZ directly to the Home Screen from Safari.'
                      : 'If the install button is unavailable, open this page in a supported mobile browser.'}
                </div>
              </div>

              {showIOSHelp && (
                <div
                  className="mt-5 max-w-xl rounded-3xl border p-5 text-sm leading-6"
                  style={{
                    background: `${active.accentColor}0D`,
                    borderColor: `${active.accentColor}32`,
                  }}
                >
                  <strong>Install on iPhone:</strong> open MFZ in Safari, tap the Share button, choose <strong>Add to Home Screen</strong>, then tap <strong>Add</strong>.
                </div>
              )}

              {message && (
                <div
                  className="mt-5 max-w-xl rounded-2xl border px-4 py-3 text-xs leading-5 opacity-75"
                  style={{ borderColor: `${active.textColor}20` }}
                >
                  {message}
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30, rotate: 2 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ duration: 0.65, delay: 0.08 }}
              className="mx-auto w-full max-w-[430px]"
            >
              <div
                className="relative mx-auto aspect-[9/18.5] w-[72%] min-w-[250px] max-w-[330px] overflow-hidden rounded-[44px] border-[8px] shadow-2xl sm:w-[78%]"
                style={{
                  background: `linear-gradient(160deg, ${active.dominantColor}, ${active.bgColor})`,
                  borderColor: '#161616',
                  boxShadow: `0 40px 100px rgba(0,0,0,.55), 0 0 70px ${active.accentColor}18`,
                }}
              >
                <div className="absolute left-1/2 top-2 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />

                <div className="flex h-full flex-col px-5 pb-6 pt-12">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[9px] font-black uppercase tracking-[.28em] opacity-55">
                        MFZ App
                      </div>
                      <div
                        className="mt-1 text-3xl font-black"
                        style={{ fontFamily: 'Anton, sans-serif' }}
                      >
                        MFZ
                      </div>
                    </div>
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-2xl"
                      style={{
                        background: active.accentColor,
                        color: active.onAccent,
                      }}
                    >
                      <Smartphone size={20} />
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div
                      className="rounded-[28px] border p-5"
                      style={{
                        background: 'rgba(255,255,255,.06)',
                        borderColor: `${active.textColor}14`,
                      }}
                    >
                      <div
                        className="text-4xl font-black uppercase leading-[.9]"
                        style={{ fontFamily: 'Anton, sans-serif' }}
                      >
                        Your crunch.
                        <br />
                        Your way.
                      </div>
                      <div className="mt-4 text-xs leading-5 opacity-55">
                        Menu. Build yours. Live delivery location. Checkout. All from your home screen.
                      </div>
                    </div>

                    <div
                      className="mt-4 flex h-12 items-center justify-center rounded-full text-xs font-black uppercase tracking-wider"
                      style={{
                        background: active.accentColor,
                        color: active.onAccent,
                      }}
                    >
                      Order MFZ
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="px-4 pb-16 sm:px-6 sm:pb-20">
          <div className="mfz-container grid gap-3 md:grid-cols-3">
            {features.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-[26px] border p-5 sm:p-6"
                style={{
                  background: 'rgba(255,255,255,.035)',
                  borderColor: `${active.textColor}12`,
                }}
              >
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-2xl"
                  style={{
                    background: `${active.accentColor}18`,
                    color: active.accentColor,
                  }}
                >
                  <Icon size={20} />
                </div>
                <h2 className="mt-5 text-xl font-black">{title}</h2>
                <p className="mt-2 text-sm leading-6 opacity-55">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
