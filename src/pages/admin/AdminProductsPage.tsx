import { useState, type FormEvent } from 'react';
import { ArrowLeft, CheckCircle2, Loader2, PackagePlus } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useTheme } from '@/context/ThemeContext';
import { menuCategories, type ProductCategory } from '@/data/menu';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://mfz-website-backend-production.up.railway.app/api';

const categories = menuCategories.filter(
  (category): category is ProductCategory =>
    category !== 'All' && category !== 'Popular',
);

export default function AdminProductsPage() {
  const { activeProduct: active } = useTheme();
  const [form, setForm] = useState({
    name: '',
    category: categories[0],
    price: '',
    description: '',
    image: '',
    spiceLevel: '0',
    hasCheese: false,
    hasSausage: false,
    popular: false,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const update = (name: string, value: string | boolean) =>
    setForm((current) => ({ ...current, [name]: value }));

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setSuccess(false);

    try {
      const token = localStorage.getItem('mfz_auth_token');
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          spiceLevel: Number(form.spiceLevel),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to add product.');

      setSuccess(true);
      setMessage('Product added. It is now available on the customer menu.');
      setForm((current) => ({
        ...current,
        name: '',
        price: '',
        description: '',
        image: '',
        spiceLevel: '0',
        hasCheese: false,
        hasSausage: false,
        popular: false,
      }));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to add product.');
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    'w-full rounded-2xl border px-4 py-3 outline-none transition-colors';

  return (
    <div className="min-h-screen" style={{ background: active.bgColor, paddingTop: 'var(--nav-h)' }}>
      <main className="mfz-container py-8 md:py-12">
        <Link to="/admin" className="inline-flex items-center gap-2 text-sm font-black uppercase" style={{ color: active.accentColor }}>
          <ArrowLeft size={17} /> Dashboard
        </Link>

        <div className="mt-7 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: `${active.accentColor}18`, color: active.accentColor }}>
            <PackagePlus size={27} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: active.accentColor }}>MFZ Management</p>
            <h1 className="mt-1 text-4xl font-black md:text-6xl" style={{ color: active.textColor, fontFamily: 'Anton, sans-serif' }}>Add Menu Product</h1>
          </div>
        </div>

        <form onSubmit={submit} className="mt-9 grid gap-5 rounded-3xl border p-5 md:grid-cols-2 md:p-8" style={{ background: 'rgba(255,255,255,0.05)', borderColor: `${active.accentColor}30` }}>
          <label className="text-sm font-bold" style={{ color: active.textColor }}>
            Product name
            <input required value={form.name} onChange={(e) => update('name', e.target.value)} className={`${inputClass} mt-2`} style={{ background: 'rgba(255,255,255,0.07)', borderColor: `${active.accentColor}35`, color: active.textColor }} />
          </label>

          <label className="text-sm font-bold" style={{ color: active.textColor }}>
            Category
            <select value={form.category} onChange={(e) => update('category', e.target.value)} className={`${inputClass} mt-2`} style={{ background: active.bgColor, borderColor: `${active.accentColor}35`, color: active.textColor }}>
              {categories.map((category) => <option key={category}>{category}</option>)}
            </select>
          </label>

          <label className="text-sm font-bold" style={{ color: active.textColor }}>
            Price (PKR)
            <input required min="0" type="number" value={form.price} onChange={(e) => update('price', e.target.value)} className={`${inputClass} mt-2`} style={{ background: 'rgba(255,255,255,0.07)', borderColor: `${active.accentColor}35`, color: active.textColor }} />
          </label>

          <label className="text-sm font-bold" style={{ color: active.textColor }}>
            Spice level
            <select value={form.spiceLevel} onChange={(e) => update('spiceLevel', e.target.value)} className={`${inputClass} mt-2`} style={{ background: active.bgColor, borderColor: `${active.accentColor}35`, color: active.textColor }}>
              {[0, 1, 2, 3].map((level) => <option key={level} value={level}>{level}</option>)}
            </select>
          </label>

          <label className="text-sm font-bold md:col-span-2" style={{ color: active.textColor }}>
            Description
            <textarea required rows={4} value={form.description} onChange={(e) => update('description', e.target.value)} className={`${inputClass} mt-2 resize-none`} style={{ background: 'rgba(255,255,255,0.07)', borderColor: `${active.accentColor}35`, color: active.textColor }} />
          </label>

          <label className="text-sm font-bold md:col-span-2" style={{ color: active.textColor }}>
            Product image URL
            <input type="url" value={form.image} onChange={(e) => update('image', e.target.value)} placeholder="https://..." className={`${inputClass} mt-2`} style={{ background: 'rgba(255,255,255,0.07)', borderColor: `${active.accentColor}35`, color: active.textColor }} />
          </label>

          <div className="flex flex-wrap gap-5 md:col-span-2">
            {[
              ['hasCheese', 'Contains cheese'],
              ['hasSausage', 'Contains sausage'],
              ['popular', 'Mark as popular'],
            ].map(([name, label]) => (
              <label key={name} className="flex items-center gap-2 text-sm font-bold" style={{ color: active.textColor }}>
                <input type="checkbox" checked={Boolean(form[name as keyof typeof form])} onChange={(e) => update(name, e.target.checked)} style={{ accentColor: active.accentColor }} />
                {label}
              </label>
            ))}
          </div>

          {message && (
            <div className="flex items-center gap-2 rounded-2xl p-4 md:col-span-2" style={{ background: success ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)', color: active.textColor }}>
              {success && <CheckCircle2 size={19} style={{ color: '#22c55e' }} />}
              {message}
            </div>
          )}

          <button disabled={loading} className="flex items-center justify-center gap-2 rounded-full py-4 font-black uppercase md:col-span-2" style={{ background: active.accentColor, color: active.onAccent }}>
            {loading ? <Loader2 className="animate-spin" size={19} /> : <PackagePlus size={19} />}
            {loading ? 'Adding Product...' : 'Add Product to Menu'}
          </button>
        </form>
      </main>
    </div>
  );
}
