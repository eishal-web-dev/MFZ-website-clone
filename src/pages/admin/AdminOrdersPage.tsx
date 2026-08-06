import {
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  ShoppingBag,
} from 'lucide-react';
import {
  Menu,
  X,
  LayoutDashboard,
} from 'lucide-react';

import { Link } from 'react-router-dom';
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

interface Order {
  _id: string;
  orderNumber: string;

  customer: {
    name: string;
    phone: string;
    email?: string;
    address?: string;
  };

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

interface UpdateOrderApiResponse {
  success: boolean;
  order?: Order;
  message?: string;
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:5000/api';

const orderStatuses: OrderStatus[] = [
  'pending',
  'confirmed',
  'processing',
  'ready',
  'out-for-delivery',
  'completed',
  'cancelled',
];

const paymentStatuses: PaymentStatus[] = [
  'unpaid',
  'verification-required',
  'paid',
  'failed',
  'refunded',
];

function formatStatus(status: OrderStatus) {
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

export default function AdminOrdersPage() {
  const { activeProduct } = useTheme();
  const active = activeProduct;

  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrderId, setExpandedOrderId] =
    useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] =
    useState(false);

  const [updatingOrderId, setUpdatingOrderId] =
    useState<string | null>(null);

  const [error, setError] = useState('');
const [adminMenuOpen, setAdminMenuOpen] =
  useState(false);
  const fetchOrders = useCallback(
    async (manualRefresh = false) => {
      try {
        if (manualRefresh) {
          setRefreshing(true);
        }

        setError('');

        const token = localStorage.getItem(
          'mfz_auth_token',
        );

        const response = await fetch(
          `${API_BASE_URL}/orders`,
          {
            headers: {
              Accept: 'application/json',
              ...(token
                ? {
                    Authorization: `Bearer ${token}`,
                  }
                : {}),
            },
          },
        );

        const data =
          (await response.json()) as OrdersApiResponse;

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || 'Unable to load orders.',
          );
        }

        setOrders(data.orders ?? []);
      } catch (fetchError) {
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
  }, [fetchOrders]);

  const replaceUpdatedOrder = (
    updatedOrder: Order,
  ) => {
    setOrders((current) =>
      current.map((order) =>
        order._id === updatedOrder._id
          ? updatedOrder
          : order,
      ),
    );
  };

