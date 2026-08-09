import { lazy, Suspense, useEffect, useState } from 'react';
import {
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from '@/context/ThemeContext';
import { CartProvider } from '@/context/CartContext';
import { LocationProvider } from '@/context/LocationContext';
import { PWAInstallProvider } from '@/context/PWAInstallContext';
import { Navbar } from '@/components/Navbar';
import { CartDrawer } from '@/components/CartDrawer';
import { LoadingScreen } from '@/components/LoadingScreen';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { DeliveryLocationModalV2 } from '@/components/DeliveryLocationModalV2';
import { AutoLocationResolver } from '@/components/AutoLocationResolver';
import { InstallAppPrompt } from '@/components/InstallAppPrompt';
import { LocationBadge } from '@/components/LocationBadge';
import { AdminRoute } from '@/pages/admin/AdminRoute';

const HomePage = lazy(() => import('@/pages/HomePage'));
const MenuPage = lazy(() => import('@/pages/MenuPage'));
const BuildPage = lazy(() => import('@/pages/BuildPage'));
const LocationsPage = lazy(() => import('@/pages/LocationsPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const CheckoutPage = lazy(() => import('@/pages/CheckoutLocationPage'));
const InstallAppPage = lazy(() => import('@/pages/InstallAppPage'));
import AuthPages from '@/pages/AuthPages';
const AdminDashboardPage = lazy(
  () => import('@/pages/admin/AdminDashboardPage'),
);
const MenuItemPage = lazy(
  () => import('@/pages/MenuItemPage'),
);
const AdminOrdersPage = lazy(
  () => import('@/pages/admin/AdminOrdersPage'),
);

function PageLoader() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'var(--mfz-bg)' }}
    >
      <div
        className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin"
        style={{
          borderColor: 'var(--mfz-accent)',
          borderTopColor: 'transparent',
        }}
      />
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

function AppRoutes() {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <LocationBadge />

      <AnimatePresence mode="wait">
        <Suspense fallback={<PageLoader />}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/build" element={<BuildPage />} />
            <Route path="/locations" element={<LocationsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/app" element={<InstallAppPage />} />
            <Route path="/download" element={<InstallAppPage />} />
            <Route path="/signin" element={<AuthPages.SignInPage />} />
            <Route path="/signup" element={<AuthPages.SignUpPage />} />
            <Route path="/forgot" element={<AuthPages.ForgotPage />} />
            <Route path="/reset" element={<AuthPages.ResetPage />} />
            <Route path="/verify" element={<AuthPages.VerifyPage />} />
            <Route path="/menu/:productId" element={<MenuItemPage />} />
            <Route
              path="/admin/orders"
              element={
                <AdminRoute>
                  <AdminOrdersPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboardPage />
                </AdminRoute>
              }
            />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </Suspense>
      </AnimatePresence>

      <CartDrawer />
    </>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LocationProvider>
          <PWAInstallProvider>
            <CartProvider>
              <AnimatePresence>
                {loading && <LoadingScreen />}
              </AnimatePresence>

              <AppRoutes />

              <AutoLocationResolver enabled={!loading} />
              <DeliveryLocationModalV2 enabled={!loading} />
              <InstallAppPrompt />
            </CartProvider>
          </PWAInstallProvider>
        </LocationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
