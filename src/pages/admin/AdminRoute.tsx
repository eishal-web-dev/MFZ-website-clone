import type { ReactNode } from 'react';
import {
  Navigate,
  useLocation,
} from 'react-router-dom';

interface StoredUser {
  id: string;
  name: string;
  email: string;
  role?: 'customer' | 'admin';
}

interface AdminRouteProps {
  children: ReactNode;
}

const ADMIN_EMAIL = 'admin@gmail.com';

export function AdminRoute({
  children,
}: AdminRouteProps) {
  const location = useLocation();

  const token = localStorage.getItem(
    'mfz_auth_token',
  );

  const savedUser = localStorage.getItem(
    'mfz_user',
  );

  if (!token || !savedUser) {
    return (
      <Navigate
        to="/signin"
        replace
        state={{
          from: location.pathname,
          message:
            'Sign in with the administrator account.',
        }}
      />
    );
  }

  try {
    const user = JSON.parse(
      savedUser,
    ) as StoredUser;

    const isAdmin =
      user.role === 'admin' &&
      user.email
        .trim()
        .toLowerCase() === ADMIN_EMAIL;

    if (!isAdmin) {
      return (
        <Navigate
          to="/"
          replace
        />
      );
    }

    return <>{children}</>;
  } catch {
    localStorage.removeItem(
      'mfz_auth_token',
    );

    localStorage.removeItem('mfz_user');

    return (
      <Navigate
        to="/signin"
        replace
      />
    );
  }
}