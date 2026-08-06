import { useMemo, useState } from 'react';
import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom';
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
} from 'lucide-react';

import { useTheme } from '@/context/ThemeContext';
import { useCart } from '@/context/CartContext';
import {
  menuItems,
  formatPKR,
} from '@/data/menu';

export default function MenuItemPage() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const { activeProduct } = useTheme();
  const active = activeProduct;

  const { addItem } = useCart();

  const [quantity, setQuantity] =
    useState(1);

  const product = useMemo(
    () =>
      menuItems.find(
        (item) =>
          String(item.id) === productId,
      ),
    [productId],
  );

  if (!product) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6"
        style={{
          background: active.bgColor,
          paddingTop: 'var(--nav-h)',
        }}
      >
        <div className="text-center">
          <h1
            className="text-5xl font-black"
            style={{
              color: active.textColor,
              fontFamily:
                'Anton, sans-serif',
            }}
          >
            Item Not Found
          </h1>

          <Link
            to="/menu"
            className="mt-6 inline-flex rounded-full px-6 py-3 font-black uppercase"
            style={{
              background:
                active.accentColor,
              color: active.onAccent,
            }}
          >
            Back to Menu
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({
      ...product,
      quantity,
    });

    navigate('/cart');
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
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-sm font-black uppercase"
          style={{
            color: active.accentColor,
          }}
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <section
            className="overflow-hidden rounded-[2rem] border"
            style={{
              background:
                'rgba(255,255,255,0.05)',
              borderColor: `${active.accentColor}25`,
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              className="aspect-square w-full object-cover"
            />
          </section>

          <section>
            <p
              className="text-xs font-black uppercase tracking-[0.25em]"
              style={{
                color:
                  active.accentColor,
              }}
            >
              MFZ Corndog
            </p>

            <h1
              className="mt-3 text-5xl font-black md:text-7xl"
              style={{
                color: active.textColor,
                fontFamily:
                  'Anton, sans-serif',
              }}
            >
              {product.name}
            </h1>

            {product.description && (
              <p
                className="mt-5 max-w-xl text-base leading-relaxed"
                style={{
                  color:
                    active.textColor,
                  opacity: 0.65,
                }}
              >
                {product.description}
              </p>
            )}

            <p
              className="mt-6 text-4xl font-black"
              style={{
                color:
                  active.accentColor,
                fontFamily:
                  'Anton, sans-serif',
              }}
            >
              {formatPKR(
                product.price * quantity,
              )}
            </p>

            <div className="mt-8 flex items-center gap-4">
              <button
                type="button"
                onClick={() =>
                  setQuantity((current) =>
                    Math.max(
                      1,
                      current - 1,
                    ),
                  )
                }
                className="flex h-12 w-12 items-center justify-center rounded-full border"
                style={{
                  color:
                    active.textColor,
                  borderColor: `${active.accentColor}35`,
                }}
              >
                <Minus size={18} />
              </button>

              <span
                className="min-w-10 text-center text-2xl font-black"
                style={{
                  color:
                    active.textColor,
                }}
              >
                {quantity}
              </span>

              <button
                type="button"
                onClick={() =>
                  setQuantity(
                    (current) =>
                      current + 1,
                  )
                }
                className="flex h-12 w-12 items-center justify-center rounded-full border"
                style={{
                  color:
                    active.textColor,
                  borderColor: `${active.accentColor}35`,
                }}
              >
                <Plus size={18} />
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-full py-4 text-lg font-black uppercase transition-transform hover:scale-[1.02]"
              style={{
                background:
                  active.accentColor,
                color:
                  active.onAccent,
              }}
            >
              <ShoppingBag size={19} />
              Add to Cart
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}