  const updateOrderStatus = async (
    orderId: string,
    status: OrderStatus,
  ) => {
    try {
      setUpdatingOrderId(orderId);
      setError('');

      const token = localStorage.getItem(
        'mfz_auth_token',
      );

      const response = await fetch(
        `${API_BASE_URL}/orders/${orderId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
          }),
        },
      );

      const data =
        (await response.json()) as UpdateOrderApiResponse;

      if (
        !response.ok ||
        !data.success ||
        !data.order
      ) {
        throw new Error(
          data.message ||
            'Unable to update order status.',
        );
      }

      replaceUpdatedOrder(data.order);
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : 'Unable to update order.',
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const updatePaymentStatus = async (
    orderId: string,
    paymentStatus: PaymentStatus,
  ) => {
    try {
      setUpdatingOrderId(orderId);
      setError('');

      const token = localStorage.getItem(
        'mfz_auth_token',
      );

      const response = await fetch(
        `${API_BASE_URL}/orders/${orderId}/payment`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            paymentStatus,
          }),
        },
      );

      const data =
        (await response.json()) as UpdateOrderApiResponse;

      if (
        !response.ok ||
        !data.success ||
        !data.order
      ) {
        throw new Error(
          data.message ||
            'Unable to update payment status.',
        );
      }

      replaceUpdatedOrder(data.order);
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : 'Unable to update payment.',
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: active.bgColor,
        paddingTop: 'var(--nav-h)',
      }}
    >
      <main className="mfz-container py-8 md:py-12">
<header className="mb-8 flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
  <div className="flex items-start gap-4">
    <button
      type="button"
      onClick={() => setAdminMenuOpen(true)}
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border transition-transform hover:scale-105"
      style={{
        background: `${active.accentColor}15`,
        borderColor: `${active.accentColor}55`,
        color: active.accentColor,
      }}
    >
      <Menu size={22} />
    </button>

    <div>
      <span
        className="text-xs font-bold uppercase tracking-[0.3em]"
        style={{
          color: active.accentColor,
        }}
      >
        MFZ Management
      </span>

      <h1
        className="mt-2 text-5xl font-black md:text-7xl"
        style={{
          color: active.textColor,
          fontFamily: 'Anton, sans-serif',
        }}
      >
        Orders
      </h1>

      <p
        className="mt-3 text-sm md:text-base"
        style={{
          color: active.textColor,
          opacity: 0.6,
        }}
      >
        Open an order to view its details and update order or payment status.
      </p>
    </div>
  </div>

  <button
    type="button"
    onClick={() => {
      void fetchOrders(true);
    }}
    disabled={refreshing}
    className="flex w-fit items-center gap-2 rounded-full border px-5 py-3 text-sm font-black uppercase"
    style={{
      color: active.accentColor,
      borderColor: `${active.accentColor}55`,
      background: `${active.accentColor}12`,
    }}
  >
    <RefreshCw
      size={17}
      className={refreshing ? 'animate-spin' : ''}
    />

    Refresh
  </button>
</header>

        {error && (
          <div className="mb-6 flex gap-3 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-red-200">
            <AlertTriangle size={20} />
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center">
            <RefreshCw
              className="mx-auto animate-spin"
              style={{
                color: active.accentColor,
              }}
            />
          </div>
        ) : orders.length === 0 ? (
          <div className="py-20 text-center">
            <ShoppingBag
              size={38}
              className="mx-auto"
              style={{
                color: active.accentColor,
              }}
            />

            <p
              className="mt-4 font-black"
              style={{
                color: active.textColor,
              }}
            >
              No orders yet
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const expanded =
                expandedOrderId === order._id;

              const updating =
                updatingOrderId === order._id;

              return (
                <article
                  key={order._id}
                  className="overflow-hidden rounded-3xl border"
                  style={{
                    background:
                      'rgba(255,255,255,0.05)',
                    borderColor: `${active.accentColor}25`,
                  }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedOrderId(
                        expanded ? null : order._id,
                      )
                    }
                    className="grid w-full gap-4 p-5 text-left md:grid-cols-[1.2fr_1fr_1fr_1fr_auto] md:items-center"
                  >
                    <div>
                      <p
                        className="font-black"
                        style={{
                          color: active.accentColor,
                        }}
                      >
                        {order.orderNumber}
                      </p>

                      <p
                        className="mt-1 text-sm"
                        style={{
                          color: active.textColor,
                          opacity: 0.5,
                        }}
                      >
                        {new Date(
                          order.createdAt,
                        ).toLocaleString('en-PK')}
                      </p>
                    </div>

                    <div>
                      <p
                        className="font-bold"
                        style={{
                          color: active.textColor,
                        }}
                      >
                        {order.customer.name}
                      </p>

                      <p
                        className="text-xs"
                        style={{
                          color: active.textColor,
                          opacity: 0.5,
                        }}
                      >
                        {order.customer.phone}
                      </p>
                    </div>

                    <div>
                      <p
                        className="font-black"
                        style={{
                          color: active.textColor,
                        }}
                      >
                        {formatPKR(order.total)}
                      </p>

                      <p
                        className="text-xs"
                        style={{
                          color: active.textColor,
                          opacity: 0.5,
                        }}
                      >
                        {formatPaymentMethod(
                          order.paymentMethod,
                        )}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span
                        className="rounded-full px-3 py-1 text-xs font-black uppercase"
                        style={{
                          color: active.accentColor,
                          background: `${active.accentColor}18`,
                        }}
                      >
                        {formatStatus(order.status)}
                      </span>

                      <span
                        className="rounded-full bg-white/5 px-3 py-1 text-xs font-black uppercase"
                        style={{
                          color: active.textColor,
                        }}
                      >
                        {formatPaymentStatus(
                          order.paymentStatus,
                        )}
                      </span>
                    </div>

                    {expanded ? (
                      <ChevronUp
                        style={{
                          color: active.accentColor,
                        }}
                      />
                    ) : (
                      <ChevronDown
                        style={{
                          color: active.accentColor,
                        }}
                      />
                    )}
                  </button>

                  {expanded && (
                    <div
                      className="border-t p-5"
                      style={{
                        borderColor:
                          'rgba(255,255,255,0.08)',
                      }}
                    >
                      <div className="grid gap-6 lg:grid-cols-2">
                        <section>
                          <h3
                            className="text-xl font-black"
                            style={{
                              color: active.textColor,
                              fontFamily:
                                'Anton, sans-serif',
                            }}
                          >
                            Customer Details
                          </h3>

                          <div className="mt-3 rounded-2xl bg-white/5 p-4">
                            <p
                              style={{
                                color: active.textColor,
                              }}
                            >
                              {order.customer.name}
                            </p>

                            <p
                              className="mt-1 text-sm"
                              style={{
                                color: active.textColor,
                                opacity: 0.6,
                              }}
                            >
                              {order.customer.phone}
                            </p>

                            {order.customer.address && (
                              <p
                                className="mt-3 text-sm"
                                style={{
                                  color:
                                    active.textColor,
                                  opacity: 0.6,
                                }}
                              >
                                {order.customer.address}
                              </p>
                            )}
                          </div>
                        </section>

                        <section>
                          <h3
                            className="text-xl font-black"
                            style={{
                              color: active.textColor,
                              fontFamily:
                                'Anton, sans-serif',
                            }}
                          >
                            Order Items
                          </h3>

                          <div className="mt-3 space-y-3">
                            {order.items.map(
                              (item, index) => (
                                <div
                                  key={`${item.productId}-${index}`}
                                  className="rounded-2xl bg-white/5 p-4"
                                >
                                  <div className="flex justify-between gap-4">
                                    <p
                                      className="font-bold"
                                      style={{
                                        color:
                                          active.textColor,
                                      }}
                                    >
                                      {item.quantity}×{' '}
                                      {item.name}
                                    </p>

                                    <p
                                      className="font-black"
                                      style={{
                                        color:
                                          active.accentColor,
                                      }}
                                    >
                                      {formatPKR(
                                        item.unitPrice *
                                          item.quantity,
                                      )}
                                    </p>
                                  </div>

                                  {item.filling && (
                                    <p
                                      className="mt-2 text-xs"
                                      style={{
                                        color:
                                          active.textColor,
                                        opacity: 0.55,
                                      }}
                                    >
                                      Filling: {item.filling}
                                    </p>
                                  )}

                                  {!!item.sauces?.length && (
                                    <p
                                      className="mt-1 text-xs"
                                      style={{
                                        color:
                                          active.textColor,
                                        opacity: 0.55,
                                      }}
                                    >
                                      Sauces:{' '}
                                      {item.sauces.join(', ')}
                                    </p>
                                  )}

                                  {!!item.extras?.length && (
                                    <p
                                      className="mt-1 text-xs"
                                      style={{
                                        color:
                                          active.textColor,
                                        opacity: 0.55,
                                      }}
                                    >
                                      Extras:{' '}
                                      {item.extras.join(', ')}
                                    </p>
                                  )}
                                </div>
                              ),
                            )}
                          </div>
                        </section>
                      </div>

                      <div className="mt-6 grid gap-6 lg:grid-cols-2">
                        <section>
                          <h3
                            className="text-xl font-black"
                            style={{
                              color: active.textColor,
                              fontFamily:
                                'Anton, sans-serif',
                            }}
                          >
                            Order Status
                          </h3>

                          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {orderStatuses.map((status) => (
                              <button
                                key={status}
                                type="button"
                                disabled={updating}
                                onClick={() => {
                                  void updateOrderStatus(
                                    order._id,
                                    status,
                                  );
                                }}
                                className="rounded-xl border px-3 py-3 text-xs font-black uppercase"
                                style={{
                                  background:
                                    order.status === status
                                      ? active.accentColor
                                      : 'rgba(255,255,255,0.05)',
                                  color:
                                    order.status === status
                                      ? active.onAccent
                                      : active.textColor,
                                  borderColor:
                                    order.status === status
                                      ? active.accentColor
                                      : `${active.textColor}16`,
                                }}
                              >
                                {formatStatus(status)}
                              </button>
                            ))}
                          </div>
                        </section>

                        <section>
                          <h3
                            className="text-xl font-black"
                            style={{
                              color: active.textColor,
                              fontFamily:
                                'Anton, sans-serif',
                            }}
                          >
                            Payment Status
                          </h3>

                          <div className="mt-3 grid grid-cols-2 gap-2">
                            {paymentStatuses.map(
                              (paymentStatus) => (
                                <button
                                  key={paymentStatus}
                                  type="button"
                                  disabled={updating}
                                  onClick={() => {
                                    void updatePaymentStatus(
                                      order._id,
                                      paymentStatus,
                                    );
                                  }}
                                  className="rounded-xl border px-3 py-3 text-xs font-black uppercase"
                                  style={{
                                    background:
                                      order.paymentStatus ===
                                      paymentStatus
                                        ? active.accentColor
                                        : 'rgba(255,255,255,0.05)',
                                    color:
                                      order.paymentStatus ===
                                      paymentStatus
                                        ? active.onAccent
                                        : active.textColor,
                                    borderColor:
                                      order.paymentStatus ===
                                      paymentStatus
                                        ? active.accentColor
                                        : `${active.textColor}16`,
                                  }}
                                >
                                  {formatPaymentStatus(
                                    paymentStatus,
                                  )}
                                </button>
                              ),
                            )}
                          </div>
                        </section>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </main>
      {adminMenuOpen && (
  <>
    <button
      type="button"
      onClick={() => setAdminMenuOpen(false)}
      className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm"
    />

    <aside
      className="fixed bottom-0 left-0 top-0 z-[100] flex w-full max-w-[390px] flex-col border-r shadow-2xl"
      style={{
        background: active.bgColor,
        borderColor: `${active.accentColor}35`,
      }}
    >
      <div
        className="flex items-center justify-between border-b p-5"
        style={{
          borderColor: 'rgba(255,255,255,0.08)',
        }}
      >
        <div>
          <p
            className="text-xs font-bold uppercase tracking-[0.25em]"
            style={{
              color: active.accentColor,
            }}
          >
            MFZ Management
          </p>

          <h2
            className="mt-1 text-3xl font-black"
            style={{
              color: active.textColor,
              fontFamily: 'Anton, sans-serif',
            }}
          >
            Admin Menu
          </h2>
        </div>

        <button
          onClick={() => setAdminMenuOpen(false)}
          className="flex h-11 w-11 items-center justify-center rounded-full"
          style={{
            background: 'rgba(255,255,255,0.08)',
            color: active.textColor,
          }}
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 space-y-3 p-5">
        <Link
          to="/admin"
          onClick={() => setAdminMenuOpen(false)}
          className="flex items-center gap-3 rounded-2xl border px-5 py-4 font-black uppercase"
          style={{
            background: `${active.accentColor}18`,
            borderColor: `${active.accentColor}35`,
            color: active.accentColor,
          }}
        >
          <LayoutDashboard size={18} />
          Dashboard
        </Link>

        <Link
          to="/admin/orders"
          onClick={() => setAdminMenuOpen(false)}
          className="flex items-center gap-3 rounded-2xl border px-5 py-4 font-black uppercase"
          style={{
            background: 'rgba(255,255,255,0.05)',
            borderColor: `${active.textColor}18`,
            color: active.textColor,
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