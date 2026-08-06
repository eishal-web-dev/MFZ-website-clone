import {
  useMemo,
  useState,
  type FormEvent,
} from 'react';
import { Link } from 'react-router-dom';
import {
  Check,
  MessageCircle,
  Store,
  Truck,
} from 'lucide-react';

import { useTheme } from '@/context/ThemeContext';
import {
  cartItemKey,
  useCart,
} from '@/context/CartContext';
import { formatPKR } from '@/data/menu';
import { branches } from '@/data/branches';
import { Footer } from '@/components/Footer';
import { OrderPlacedAnimation } from '@/components/OrderPlacedAnimation';

const MFZ_WHATSAPP_NUMBER = '923051880355';

type OrderMode = 'delivery' | 'pickup';

type PaymentMethod =
  | 'cod'
  | 'card'
  | 'easypaisa'
  | 'jazzcash';

interface CheckoutForm {
  name: string;
  phone: string;
  address: string;
  branch: string;
  instructions: string;
}

const initialForm: CheckoutForm = {
  name: '',
  phone: '',
  address: '',
  branch: branches[0]?.name ?? '',
  instructions: '',
};

const paymentMethods: Array<{
  id: PaymentMethod;
  label: string;
  available: boolean;
}> = [
  {
    id: 'cod',
    label: 'Cash on Delivery',
    available: true,
  },
  {
    id: 'card',
    label: 'Card — Coming Soon',
    available: false,
  },
  {
    id: 'easypaisa',
    label: 'Easypaisa — Coming Soon',
    available: false,
  },
  {
    id: 'jazzcash',
    label: 'JazzCash — Coming Soon',
    available: false,
  },
];

