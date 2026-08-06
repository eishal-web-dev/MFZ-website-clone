import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Link,
  useNavigate,
} from 'react-router-dom';
import {
  AlertTriangle,
  Banknote,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  LayoutDashboard,
  Menu,
  PackageCheck,
  RefreshCw,
  ShoppingBag,
  TrendingUp,
  Users,
  WalletCards,
  X,
} from 'lucide-react';

import { useTheme } from '@/context/ThemeContext';
import { formatPKR } from '@/data/menu';

type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'ready'
  | 'out-for-delivery'
  | 'completed'
  | 'cancelled';

type PaymentMethod =
  | 'cash-on-delivery'
  | 'easypaisa'
  | 'jazzcash'
  | 'card';

type PaymentStatus =
  | 'unpaid'
  | 'verification-required'
  | 'paid'
  | 'failed'
  | 'refunded';

interface OrderItem {
  productId: number;
  name: string;
  quantity: number;
  unitPrice: number;
  filling?: string;
  sauces?: string[];
  extras?: string[];
}

interface OrderCustomer {
  name: string;
  phone: string;
  email?: string;
  address?: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  customer: OrderCustomer;
  items: OrderItem[];
  orderType: 'delivery' | 'pickup';
  branchName?: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  customerNotes?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

interface OrdersApiResponse {
  success: boolean;
  orders?: Order[];
  message?: string;
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:5000/api';

const AUTO_REFRESH_MS = 15_000;

function isSameDay(
  firstDate: Date,
  secondDate: Date,
) {
  return (
    firstDate.getFullYear() ===
      secondDate.getFullYear() &&
    firstDate.getMonth() ===
      secondDate.getMonth() &&
    firstDate.getDate() ===
      secondDate.getDate()
  );
}

function isSameMonth(
  firstDate: Date,
  secondDate: Date,
) {
  return (
    firstDate.getFullYear() ===
      secondDate.getFullYear() &&
    firstDate.getMonth() ===
      secondDate.getMonth()
  );
}

function isSameYear(
  firstDate: Date,
  secondDate: Date,
) {
  return (
    firstDate.getFullYear() ===
    secondDate.getFullYear()
  );
}

function formatStatus(
  status: OrderStatus,
) {
  const labels: Record<OrderStatus, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    processing: 'Processing',
    ready: 'Ready',
    'out-for-delivery': 'Out for Delivery',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };

