import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from 'react';
import { Link } from 'react-router-dom';
import {
  Check,
  MapPin,
  MessageCircle,
  Minus,
  Plus,
  Store,
  Trash2,
  Truck,
} from 'lucide-react';

import { useTheme } from '@/context/ThemeContext';
import {
  cartItemKey,
  useCart,
} from '@/context/CartContext';
import { useDeliveryLocation } from '@/context/LocationContext';
import { formatPKR } from '@/data/menu';
import { branches } from '@/data/branches';
import { Footer } from '@/components/Footer';
import { OrderPlacedAnimation } from '@/components/OrderPlacedAnimation';

const MFZ_WHATSAPP_NUMBER = '923051880355';
const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

type OrderMode = 'delivery' | 'pickup';
type PaymentMethod = 'cod' | 'card' | 'easypaisa' | 'jazzcash';

interface CheckoutForm {
  name: string;
  phone: string;
  address: string;
  branch: string;
  instructions: string;
}

const paymentMethods: Array<{
  id: PaymentMethod;
  label: string;
  available: boolean;
}> = [
  { id: 'cod', label: 'Cash on Delivery', available: true },
  { id: 'card', label: 'Card — Coming Soon', available: false },
  { id: 'easypaisa', label: 'Easypaisa — Coming Soon', available: false },
  { id: 'jazzcash', label: 'JazzCash — Coming Soon', available: false },
];

const orderBranches = branches.filter((branch) => branch.delivery);