export default function CheckoutPage() {
  const { activeProduct } = useTheme();
  const { items, total, clear } = useCart();

  const active = activeProduct;

  const [mode, setMode] =
    useState<OrderMode>('delivery');

  const [payment, setPayment] =
    useState<PaymentMethod>('cod');

  const [form, setForm] =
    useState<CheckoutForm>(initialForm);

  const [orderPlaced, setOrderPlaced] =
    useState(false);

  const [
    placedOrderNumber,
    setPlacedOrderNumber,
  ] = useState('');

  const updateForm = (
    field: keyof CheckoutForm,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const whatsappMessage = useMemo(() => {
    const orderLines = items.map((item) => {
      const details = [
        item.filling,
        item.sauces?.length
          ? `Sauces: ${item.sauces.join(', ')}`
          : '',
        item.extras?.length
          ? `Extras: ${item.extras.join(', ')}`
          : '',
      ].filter(Boolean);

      return [
        `${item.quantity}× ${item.name} — ${formatPKR(
          item.price * item.quantity,
        )}`,
        ...details.map((detail) => `   ${detail}`),
      ].join('\n');
    });

    const fulfilmentDetails =
      mode === 'delivery'
        ? `Delivery address: ${
            form.address.trim() ||
            'Not entered yet'
          }`
        : `Pickup branch: ${
            form.branch ||
            'Not selected yet'
          }`;

    return encodeURIComponent(
      [
        'Assalamualaikum MFZ,',
        '',
        'I would like to place an order:',
        '',
        ...orderLines,
        '',
        `Total: ${formatPKR(total)}`,
        `Order type: ${
          mode === 'delivery'
            ? 'Delivery'
            : 'Pickup'
        }`,
        fulfilmentDetails,
        `Customer: ${
          form.name.trim() ||
          'Not entered yet'
        }`,
        `Phone: ${
          form.phone.trim() ||
          'Not entered yet'
        }`,
        form.instructions.trim()
          ? `Instructions: ${form.instructions.trim()}`
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

if (items.length === 0) return;

if (
  mode === 'delivery' &&
  !form.address.trim()
) {
  return;
}

if (
  mode === 'pickup' &&
  !form.branch
) {
  return;
}

try {
  const response = await fetch(
    'http://localhost:5000/api/orders',
    {
      method: 'POST',
      headers: {
        'Content-Type':
          'application/json',
      },
      body: JSON.stringify({
        customer: {
          name: form.name,
          phone: form.phone,
          address: form.address,
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

        branchName:
          mode === 'pickup'
            ? form.branch
            : '',

        subtotal: total,

        deliveryFee: 0,

        total,

        paymentMethod:
          payment === 'cod'
            ? 'cash-on-delivery'
            : payment,

        customerNotes:
          form.instructions,
      }),
    },
  );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        'Unable to place order.',
    );
  }

  setPlacedOrderNumber(
    data.order.orderNumber,
  );

  setOrderPlaced(true);

  clear();
} catch (error) {
  console.error(error);

  alert(
    'Unable to place order.',
  );
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
      <main className="pb-20">
        <div
          className="mfz-container"
          style={{
            maxWidth: '1100px',
          }}
        >
          <header className="mb-8 pt-8 md:pt-12">
            <span
              className="text-xs font-bold uppercase tracking-[0.3em]"
              style={{
                color: active.accentColor,
              }}
            >
              Complete Your Order
            </span>

            <h1
              className="mt-2 text-5xl font-black leading-none md:text-7xl"
              style={{
                color: active.textColor,
                fontFamily: 'Anton, sans-serif',
              }}
            >
              Checkout
            </h1>

            <p
              className="mt-3 max-w-xl text-sm leading-relaxed md:text-base"
              style={{
                color: active.textColor,
                opacity: 0.62,
              }}
            >
              Review your order, choose delivery or
              pickup and enter your contact details.
            </p>
          </header>

          {items.length === 0 ? (
            <section className="py-20 text-center">
              <div
                className="
                  mx-auto
                  flex
                  h-20
                  w-20
                  items-center
                  justify-center
                  rounded-full
                "
                style={{
                  background: `${active.accentColor}18`,
                  color: active.accentColor,
                }}
              >
                <Store size={34} />
              </div>

              <h2
                className="mt-6 text-3xl font-black"
                style={{
                  color: active.textColor,
                  fontFamily: 'Anton, sans-serif',
                }}
              >
                Your Cart Is Empty
              </h2>

              <p
                className="mt-2 text-sm"
                style={{
                  color: active.textColor,
                  opacity: 0.58,
                }}
              >
                Add your favourite MFZ items before
                continuing to checkout.
              </p>

              <Link
                to="/menu"
                className="
                  mt-6
                  inline-flex
                  rounded-full
                  px-7
                  py-3
                  font-black
                  uppercase
                  transition-transform
                  hover:scale-[1.03]
                "
                style={{
                  background: active.accentColor,
                  color: active.onAccent,
                }}
              >
                Browse Menu
              </Link>
            </section>
          ) : (
            <div className="grid gap-8 lg:grid-cols-2">
              <form
                onSubmit={handleSubmit}
                className="space-y-7"
              >
                {/* Delivery or pickup */}
                <section>
                  <label
                    className="
                      mb-3
                      block
                      text-xs
                      font-bold
                      uppercase
                      tracking-widest
                    "
                    style={{
                      color: active.textColor,
                      opacity: 0.62,
                    }}
                  >
                    How would you like your order?
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setMode('delivery')
                      }
                      className="
                        flex
                        min-h-24
                        flex-col
                        items-center
                        justify-center
                        gap-2
                        rounded-2xl
                        border
                        font-bold
                        transition-all
                        hover:scale-[1.02]
                      "
                      style={{
                        background:
                          mode === 'delivery'
                            ? active.accentColor
                            : 'rgba(255,255,255,0.07)',
                        color:
                          mode === 'delivery'
                            ? active.onAccent
                            : active.textColor,
                        borderColor:
                          mode === 'delivery'
                            ? active.accentColor
                            : `${active.textColor}18`,
                      }}
                    >
                      <Truck size={22} />
                      Delivery
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setMode('pickup')
                      }
                      className="
                        flex
                        min-h-24
                        flex-col
                        items-center
                        justify-center
                        gap-2
                        rounded-2xl
                        border
                        font-bold
                        transition-all
                        hover:scale-[1.02]
                      "
                      style={{
                        background:
                          mode === 'pickup'
                            ? active.accentColor
                            : 'rgba(255,255,255,0.07)',
                        color:
                          mode === 'pickup'
                            ? active.onAccent
                            : active.textColor,
                        borderColor:
                          mode === 'pickup'
                            ? active.accentColor
                            : `${active.textColor}18`,
                      }}
                    >
                      <Store size={22} />
                      Pickup
                    </button>
                  </div>
                </section>

                {/* Customer information */}
                <section
                  className="space-y-5 rounded-3xl border p-6"
                  style={{
                    background:
                      'rgba(255,255,255,0.05)',
                    borderColor: `${active.accentColor}22`,
                  }}
                >
                  <h2
                    className="text-2xl font-black"
                    style={{
                      color: active.textColor,
                      fontFamily:
                        'Anton, sans-serif',
                    }}
                  >
                    Customer Details
                  </h2>

                  <div>
                    <label
                      htmlFor="checkout-name"
                      className="
                        mb-2
                        block
                        text-xs
                        font-bold
                        uppercase
                        tracking-widest
                      "
                      style={{
                        color: active.textColor,
                        opacity: 0.62,
                      }}
                    >
                      Name
                    </label>

                    <input
                      id="checkout-name"
                      required
                      type="text"
                      value={form.name}
                      onChange={(event) =>
                        updateForm(
                          'name',
                          event.target.value,
                        )
                      }
                      autoComplete="name"
                      placeholder="Your full name"
                      className="
                        w-full
                        rounded-xl
                        px-4
                        py-3.5
                        outline-none
                        placeholder:opacity-35
                      "
                      style={{
                        background:
                          'rgba(255,255,255,0.08)',
                        color: active.textColor,
                        border: `1px solid ${active.accentColor}33`,
                      }}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="checkout-phone"
                      className="
                        mb-2
                        block
                        text-xs
                        font-bold
                        uppercase
                        tracking-widest
                      "
                      style={{
                        color: active.textColor,
                        opacity: 0.62,
                      }}
                    >
                      Phone
                    </label>

                    <input
                      id="checkout-phone"
                      required
                      type="tel"
                      value={form.phone}
                      onChange={(event) =>
                        updateForm(
                          'phone',
                          event.target.value,
                        )
                      }
                      autoComplete="tel"
                      placeholder="+92 3XX XXXXXXX"
                      className="
                        w-full
                        rounded-xl
                        px-4
                        py-3.5
                        outline-none
                        placeholder:opacity-35
                      "
                      style={{
                        background:
                          'rgba(255,255,255,0.08)',
                        color: active.textColor,
                        border: `1px solid ${active.accentColor}33`,
                      }}
                    />
                  </div>

                  {mode === 'pickup' ? (
                    <div>
                      <label
                        htmlFor="checkout-branch"
                        className="
                          mb-2
                          block
                          text-xs
                          font-bold
                          uppercase
                          tracking-widest
                        "
                        style={{
                          color: active.textColor,
                          opacity: 0.62,
                        }}
                      >
                        Pickup Branch
                      </label>

                      <select
                        id="checkout-branch"
                        required
                        value={form.branch}
                        onChange={(event) =>
                          updateForm(
                            'branch',
                            event.target.value,
                          )
                        }
                        className="
                          w-full
                          rounded-xl
                          px-4
                          py-3.5
                          outline-none
                        "
                        style={{
                          background:
                            'rgba(255,255,255,0.08)',
                          color: active.textColor,
                          border: `1px solid ${active.accentColor}33`,
                        }}
                      >
                        {branches.map((branch) => (
                          <option
                            key={branch.id}
                            value={branch.name}
                            style={{
                              background:
                                active.bgColor,
                            }}
                          >
                            {branch.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label
                        htmlFor="checkout-address"
                        className="
                          mb-2
                          block
                          text-xs
                          font-bold
                          uppercase
                          tracking-widest
                        "
                        style={{
                          color: active.textColor,
                          opacity: 0.62,
                        }}
                      >
                        Delivery Address
                      </label>

                      <textarea
                        id="checkout-address"
                        required
                        rows={3}
                        value={form.address}
                        onChange={(event) =>
                          updateForm(
                            'address',
                            event.target.value,
                          )
                        }
                        autoComplete="street-address"
                        placeholder="House, street, area and nearby landmark"
                        className="
                          w-full
                          resize-none
                          rounded-xl
                          px-4
                          py-3.5
                          outline-none
                          placeholder:opacity-35
                        "
                        style={{
                          background:
                            'rgba(255,255,255,0.08)',
                          color: active.textColor,
                          border: `1px solid ${active.accentColor}33`,
                        }}
                      />
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="checkout-instructions"
                      className="
                        mb-2
                        block
                        text-xs
                        font-bold
                        uppercase
                        tracking-widest
                      "
                      style={{
                        color: active.textColor,
                        opacity: 0.62,
                      }}
                    >
                      Special Instructions
                    </label>

                    <input
                      id="checkout-instructions"
                      type="text"
                      value={form.instructions}
                      onChange={(event) =>
                        updateForm(
                          'instructions',
                          event.target.value,
                        )
                      }
                      placeholder="Optional"
                      className="
                        w-full
                        rounded-xl
                        px-4
                        py-3.5
                        outline-none
                        placeholder:opacity-35
                      "
                      style={{
                        background:
                          'rgba(255,255,255,0.08)',
                        color: active.textColor,
                        border: `1px solid ${active.accentColor}33`,
                      }}
                    />
                  </div>
                </section>

                {/* Payment */}
                <section>
                  <label
                    className="
                      mb-3
                      block
                      text-xs
                      font-bold
                      uppercase
                      tracking-widest
                    "
                    style={{
                      color: active.textColor,
                      opacity: 0.62,
                    }}
                  >
                    Payment Method
                  </label>

                  <div className="space-y-2">
                    {paymentMethods.map(
                      (method) => {
                        const isSelected =
                          payment === method.id;

                        return (
                          <button
                            key={method.id}
                            type="button"
                            disabled={
                              !method.available
                            }
                            onClick={() => {
                              if (
                                method.available
                              ) {
                                setPayment(
                                  method.id,
                                );
                              }
                            }}
                            className="
                              flex
                              w-full
                              items-center
                              justify-between
                              rounded-xl
                              border
                              px-4
                              py-3.5
                              text-left
                              text-sm
                              font-bold
                              transition-all
                              enabled:hover:translate-x-1
                              disabled:cursor-not-allowed
                              disabled:opacity-45
                            "
                            style={{
                              background:
                                isSelected
                                  ? active.accentColor
                                  : 'rgba(255,255,255,0.07)',
                              color: isSelected
                                ? active.onAccent
                                : active.textColor,
                              borderColor:
                                isSelected
                                  ? active.accentColor
                                  : `${active.textColor}16`,
                            }}
                          >
                            {method.label}

                            {isSelected && (
                              <Check size={17} />
                            )}
                          </button>
                        );
                      },
                    )}
                  </div>

                  <p
                    className="mt-3 text-xs leading-relaxed"
                    style={{
                      color: active.textColor,
                      opacity: 0.45,
                    }}
                  >
                    Online payments are not connected
                    yet. Cash on delivery is currently
                    available.
                  </p>
                </section>

                {/* Actions */}
                <button
                  type="submit"
                  className="
                    w-full
                    rounded-full
                    py-4
                    text-lg
                    font-black
                    uppercase
                    transition-transform
                    hover:scale-[1.02]
                  "
                  style={{
                    background:
                      active.accentColor,
                    color: active.onAccent,
                  }}
                >
                  Place Order
                </button>

                <a
                  href={`mfzContact.whatsapp.url`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-full
                    py-4
                    text-lg
                    font-black
                    uppercase
                    transition-transform
                    hover:scale-[1.02]
                  "
                  style={{
                    background: '#25D366',
                    color: '#ffffff',
                  }}
                >
                  <MessageCircle size={19} />
                  Order Through WhatsApp
                </a>
              </form>

              {/* Order summary */}
              <aside
                className="
                  h-fit
                  rounded-3xl
                  border
                  p-6
                  lg:sticky
                  lg:top-24
                "
                style={{
                  background:
                    'rgba(255,255,255,0.05)',
                  borderColor: `${active.accentColor}22`,
                }}
              >
                <h2
                  className="mb-5 text-2xl font-black"
                  style={{
                    color: active.textColor,
                    fontFamily:
                      'Anton, sans-serif',
                  }}
                >
                  Order Summary
                </h2>

                <div className="space-y-4">
                  {items.map((item) => (
                    <article
                      key={cartItemKey(item)}
                      className="
                        flex
                        items-start
                        justify-between
                        gap-4
                        rounded-2xl
                        p-3
                      "
                      style={{
                        background:
                          'rgba(255,255,255,0.04)',
                      }}
                    >
                      <div className="min-w-0">
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

                        {item.filling && (
                          <p
                            className="mt-1 text-xs"
                            style={{
                              color:
                                active.textColor,
                              opacity: 0.6,
                            }}
                          >
                            {item.filling}
                          </p>
                        )}

                        {item.sauces &&
                          item.sauces.length >
                            0 && (
                            <p
                              className="mt-1 text-xs"
                              style={{
                                color:
                                  active.textColor,
                                opacity: 0.5,
                              }}
                            >
                              Sauces:{' '}
                              {item.sauces.join(
                                ', ',
                              )}
                            </p>
                          )}

                        {item.extras &&
                          item.extras.length >
                            0 && (
                            <p
                              className="mt-1 text-xs"
                              style={{
                                color:
                                  active.textColor,
                                opacity: 0.5,
                              }}
                            >
                              Extras:{' '}
                              {item.extras.join(
                                ', ',
                              )}
                            </p>
                          )}
                      </div>

                      <span
                        className="shrink-0 font-black"
                        style={{
                          color:
                            active.accentColor,
                        }}
                      >
                        {formatPKR(
                          item.price *
                            item.quantity,
                        )}
                      </span>
                    </article>
                  ))}
                </div>

                <div
                  className="
                    mt-5
                    flex
                    items-center
                    justify-between
                    border-t
                    pt-5
                  "
                  style={{
                    borderColor:
                      'rgba(255,255,255,0.1)',
                  }}
                >
                  <span
                    className="text-lg"
                    style={{
                      color: active.textColor,
                    }}
                  >
                    Total
                  </span>

                  <span
                    className="text-3xl font-black"
                    style={{
                      color:
                        active.accentColor,
                      fontFamily:
                        'Anton, sans-serif',
                    }}
                  >
                    {formatPKR(total)}
                  </span>
                </div>

                <p
                  className="mt-3 text-right text-xs"
                  style={{
                    color: active.textColor,
                    opacity: 0.42,
                  }}
                >
                  Delivery charges can be confirmed by
                  the selected branch.
                </p>
              </aside>
            </div>
          )}
        </div>
      </main>

      <Footer />

      <OrderPlacedAnimation
        open={orderPlaced}
        orderNumber={placedOrderNumber}
        customerName={form.name}
        orderType={mode}
        onClose={() => {
          setOrderPlaced(false);
        }}
      />
    </div>
  );

}