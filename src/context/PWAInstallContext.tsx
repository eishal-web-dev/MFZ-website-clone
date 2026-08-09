import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

interface DeferredInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
}

type InstallResult =
  | 'accepted'
  | 'dismissed'
  | 'ios'
  | 'unavailable'
  | 'installed';

interface PWAInstallContextValue {
  canInstall: boolean;
  isIOS: boolean;
  isStandalone: boolean;
  isInstalled: boolean;
  install: () => Promise<InstallResult>;
}

const INSTALLED_KEY = 'mfz-pwa-installed';

const PWAInstallContext =
  createContext<PWAInstallContextValue | null>(null);

export function PWAInstallProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [deferredPrompt, setDeferredPrompt] =
    useState<DeferredInstallPromptEvent | null>(null);
  const [installedThisSession, setInstalledThisSession] =
    useState(false);

  const isIOS = useMemo(() => {
    if (typeof navigator === 'undefined') return false;
    return /iphone|ipad|ipod/i.test(navigator.userAgent);
  }, []);

  const isStandalone = useMemo(() => {
    if (typeof window === 'undefined') return false;

    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      Boolean(
        (window.navigator as Navigator & {
          standalone?: boolean;
        }).standalone,
      )
    );
  }, []);

  const isInstalled =
    isStandalone || installedThisSession;

  useEffect(() => {
    const handleBeforeInstall = (event: Event) => {
      const installEvent = event as DeferredInstallPromptEvent;
      installEvent.preventDefault();
      setDeferredPrompt(installEvent);
    };

    const handleInstalled = () => {
      setInstalledThisSession(true);
      setDeferredPrompt(null);
      try {
        localStorage.setItem(INSTALLED_KEY, '1');
      } catch {
        // Ignore storage errors.
      }
    };

    window.addEventListener(
      'beforeinstallprompt',
      handleBeforeInstall,
    );
    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstall,
      );
      window.removeEventListener(
        'appinstalled',
        handleInstalled,
      );
    };
  }, []);

  const install = async (): Promise<InstallResult> => {
    if (isInstalled) return 'installed';

    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      setDeferredPrompt(null);

      if (choice.outcome === 'accepted') {
        setInstalledThisSession(true);
        try {
          localStorage.setItem(INSTALLED_KEY, '1');
        } catch {
          // Ignore storage errors.
        }
        return 'accepted';
      }

      return 'dismissed';
    }

    if (isIOS) return 'ios';
    return 'unavailable';
  };

  return (
    <PWAInstallContext.Provider
      value={{
        canInstall: Boolean(deferredPrompt),
        isIOS,
        isStandalone,
        isInstalled,
        install,
      }}
    >
      {children}
    </PWAInstallContext.Provider>
  );
}

export function usePWAInstall() {
  const context = useContext(PWAInstallContext);

  if (!context) {
    throw new Error(
      'usePWAInstall must be used within PWAInstallProvider',
    );
  }

  return context;
}