export default function CheckoutLocationPage() {
  const { activeProduct } = useTheme();
  const {
    items,
    total,
    clear,
    remove,
    updateQty,
  } = useCart();
  const {
    deliveryLocation,
    selectedBranch,
    formattedAddress,
    openSelector,
  } = useDeliveryLocation();

  const active = activeProduct;
  const [mode, setMode] = useState<OrderMode>('delivery');
  const [payment, setPayment] = useState<PaymentMethod>('cod');
  const [form, setForm] = useState<CheckoutForm>(() => ({
    name: '',
    phone: '',
    address: formattedAddress,
    branch: selectedBranch?.name ?? orderBranches[0]?.name ?? '',
    instructions: deliveryLocation?.deliveryNotes ?? '',
  }));
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderNumber, setPlacedOrderNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    setForm((current) => ({
      ...current,
      address: formattedAddress || current.address,
      branch: selectedBranch?.name ?? current.branch,
      instructions:
        deliveryLocation?.deliveryNotes || current.instructions,
    }));
  }, [deliveryLocation, formattedAddress, selectedBranch]);

  const updateForm = (
    field: keyof CheckoutForm,
    value: string,
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const whatsappMessage = useMemo(() => {
    const orderLines = items.flatMap((item) => {
      const custom = [
        item.filling ? `   Filling: ${item.filling}` : '',
        item.sauces?.length
          ? `   Sauces: ${item.sauces.join(', ')}`
          : '',
        item.extras?.length
          ? `   Extras: ${item.extras.join(', ')}`
          : '',
      ].filter(Boolean);

      return [
        `${item.quantity}× ${item.name} — ${formatPKR(
          item.price * item.quantity,
        )}`,
        ...custom,
      ];
    });

    return encodeURIComponent(
      [
        'Assalamualaikum MFZ,',
        '',
        'I would like to place an order:',
        '',
        ...orderLines,
        '',
        `Total: ${formatPKR(total)}`,
        `Order type: ${mode === 'delivery' ? 'Delivery' : 'Pickup'}`,
        mode === 'delivery'
          ? `Delivery address: ${form.address || 'Not entered yet'}`
          : `Pickup branch: ${form.branch || 'Not selected yet'}`,
        `Serving branch: ${form.branch || 'Not selected yet'}`,
        `Customer: ${form.name || 'Not entered yet'}`,
        `Phone: ${form.phone || 'Not entered yet'}`,
        form.instructions
          ? `Instructions: ${form.instructions}`
          : '',
      ]
        .filter(Boolean)
        .join('\n'),
    );
  }, [form, items, mode, total]);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setSubmitError('');

    if (!items.length || !form.name.trim() || !form.phone.trim()) return;
    if (mode === 'delivery' && !form.address.trim()) return;
    if (!form.branch) return;

    setSubmitting(true);

    try {
      const response = await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            name: form.name.trim(),
            phone: form.phone.trim(),
            address: mode === 'delivery' ? form.address.trim() : '',
          },
          items: items.map((item) => ({
            productId: item.id,
            name: item.name,
            quantity: item.quantity,
            unitPrice: item.price,
            filling: item.filling,
            sauces: item.sauces,
            extras: item.extras,
          })),
          orderType: mode,
          branchName: form.branch,
          subtotal: total,
          deliveryFee: 0,
          total,
          paymentMethod:
            payment === 'cod' ? 'cash-on-delivery' : payment,
          customerNotes: form.instructions,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to place order.');
      }

      setPlacedOrderNumber(data.order?.orderNumber ?? 'MFZ-ORDER');
      setOrderPlaced(true);
      clear();
    } catch (error) {
      console.error(error);
      setSubmitError(
        'Online order service is unavailable right now. You can still send this order to MFZ on WhatsApp below.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div
        className="min-h-screen"
        style={{
          background: active.bgColor,
          color: active.textColor,
          paddingTop: 'var(--nav-h)',
        }}
      >
        <main className="mfz-container flex min-h-[72vh] items-center justify-center py-16 text-center">
          <div className="max-w-md">
            <div
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-full"
              style={{
                background: `${active.accentColor}18`,
                color: active.accentColor,
              }}
            >
              <Store size={34} />
            </div>
            <h1
              className="mt-6 text-4xl font-black uppercase sm:text-5xl"
              style={{ fontFamily: 'Anton, sans-serif' }}
            >
              Your cart is empty
            </h1>
            <p className="mt-3 text-sm leading-6 opacity-55">
              Your saved delivery location is ready. Add your favourites and we’ll route the order to the right MFZ branch.
            </p>
            <Link
              to="/menu"
              className="mt-7 inline-flex rounded-full px-7 py-3.5 text-sm font-black uppercase"
              style={{
                background: active.accentColor,
                color: active.onAccent,
              }}
            >
              Browse Menu
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: active.bgColor,
        color: active.textColor,
        paddingTop: 'var(--nav-h)',
      }}
    >
      <main className="pb-20">
        <div className="mfz-container max-w-[1180px]">
          <header className="pb-8 pt-10 md:pb-10 md:pt-14">
            <span
              className="text-[10px] font-black uppercase tracking-[0.34em]"
              style={{ color: active.accentColor }}
            >
              MFZ Smart Checkout
            </span>
            <h1
              className="mt-2 text-5xl font-black uppercase leading-none md:text-7xl"
              style={{ fontFamily: 'Anton, sans-serif' }}
            >
              Checkout
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 opacity-55 md:text-base">
              Your saved area automatically chooses the MFZ branch serving you. You can change it anytime.
            </p>
          </header>

          <div className="grid gap-8 lg:grid-cols-[1.08fr_.92fr]">
            <form onSubmit={handleSubmit} className="space-y-6">
              <section>
                <div className="mb-3 text-[10px] font-black uppercase tracking-[0.23em] opacity-50">
                  Order type
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {([
                    ['delivery', 'Delivery', Truck],
                    ['pickup', 'Pickup', Store],
                  ] as const).map(([id, label, Icon]) => {
                    const selected = mode === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setMode(id)}
                        className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border text-sm font-black uppercase transition hover:-translate-y-0.5"
                        style={{
                          background: selected
                            ? active.accentColor
                            : 'rgba(255,255,255,.055)',
                          color: selected
                            ? active.onAccent
                            : active.textColor,
                          borderColor: selected
                            ? active.accentColor
                            : `${active.textColor}15`,
                        }}
                      >
                        <Icon size={22} />
                        {label}
                      </button>
                    );
                  })}
                </div>
              </section>

              {mode === 'delivery' && (
                <section
                  className="rounded-3xl border p-5 sm:p-6"
                  style={{
                    background: `${active.accentColor}0c`,
                    borderColor: `${active.accentColor}34`,
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3">
                      <span
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
                        style={{
                          background: active.accentColor,
                          color: active.onAccent,
                        }}
                      >
                        <MapPin size={20} />
                      </span>
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-45">
                          Delivering to
                        </div>
                        <div className="mt-1 text-lg font-black">
                          {deliveryLocation?.areaName ?? 'Choose delivery area'}
                        </div>
                        <div className="mt-1 text-xs leading-5 opacity-50">
                          {form.address || 'No saved address yet'}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={openSelector}
                      className="shrink-0 rounded-full border px-3 py-2 text-[10px] font-black uppercase tracking-wider"
                      style={{
                        color: active.accentColor,
                        borderColor: `${active.accentColor}55`,
                      }}
                    >
                      Change
                    </button>
                  </div>

                  <div className="mt-4 flex items-center gap-2 border-t pt-4 text-xs" style={{ borderColor: `${active.textColor}12` }}>
                    <Store size={15} style={{ color: active.accentColor }} />
                    <span className="opacity-50">Serving branch:</span>
                    <strong>{form.branch || 'Select location first'}</strong>
                  </div>
                </section>
              )}

              {mode === 'pickup' && (
                <section>
                  <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.22em] opacity-50">
                    Pickup branch
                  </label>
                  <select
                    required
                    value={form.branch}
                    onChange={(event) => updateForm('branch', event.target.value)}
                    className="w-full rounded-2xl border px-4 py-4 outline-none"
                    style={{
                      background: 'rgba(255,255,255,.06)',
                      color: active.textColor,
                      borderColor: `${active.textColor}18`,
                    }}
                  >
                    {orderBranches.map((branch) => (
                      <option
                        key={branch.id}
                        value={branch.name}
                        style={{ background: active.bgColor }}
                      >
                        {branch.name} — {branch.area}
                      </option>
                    ))}
                  </select>
                </section>
              )}

              <section
                className="space-y-4 rounded-3xl border p-5 sm:p-6"
                style={{
                  background: 'rgba(255,255,255,.04)',
                  borderColor: `${active.textColor}12`,
                }}
              >
                <h2
                  className="text-2xl font-black uppercase"
                  style={{ fontFamily: 'Anton, sans-serif' }}
                >
                  Your details
                </h2>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label>
                    <span className="mb-2 block text-[10px] font-black uppercase tracking-widest opacity-50">
                      Name
                    </span>
                    <input
                      required
                      value={form.name}
                      onChange={(event) => updateForm('name', event.target.value)}
                      autoComplete="name"
                      placeholder="Your full name"
                      className="w-full rounded-2xl border px-4 py-3.5 outline-none"
                      style={{
                        background: 'rgba(255,255,255,.06)',
                        color: active.textColor,
                        borderColor: `${active.textColor}16`,
                      }}
                    />
                  </label>

                  <label>
                    <span className="mb-2 block text-[10px] font-black uppercase tracking-widest opacity-50">
                      Phone
                    </span>
                    <input
                      required
                      type="tel"
                      value={form.phone}
                      onChange={(event) => updateForm('phone', event.target.value)}
                      autoComplete="tel"
                      placeholder="+92 3XX XXXXXXX"
                      className="w-full rounded-2xl border px-4 py-3.5 outline-none"
                      style={{
                        background: 'rgba(255,255,255,.06)',
                        color: active.textColor,
                        borderColor: `${active.textColor}16`,
                      }}
                    />
                  </label>
                </div>

                {mode === 'delivery' && (
                  <label className="block">
                    <span className="mb-2 block text-[10px] font-black uppercase tracking-widest opacity-50">
                      Delivery address
                    </span>
                    <textarea
                      required
                      rows={3}
                      value={form.address}
                      onChange={(event) => updateForm('address', event.target.value)}
                      className="w-full resize-none rounded-2xl border px-4 py-3.5 outline-none"
                      style={{
                        background: 'rgba(255,255,255,.06)',
                        color: active.textColor,
                        borderColor: `${active.textColor}16`,
                      }}
                    />
                  </label>
                )}

                <label className="block">
                  <span className="mb-2 block text-[10px] font-black uppercase tracking-widest opacity-50">
                    Special instructions
                  </span>
                  <input
                    value={form.instructions}
                    onChange={(event) => updateForm('instructions', event.target.value)}
                    placeholder="Optional"
                    className="w-full rounded-2xl border px-4 py-3.5 outline-none"
                    style={{
                      background: 'rgba(255,255,255,.06)',
                      color: active.textColor,
                      borderColor: `${active.textColor}16`,
                    }}
                  />
                </label>
              </section>

              <section>
                <div className="mb-3 text-[10px] font-black uppercase tracking-[0.23em] opacity-50">
                  Payment method
                </div>
                <div className="space-y-2">
                  {paymentMethods.map((method) => {
                    const selected = payment === method.id;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        disabled={!method.available}
                        onClick={() => method.available && setPayment(method.id)}
                        className="flex w-full items-center justify-between rounded-2xl border px-4 py-3.5 text-left text-sm font-black transition enabled:hover:translate-x-1 disabled:cursor-not-allowed disabled:opacity-35"
                        style={{
                          background: selected
                            ? active.accentColor
                            : 'rgba(255,255,255,.05)',
                          color: selected
                            ? active.onAccent
                            : active.textColor,
                          borderColor: selected
                            ? active.accentColor
                            : `${active.textColor}13`,
                        }}
                      >
                        {method.label}
                        {selected && <Check size={17} />}
                      </button>
                    );
                  })}
                </div>
              </section>

              {submitError && (
                <div
                  className="rounded-2xl border p-4 text-sm leading-6"
                  style={{
                    background: `${active.accentColor}0d`,
                    borderColor: `${active.accentColor}38`,
                  }}
                >
                  {submitError}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-full py-4 text-base font-black uppercase transition hover:scale-[1.015] disabled:cursor-wait disabled:opacity-55"
                style={{
                  background: active.accentColor,
                  color: active.onAccent,
                }}
              >
                {submitting ? 'Placing Order...' : 'Place Order'}
              </button>

              <a
                href={`https://wa.me/${MFZ_WHATSAPP_NUMBER}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] py-4 text-base font-black uppercase text-white transition hover:scale-[1.015]"
              >
                <MessageCircle size={19} />
                Send Order on WhatsApp
              </a>
            </form>

            <aside>
              <div
                className="sticky rounded-3xl border p-5 sm:p-6 lg:top-[calc(var(--nav-h)+28px)]"
                style={{
                  background: 'rgba(255,255,255,.045)',
                  borderColor: `${active.textColor}12`,
                }}
              >
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.24em] opacity-45">
                      Your order
                    </div>
                    <h2
                      className="mt-1 text-3xl font-black uppercase"
                      style={{ fontFamily: 'Anton, sans-serif' }}
                    >
                      Crunch list
                    </h2>
                  </div>
                  <div className="text-right text-sm opacity-45">
                    {items.reduce((sum, item) => sum + item.quantity, 0)} items
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {items.map((item) => {
                    const key = cartItemKey(item);
                    return (
                      <div
                        key={key}
                        className="rounded-2xl border p-4"
                        style={{ borderColor: `${active.textColor}10` }}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="font-black">{item.name}</div>
                            <div className="mt-1 text-xs opacity-45">
                              {item.filling || 'MFZ original'}
                            </div>
                          </div>
                          <strong style={{ color: active.accentColor }}>
                            {formatPKR(item.price * item.quantity)}
                          </strong>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => updateQty(key, item.quantity - 1)}
                              className="flex h-8 w-8 items-center justify-center rounded-full border"
                              style={{ borderColor: `${active.textColor}18` }}
                            >
                              <Minus size={13} />
                            </button>
                            <span className="min-w-6 text-center text-sm font-black">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQty(key, item.quantity + 1)}
                              className="flex h-8 w-8 items-center justify-center rounded-full border"
                              style={{ borderColor: `${active.textColor}18` }}
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => remove(key)}
                            className="opacity-35 transition hover:opacity-100"
                            aria-label={`Remove ${item.name}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 border-t pt-5" style={{ borderColor: `${active.textColor}14` }}>
                  <div className="flex items-center justify-between text-sm opacity-55">
                    <span>Subtotal</span>
                    <span>{formatPKR(total)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm opacity-55">
                    <span>Delivery</span>
                    <span>{mode === 'delivery' ? 'Calculated by branch' : 'Pickup'}</span>
                  </div>
                  <div className="mt-5 flex items-end justify-between">
                    <span className="font-black uppercase">Total</span>
                    <strong
                      className="text-3xl"
                      style={{
                        color: active.accentColor,
                        fontFamily: 'Anton, sans-serif',
                      }}
                    >
                      {formatPKR(total)}
                    </strong>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />

      <OrderPlacedAnimation
        open={orderPlaced}
        orderNumber={placedOrderNumber}
        customerName={form.name}
        orderType={mode}
        onClose={() => setOrderPlaced(false)}
      />
    </div>
  );
}