  return labels[status];
}

function formatPaymentMethod(
  method: PaymentMethod,
) {
  const labels: Record<PaymentMethod, string> = {
    'cash-on-delivery': 'Cash on Delivery',
    easypaisa: 'Easypaisa',
    jazzcash: 'JazzCash',
    card: 'Card',
  };

  return labels[method];
}

function formatPaymentStatus(
  status: PaymentStatus,
) {
  const labels: Record<PaymentStatus, string> = {
    unpaid: 'Unpaid',
    'verification-required':
      'Verification Required',
    paid: 'Paid',
    failed: 'Failed',
    refunded: 'Refunded',
  };

  return labels[status];
}

export default function AdminDashboardPage() {
  const { activeProduct } = useTheme();
  const active = activeProduct;
  const navigate = useNavigate();

  const [orders, setOrders] =
    useState<Order[]>([]);
  const [loading, setLoading] =
    useState(true);
  const [refreshing, setRefreshing] =
    useState(false);
  const [error, setError] =
    useState('');
  const [
    adminMenuOpen,
    setAdminMenuOpen,
  ] = useState(false);

  const fetchOrders = useCallback(
    async (manualRefresh = false) => {
      try {
        if (manualRefresh) {
          setRefreshing(true);
        }

        setError('');

        const token =
          localStorage.getItem(
            'mfz_auth_token',
          );

        if (!token) {
          throw new Error(
            'Your admin session has expired. Please sign in again.',
          );
        }

        const response = await fetch(
          `${API_BASE_URL}/orders`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data =
          (await response.json()) as OrdersApiResponse;

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              'Unable to load orders.',
          );
        }

        setOrders(
          Array.isArray(data.orders)
            ? data.orders
            : [],
        );
      } catch (fetchError) {
        console.error(
          'Admin order fetch failed:',
          fetchError,
        );

        setError(
          fetchError instanceof Error
            ? fetchError.message
            : 'Unable to load orders.',
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    void fetchOrders();

    const interval =
      window.setInterval(() => {
        void fetchOrders();
      }, AUTO_REFRESH_MS);

    return () => {
      window.clearInterval(interval);
    };
  }, [fetchOrders]);

  const analytics = useMemo(() => {
    const now = new Date();

    const ordersToday =
      orders.filter((order) =>
        isSameDay(
          new Date(order.createdAt),
          now,
        ),
      );

    const pendingOrders =
      orders.filter(
        (order) =>
          order.status === 'pending',
      );

    const processingOrders =
      orders.filter((order) =>
        [
          'confirmed',
          'processing',
          'ready',
          'out-for-delivery',
        ].includes(order.status),
      );

    const completedOrders =
      orders.filter(
        (order) =>
          order.status === 'completed',
      );

    const cancelledOrders =
      orders.filter(
        (order) =>
          order.status === 'cancelled',
      );

    const earnedOrders =
      completedOrders.filter(
        (order) =>
          order.paymentStatus ===
            'paid' ||
          order.paymentMethod ===
            'cash-on-delivery',
      );

    const revenueToday =
      earnedOrders
        .filter((order) =>
          isSameDay(
            new Date(order.createdAt),
            now,
          ),
        )
        .reduce(
          (sum, order) =>
            sum + order.total,
          0,
        );

    const revenueThisMonth =
      earnedOrders
        .filter((order) =>
          isSameMonth(
            new Date(order.createdAt),
            now,
          ),
        )
        .reduce(
          (sum, order) =>
            sum + order.total,
          0,
        );

    const revenueThisYear =
      earnedOrders
        .filter((order) =>
          isSameYear(
            new Date(order.createdAt),
            now,
          ),
        )
        .reduce(
          (sum, order) =>
            sum + order.total,
          0,
        );

    const completedCustomerCounts =
      new Map<string, number>();

    completedOrders.forEach(
      (order) => {
        const customerKey =
          order.customer.phone
            ?.replace(/\D/g, '') ||
          order.customer.email
            ?.trim()
            .toLowerCase() ||
          order.customer.name
            .trim()
            .toLowerCase();

        completedCustomerCounts.set(
          customerKey,
          (completedCustomerCounts.get(
            customerKey,
          ) || 0) + 1,
        );
      },
    );

    return {
      ordersToday:
        ordersToday.length,
      pendingOrders:
        pendingOrders.length,
      processingOrders:
        processingOrders.length,
      completedOrders:
        completedOrders.length,
      cancelledOrders:
        cancelledOrders.length,
      revenueToday,
      revenueThisMonth,
      revenueThisYear,
      paidOrders: orders.filter(
        (order) =>
          order.paymentStatus === 'paid',
      ).length,
      cashOnDeliveryOrders:
        orders.filter(
          (order) =>
            order.paymentMethod ===
            'cash-on-delivery',
        ).length,
      verificationRequired:
        orders.filter(
          (order) =>
            order.paymentStatus ===
            'verification-required',
        ).length,
      repeatCustomers:
        Array.from(
          completedCustomerCounts.values(),
        ).filter(
          (count) => count > 1,
        ).length,
    };
  }, [orders]);

  const summaryCards = [
    {
      label: 'Orders Today',
      value: analytics.ordersToday,
      icon: ShoppingBag,
    },
    {
      label: 'Pending Orders',
      value: analytics.pendingOrders,
      icon: Clock3,
    },
    {
      label: 'Processing',
      value:
        analytics.processingOrders,
      icon: PackageCheck,
    },
    {
      label: 'Completed',
      value:
        analytics.completedOrders,
      icon: CheckCircle2,
    },
  ];

  const revenueCards = [
    {
      label: 'Revenue Today',
      value: analytics.revenueToday,
      icon: Banknote,
    },
    {
      label: 'This Month',
      value:
        analytics.revenueThisMonth,
      icon: CalendarDays,
    },
    {
      label: 'This Year',
      value:
        analytics.revenueThisYear,
      icon: TrendingUp,
    },
  ];

  const recentOrders =
    orders.slice(0, 10);

  return (
    <div
      className="min-h-screen"
      style={{
        background: active.bgColor,
        paddingTop: 'var(--nav-h)',
      }}
    >
      <main className="mfz-container py-8 md:py-12">
        <header className="mb-8 flex flex-col gap-5">
          <div className="flex items-start gap-4">
            <button
              type="button"
              onClick={() =>
                setAdminMenuOpen(true)
              }
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border transition-transform hover:scale-105"
              style={{
                background: `${active.accentColor}15`,
                borderColor: `${active.accentColor}55`,
                color: active.accentColor,
              }}
              aria-label="Open admin menu"
            >
              <Menu size={22} />
            </button>

            <div className="flex-1">
              <span
                className="text-xs font-bold uppercase tracking-[0.3em]"
                style={{
                  color:
                    active.accentColor,
                }}
              >
                MFZ Management
              </span>

              <h1
                className="mt-2 text-5xl font-black md:text-7xl"
                style={{
                  color:
                    active.textColor,
                  fontFamily:
                    'Anton, sans-serif',
                }}
              >
                Admin Dashboard
              </h1>

              <p
                className="mt-3 max-w-2xl text-sm md:text-base"
                style={{
                  color:
                    active.textColor,
                  opacity: 0.62,
                }}
              >
                Manage orders, payments,
                customers and restaurant
                performance.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                void fetchOrders(true)
              }
              disabled={refreshing}
              className="hidden items-center gap-2 rounded-full border px-5 py-3 text-sm font-black uppercase transition-transform hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-50 md:flex"
              style={{
                background: `${active.accentColor}15`,
                borderColor: `${active.accentColor}55`,
                color: active.accentColor,
              }}
            >
              <RefreshCw
                size={17}
                className={
                  refreshing
                    ? 'animate-spin'
                    : ''
                }
              />

              {refreshing
                ? 'Refreshing'
                : 'Refresh'}
            </button>
          </div>
        </header>

        {error && (
          <div
            className="mb-6 flex items-start gap-3 rounded-2xl border p-4"
            style={{
              background:
                'rgba(239,68,68,0.08)',
              borderColor:
                'rgba(239,68,68,0.35)',
              color: '#fecaca',
            }}
          >
            <AlertTriangle
              size={20}
              className="mt-0.5 shrink-0"
            />

            <div>
              <p className="font-black">
                Unable to load dashboard
              </p>

              <p className="mt-1 text-sm opacity-80">
                {error}
              </p>
            </div>
          </div>
        )}

        <section className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {summaryCards.map(
            (card) => {
              const Icon = card.icon;

              return (
                <article
                  key={card.label}
                  className="rounded-3xl border p-5"
                  style={{
                    background:
                      'rgba(255,255,255,0.05)',
                    borderColor: `${active.accentColor}25`,
                  }}
                >
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-full"
                    style={{
                      background: `${active.accentColor}18`,
                      color:
                        active.accentColor,
                    }}
                  >
                    <Icon size={20} />
                  </div>

                  <p
                    className="mt-5 text-3xl font-black"
                    style={{
                      color:
                        active.textColor,
                      fontFamily:
                        'Anton, sans-serif',
                    }}
                  >
                    {loading
                      ? '—'
                      : card.value}
                  </p>

                  <p
                    className="mt-1 text-xs font-bold uppercase tracking-wider"
                    style={{
                      color:
                        active.textColor,
                      opacity: 0.52,
                    }}
                  >
                    {card.label}
                  </p>
                </article>
              );
            },
          )}
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-3">
          {revenueCards.map(
            (card) => {
              const Icon = card.icon;

              return (
                <article
                  key={card.label}
                  className="rounded-3xl border p-6"
                  style={{
                    background:
                      active.bgGradient,
                    borderColor: `${active.accentColor}35`,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      size={22}
                      style={{
                        color:
                          active.accentColor,
                      }}
                    />

                    <span
                      className="text-xs font-bold uppercase tracking-widest"
                      style={{
                        color:
                          active.textColor,
                        opacity: 0.58,
                      }}
                    >
                      {card.label}
                    </span>
                  </div>

                  <p
                    className="mt-5 text-4xl font-black"
                    style={{
                      color:
                        active.accentColor,
                      fontFamily:
                        'Anton, sans-serif',
                    }}
                  >
                    {loading
                      ? '—'
                      : formatPKR(
                          card.value,
                        )}
                  </p>
                </article>
              );
            },
          )}
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-3">
          <article
            className="overflow-hidden rounded-3xl border lg:col-span-2"
            style={{
              background:
                'rgba(255,255,255,0.05)',
              borderColor: `${active.accentColor}25`,
            }}
          >
            <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2
                  className="text-2xl font-black"
                  style={{
                    color:
                      active.textColor,
                    fontFamily:
                      'Anton, sans-serif',
                  }}
                >
                  Recent Orders
                </h2>

                <p
                  className="mt-1 text-xs"
                  style={{
                    color:
                      active.textColor,
                    opacity: 0.48,
                  }}
                >
                  Select an order to open
                  it on the Orders page.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className="rounded-full px-3 py-1.5 text-xs font-black"
                  style={{
                    background: `${active.accentColor}18`,
                    color:
                      active.accentColor,
                  }}
                >
                  {orders.length} Total
                </span>

                <Link
                  to="/admin/orders"
                  className="rounded-full border px-4 py-2 text-xs font-black uppercase transition-transform hover:scale-[1.03]"
                  style={{
                    borderColor: `${active.accentColor}45`,
                    color:
                      active.accentColor,
                  }}
                >
                  View All
                </Link>
              </div>
            </div>

            {loading ? (
              <div className="py-16 text-center">
                <RefreshCw
                  size={30}
                  className="mx-auto animate-spin"
                  style={{
                    color:
                      active.accentColor,
                  }}
                />

                <p
                  className="mt-4 text-sm"
                  style={{
                    color:
                      active.textColor,
                    opacity: 0.55,
                  }}
                >
                  Loading orders…
                </p>
              </div>
            ) : recentOrders.length ===
              0 ? (
              <div className="py-16 text-center">
                <ShoppingBag
                  size={35}
                  className="mx-auto"
                  style={{
                    color:
                      active.accentColor,
                  }}
                />

                <p
                  className="mt-4 font-bold"
                  style={{
                    color:
                      active.textColor,
                  }}
                >
                  No orders yet
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[820px] border-collapse">
                  <thead>
                    <tr
                      style={{
                        background:
                          'rgba(255,255,255,0.035)',
                      }}
                    >
                      {[
                        'Order',
                        'Customer',
                        'Amount',
                        'Payment',
                        'Status',
                        'Time',
                        'Open',
                      ].map(
                        (heading) => (
                          <th
                            key={heading}
                            className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-widest"
                            style={{
                              color:
                                active.textColor,
                              opacity: 0.48,
                            }}
                          >
                            {heading}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>

                  <tbody>
                    {recentOrders.map(
                      (order) => (
                        <tr
                          key={order._id}
                          onClick={() =>
                            navigate(
                              `/admin/orders?order=${order._id}`,
                            )
                          }
                          className="cursor-pointer border-t transition-colors hover:bg-white/[0.04]"
                          style={{
                            borderColor:
                              'rgba(255,255,255,0.07)',
                          }}
                        >
                          <td className="px-5 py-4">
                            <p
                              className="font-black"
                              style={{
                                color:
                                  active.accentColor,
                              }}
                            >
                              {order.orderNumber}
                            </p>

                            <p
                              className="mt-1 text-xs"
                              style={{
                                color:
                                  active.textColor,
                                opacity: 0.45,
                              }}
                            >
                              {order.items.reduce(
                                (
                                  sum,
                                  item,
                                ) =>
                                  sum +
                                  item.quantity,
                                0,
                              )}{' '}
                              items
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <p
                              className="font-bold"
                              style={{
                                color:
                                  active.textColor,
                              }}
                            >
                              {order.customer.name}
                            </p>

                            <p
                              className="mt-1 text-xs"
                              style={{
                                color:
                                  active.textColor,
                                opacity: 0.48,
                              }}
                            >
                              {order.customer.phone}
                            </p>
                          </td>

                          <td
                            className="px-5 py-4 font-black"
                            style={{
                              color:
                                active.textColor,
                            }}
                          >
                            {formatPKR(
                              order.total,
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <p
                              className="text-sm font-bold"
                              style={{
                                color:
                                  active.textColor,
                              }}
                            >
                              {formatPaymentMethod(
                                order.paymentMethod,
                              )}
                            </p>

                            <PaymentBadge
                              status={
                                order.paymentStatus
                              }
                            />
                          </td>

                          <td className="px-5 py-4">
                            <OrderStatusBadge
                              status={
                                order.status
                              }
                            />
                          </td>

                          <td
                            className="px-5 py-4 text-sm"
                            style={{
                              color:
                                active.textColor,
                              opacity: 0.58,
                            }}
                          >
                            {new Date(
                              order.createdAt,
                            ).toLocaleString(
                              'en-PK',
                              {
                                dateStyle:
                                  'medium',
                                timeStyle:
                                  'short',
                              },
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <ChevronRight
                              size={18}
                              style={{
                                color:
                                  active.accentColor,
                              }}
                            />
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </article>

          <aside className="space-y-5">
            <article
              className="rounded-3xl border p-6"
              style={{
                background:
                  'rgba(255,255,255,0.05)',
                borderColor: `${active.accentColor}25`,
              }}
            >
              <WalletCards
                size={23}
                style={{
                  color:
                    active.accentColor,
                }}
              />

              <h2
                className="mt-4 text-xl font-black"
                style={{
                  color:
                    active.textColor,
                  fontFamily:
                    'Anton, sans-serif',
                }}
              >
                Payments
              </h2>

              <div className="mt-5 space-y-3">
                <AdminMetric
                  label="Paid"
                  value={String(
                    analytics.paidOrders,
                  )}
                  textColor={
                    active.textColor
                  }
                />

                <AdminMetric
                  label="Cash on Delivery"
                  value={String(
                    analytics.cashOnDeliveryOrders,
                  )}
                  textColor={
                    active.textColor
                  }
                />

                <AdminMetric
                  label="Needs Verification"
                  value={String(
                    analytics.verificationRequired,
                  )}
                  textColor={
                    active.textColor
                  }
                  warning
                />
              </div>
            </article>

            <article
              className="rounded-3xl border p-6"
              style={{
                background:
                  'rgba(255,255,255,0.05)',
                borderColor: `${active.accentColor}25`,
              }}
            >
              <Users
                size={23}
                style={{
                  color:
                    active.accentColor,
                }}
              />

              <h2
                className="mt-4 text-xl font-black"
                style={{
                  color:
                    active.textColor,
                  fontFamily:
                    'Anton, sans-serif',
                }}
              >
                Repeat Customers
              </h2>

              <p
                className="mt-4 text-4xl font-black"
                style={{
                  color:
                    active.accentColor,
                  fontFamily:
                    'Anton, sans-serif',
                }}
              >
                {analytics.repeatCustomers}
              </p>

              <p
                className="mt-1 text-xs"
                style={{
                  color:
                    active.textColor,
                  opacity: 0.5,
                }}
              >
                Customers with more than
                one completed order.
              </p>
            </article>

            <article
              className="rounded-3xl border p-6"
              style={{
                background:
                  'rgba(255,255,255,0.05)',
                borderColor: `${active.accentColor}25`,
              }}
            >
              <AlertTriangle
                size={23}
                className="text-amber-400"
              />

              <h2
                className="mt-4 text-xl font-black"
                style={{
                  color:
                    active.textColor,
                  fontFamily:
                    'Anton, sans-serif',
                }}
              >
                Attention
              </h2>

              <div className="mt-4">
                <AdminMetric
                  label="Cancelled Orders"
                  value={String(
                    analytics.cancelledOrders,
                  )}
                  textColor={
                    active.textColor
                  }
                  warning={
                    analytics.cancelledOrders >
                    0
                  }
                />
              </div>

              <p
                className="mt-4 text-xs leading-relaxed"
                style={{
                  color:
                    active.textColor,
                  opacity: 0.52,
                }}
              >
                Easypaisa and JazzCash
                orders must be checked
                before marking payment as
                paid.
              </p>
            </article>
          </aside>
        </section>
      </main>

      {adminMenuOpen && (
        <>
          <button
            type="button"
            aria-label="Close admin menu"
            onClick={() =>
              setAdminMenuOpen(false)
            }
            className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm"
          />

          <aside
            className="fixed bottom-0 left-0 top-0 z-[100] flex w-full max-w-[390px] flex-col border-r shadow-2xl"
            style={{
              background:
                active.bgColor,
              borderColor: `${active.accentColor}35`,
            }}
          >
            <div
              className="flex items-center justify-between border-b p-5"
              style={{
                borderColor:
                  'rgba(255,255,255,0.08)',
              }}
            >
              <div>
                <p
                  className="text-xs font-bold uppercase tracking-[0.25em]"
                  style={{
                    color:
                      active.accentColor,
                  }}
                >
                  MFZ Management
                </p>

                <h2
                  className="mt-1 text-3xl font-black"
                  style={{
                    color:
                      active.textColor,
                    fontFamily:
                      'Anton, sans-serif',
                  }}
                >
                  Admin Menu
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setAdminMenuOpen(false)
                }
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                style={{
                  background:
                    'rgba(255,255,255,0.08)',
                  color:
                    active.textColor,
                }}
                aria-label="Close admin menu"
              >
                <X size={21} />
              </button>
            </div>

            <nav className="flex-1 space-y-3 overflow-y-auto p-5">
              <Link
                to="/admin"
                onClick={() =>
                  setAdminMenuOpen(false)
                }
                className="flex w-full items-center gap-3 rounded-2xl border px-5 py-4 text-sm font-black uppercase transition-transform hover:translate-x-1"
                style={{
                  background: `${active.accentColor}18`,
                  borderColor: `${active.accentColor}35`,
                  color:
                    active.accentColor,
                }}
              >
                <LayoutDashboard
                  size={18}
                />
                Dashboard
              </Link>

              <Link
                to="/admin/orders"
                onClick={() =>
                  setAdminMenuOpen(false)
                }
                className="flex w-full items-center gap-3 rounded-2xl border px-5 py-4 text-sm font-black uppercase transition-transform hover:translate-x-1"
                style={{
                  background:
                    'rgba(255,255,255,0.05)',
                  borderColor: `${active.textColor}18`,
                  color:
                    active.textColor,
                }}
              >
                <ShoppingBag size={18} />
                Orders
              </Link>
            </nav>
          </aside>
        </>
      )}
    </div>
  );
}

function AdminMetric({
  label,
  value,
  textColor,
  warning = false,
}: {
  label: string;
  value: string;
  textColor: string;
  warning?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        {warning && (
          <AlertTriangle
            size={15}
            className="text-amber-400"
          />
        )}

        <span
          className="text-sm"
          style={{
            color: textColor,
            opacity: 0.62,
          }}
        >
          {label}
        </span>
      </div>

      <span
        className="font-black"
        style={{
          color: warning
            ? '#fbbf24'
            : textColor,
        }}
      >
        {value}
      </span>
    </div>
  );
}

function OrderStatusBadge({
  status,
}: {
  status: OrderStatus;
}) {
  const styles: Record<
    OrderStatus,
    {
      background: string;
      color: string;
    }
  > = {
    pending: {
      background:
        'rgba(245,158,11,0.16)',
      color: '#fbbf24',
    },
    confirmed: {
      background:
        'rgba(59,130,246,0.16)',
      color: '#93c5fd',
    },
    processing: {
      background:
        'rgba(168,85,247,0.16)',
      color: '#d8b4fe',
    },
    ready: {
      background:
        'rgba(6,182,212,0.16)',
      color: '#67e8f9',
    },
    'out-for-delivery': {
      background:
        'rgba(249,115,22,0.16)',
      color: '#fdba74',
    },
    completed: {
      background:
        'rgba(34,197,94,0.16)',
      color: '#86efac',
    },
    cancelled: {
      background:
        'rgba(239,68,68,0.16)',
      color: '#fca5a5',
    },
  };

  return (
    <span
      className="inline-flex rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-wide"
      style={styles[status]}
    >
      {formatStatus(status)}
    </span>
  );
}

function PaymentBadge({
  status,
}: {
  status: PaymentStatus;
}) {
  const styles: Record<
    PaymentStatus,
    {
      background: string;
      color: string;
    }
  > = {
    unpaid: {
      background:
        'rgba(245,158,11,0.14)',
      color: '#fbbf24',
    },
    'verification-required': {
      background:
        'rgba(168,85,247,0.16)',
      color: '#d8b4fe',
    },
    paid: {
      background:
        'rgba(34,197,94,0.16)',
      color: '#86efac',
    },
    failed: {
      background:
        'rgba(239,68,68,0.16)',
      color: '#fca5a5',
    },
    refunded: {
      background:
        'rgba(59,130,246,0.16)',
      color: '#93c5fd',
    },
  };

  return (
    <span
      className="mt-1 inline-flex rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-wide"
      style={styles[status]}
    >
      {formatPaymentStatus(status)}
    </span>
  );
}