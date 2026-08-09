import { Link } from 'react-router-dom';
import { Instagram, MapPin, ArrowUpRight, Smartphone } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { mfzContact } from '@/data/contact';

const footerLinks = [
  { label: 'Home', path: '/' },
  { label: 'Menu', path: '/menu' },
  { label: 'Build Yours', path: '/build' },
  { label: 'Locations', path: '/locations' },
  { label: 'Get App', path: '/app' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

export function Footer() {
  const { activeProduct } = useTheme();
  const a = activeProduct;

  return (
    <footer
      className="relative pt-16 pb-8"
      style={{
        background: a.bgColor,
        borderTop: `1px solid ${a.accentColor}33`,
      }}
    >
      <div className="mfz-container">
        <div className="grid md:grid-cols-12 gap-10 md:gap-8 mb-12">
          <div className="md:col-span-5">
            <h3
              className="text-5xl md:text-6xl font-black mb-4"
              style={{
                color: a.textColor,
                fontFamily: 'Anton, sans-serif',
                letterSpacing: '-0.02em',
              }}
            >
              MFZ
            </h3>
            <p
              className="text-sm leading-relaxed max-w-xs"
              style={{ color: a.textColor, opacity: 0.6 }}
            >
              Peshawar's boldest Korean-style corndogs. Crispy outside, cheesy inside, impossible to ignore.
            </p>
            <div className="flex gap-3 mt-6">
              <a
                href="https://www.instagram.com/mfz.pk/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-3 rounded-full transition-all duration-300 hover:scale-110 hover:-translate-y-1"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  color: a.textColor,
                  border: `1px solid ${a.accentColor}22`,
                }}
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://mfz.delivery/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Website"
                className="p-3 rounded-full transition-all duration-300 hover:scale-110 hover:-translate-y-1"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  color: a.textColor,
                  border: `1px solid ${a.accentColor}22`,
                }}
              >
                <ArrowUpRight size={18} />
              </a>
              <Link
                to="/locations"
                aria-label="Locations"
                className="p-3 rounded-full transition-all duration-300 hover:scale-110 hover:-translate-y-1"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  color: a.textColor,
                  border: `1px solid ${a.accentColor}22`,
                }}
              >
                <MapPin size={18} />
              </Link>
              <Link
                to="/app"
                aria-label="Install MFZ App"
                className="p-3 rounded-full transition-all duration-300 hover:scale-110 hover:-translate-y-1"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  color: a.textColor,
                  border: `1px solid ${a.accentColor}22`,
                }}
              >
                <Smartphone size={18} />
              </Link>
            </div>
          </div>

          <div className="md:col-span-3">
            <h4
              className="text-xs uppercase tracking-[0.2em] mb-5 font-bold"
              style={{ color: a.accentColor }}
            >
              Explore
            </h4>
            <ul className="space-y-3">
              {footerLinks.map((l) => (
                <li key={l.path}>
                  <Link
                    to={l.path}
                    className="text-sm font-medium transition-all duration-200 hover:translate-x-1 inline-block"
                    style={{ color: a.textColor, opacity: 0.65 }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4
              className="text-xs uppercase tracking-[0.2em] mb-5 font-bold"
              style={{ color: a.accentColor }}
            >
              Contact
            </h4>
            <ul
              className="space-y-3 text-sm"
              style={{ color: a.textColor, opacity: 0.65 }}
            >
              <li className="flex items-start gap-2">
                <MapPin
                  size={14}
                  className="flex-shrink-0 mt-0.5"
                  style={{ color: a.accentColor }}
                />
                Peshawar, Pakistan
              </li>
              <li>
                <a
                  href="https://mfz.delivery/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-opacity hover:opacity-100"
                  style={{ opacity: 0.8 }}
                >
                  mfz.delivery
                </a>
              </li>
              <li>
                <a
                  href={mfzContact.whatsapp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-opacity hover:opacity-100"
                  style={{ opacity: 0.8 }}
                >
                  WhatsApp: {mfzContact.whatsapp.number}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="pt-6 border-t flex flex-col md:flex-row justify-between items-center gap-3"
          style={{ borderColor: 'rgba(255,255,255,0.08)' }}
        >
          <p
            className="text-xs"
            style={{ color: a.textColor, opacity: 0.4 }}
          >
            © {new Date().getFullYear()} MFZ Corndog. All rights reserved. Prices and availability may vary by branch.
          </p>
          <p
            className="text-xs"
            style={{ color: a.textColor, opacity: 0.4 }}
          >
            Made with crunch in Peshawar.
          </p>
        </div>
      </div>
    </footer>
  );
}
