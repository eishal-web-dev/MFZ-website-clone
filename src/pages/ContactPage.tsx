import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Send,
  MapPin,
  Mail,
  MessageCircle,
  Phone,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

import { useTheme } from '@/context/ThemeContext';
import { Footer } from '@/components/Footer';

/*
 * Official public MFZ WhatsApp number.
 * wa.me links must contain digits only:
 * no plus sign, spaces, brackets or hyphens.
 */
const MFZ_WHATSAPP = '923051880355';
const MFZ_WHATSAPP_DISPLAY = '+92 305 1880355';

/*
 * MFZ does not currently appear to publish a verified email.
 *
 * When MFZ provides an official email, add it here:
 *
 * const MFZ_EMAIL = 'contact@mfz.pk';
 *
 * Important:
 * A frontend-only React form cannot silently send an email by itself.
 * For real email delivery, connect Formspree, EmailJS or your own backend.
 */
const MFZ_EMAIL = '';

interface ContactFormData {
  name: string;
  phone: string;
  message: string;
}

const initialFormData: ContactFormData = {
  name: '',
  phone: '',
  message: '',
};

function createWhatsAppUrl(formData: ContactFormData): string {
  const text = encodeURIComponent(
    [
      'Assalamualaikum MFZ,',
      '',
      'I am contacting you through the MFZ website.',
      '',
      `Name: ${formData.name}`,
      `Phone: ${formData.phone}`,
      '',
      'Message:',
      formData.message,
    ].join('\n'),
  );

  return `https://wa.me/${MFZ_WHATSAPP}?text=${text}`;
}

export default function ContactPage() {
  const { activeProduct } = useTheme();
  const active = activeProduct;

  const [formData, setFormData] =
    useState<ContactFormData>(initialFormData);

  const [status, setStatus] = useState<
    'idle' | 'opening' | 'success' | 'error'
  >('idle');

  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    if (status !== 'idle') {
      setStatus('idle');
    }
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const cleanedName = formData.name.trim();
    const cleanedPhone = formData.phone.trim();
    const cleanedMessage = formData.message.trim();

    if (
      !cleanedName ||
      !cleanedPhone ||
      !cleanedMessage
    ) {
      setStatus('error');
      return;
    }

    const completedFormData: ContactFormData = {
      name: cleanedName,
      phone: cleanedPhone,
      message: cleanedMessage,
    };

    setStatus('opening');

    const whatsappUrl =
      createWhatsAppUrl(completedFormData);

    const whatsappWindow = window.open(
      whatsappUrl,
      '_blank',
      'noopener,noreferrer',
    );

    if (!whatsappWindow) {
      setStatus('error');
      return;
    }

    setStatus('success');
    setFormData(initialFormData);

    window.setTimeout(() => {
      setStatus('idle');
    }, 4000);
  };

  return (
    <div
      className="min-h-screen overflow-hidden"
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
          {/* Header */}
          <motion.header
            initial={{
              opacity: 0,
              y: 24,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.55,
            }}
            className="mb-12 pt-10 text-center md:mb-16 md:pt-14"
          >
            <span
              className="text-xs font-bold uppercase tracking-[0.3em]"
              style={{
                color: active.accentColor,
              }}
            >
              Get In Touch
            </span>

            <h1
              className="
                mt-3
                text-[clamp(58px,9vw,110px)]
                font-black
                leading-[0.9]
              "
              style={{
                color: active.textColor,
                fontFamily: 'Anton, sans-serif',
              }}
            >
              Contact
            </h1>

            <p
              className="
                mx-auto
                mt-5
                max-w-2xl
                text-base
                leading-relaxed
                sm:text-lg
              "
              style={{
                color: active.textColor,
                opacity: 0.72,
              }}
            >
              Questions, catering enquiries or just want to
              talk corndogs? Send MFZ a message directly
              through WhatsApp.
            </p>
          </motion.header>

          <div className="grid items-start gap-8 md:grid-cols-2">
            {/* Contact form */}
            <motion.form
              initial={{
                opacity: 0,
                x: -24,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.55,
                delay: 0.08,
              }}
              onSubmit={handleSubmit}
              className="
                space-y-5
                rounded-3xl
                p-6
                sm:p-8
              "
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: `1px solid ${active.accentColor}22`,
              }}
            >
              <div>
                <label
                  htmlFor="contact-name"
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
                    opacity: 0.65,
                  }}
                >
                  Name
                </label>

                <input
                  id="contact-name"
                  name="name"
                  required
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  autoComplete="name"
                  placeholder="Your full name"
                  className="
                    w-full
                    rounded-xl
                    px-4
                    py-3.5
                    outline-none
                    transition-all
                    placeholder:opacity-40
                  "
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    color: active.textColor,
                    border: `1px solid ${active.accentColor}33`,
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="contact-phone"
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
                    opacity: 0.65,
                  }}
                >
                  Phone
                </label>

                <input
                  id="contact-phone"
                  name="phone"
                  required
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  autoComplete="tel"
                  placeholder="03XX XXXXXXX"
                  className="
                    w-full
                    rounded-xl
                    px-4
                    py-3.5
                    outline-none
                    transition-all
                    placeholder:opacity-40
                  "
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    color: active.textColor,
                    border: `1px solid ${active.accentColor}33`,
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="contact-message"
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
                    opacity: 0.65,
                  }}
                >
                  Message
                </label>

                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="How can MFZ help you?"
                  className="
                    w-full
                    resize-none
                    rounded-xl
                    px-4
                    py-3.5
                    outline-none
                    transition-all
                    placeholder:opacity-40
                  "
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    color: active.textColor,
                    border: `1px solid ${active.accentColor}33`,
                  }}
                />
              </div>

              {status === 'success' && (
                <div
                  className="
                    flex
                    items-start
                    gap-3
                    rounded-2xl
                    p-4
                    text-sm
                  "
                  style={{
                    background: 'rgba(37,211,102,0.12)',
                    color: active.textColor,
                    border:
                      '1px solid rgba(37,211,102,0.35)',
                  }}
                >
                  <CheckCircle2
                    size={19}
                    className="mt-0.5 shrink-0"
                    style={{
                      color: '#25D366',
                    }}
                  />

                  <span>
                    WhatsApp has opened with your message.
                    Press send there to deliver it to MFZ.
                  </span>
                </div>
              )}

              {status === 'error' && (
                <div
                  className="
                    flex
                    items-start
                    gap-3
                    rounded-2xl
                    p-4
                    text-sm
                  "
                  style={{
                    background: 'rgba(225,29,42,0.12)',
                    color: active.textColor,
                    border:
                      '1px solid rgba(225,29,42,0.4)',
                  }}
                >
                  <AlertCircle
                    size={19}
                    className="mt-0.5 shrink-0"
                    style={{
                      color: '#ff5a67',
                    }}
                  />

                  <span>
                    Please complete all fields. If WhatsApp
                    did not open, check whether pop-ups are
                    blocked.
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'opening'}
                className="
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  py-4
                  font-black
                  uppercase
                  transition-transform
                  hover:scale-[1.02]
                  disabled:cursor-wait
                  disabled:opacity-70
                "
                style={{
                  background: '#25D366',
                  color: '#ffffff',
                }}
              >
                {status === 'opening' ? (
                  'Opening WhatsApp...'
                ) : status === 'success' ? (
                  <>
                    <CheckCircle2 size={18} />
                    Message Ready
                  </>
                ) : (
                  <>
                    <MessageCircle size={18} />
                    Send on WhatsApp
                  </>
                )}
              </button>

              <p
                className="text-center text-xs leading-relaxed"
                style={{
                  color: active.textColor,
                  opacity: 0.48,
                }}
              >
                Your message will open in WhatsApp. You must
                press Send inside WhatsApp to deliver it.
              </p>
            </motion.form>

            {/* Contact details */}
            <motion.div
              initial={{
                opacity: 0,
                x: 24,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.55,
                delay: 0.12,
              }}
              className="space-y-4"
            >
              <ContactCard
                icon={
                  <MapPin
                    size={20}
                    style={{
                      color: active.onAccent,
                    }}
                  />
                }
                title="Location"
                value="Peshawar, Pakistan"
                accentColor={active.accentColor}
                textColor={active.textColor}
              />

              <ContactCard
                icon={
                  <Phone
                    size={20}
                    style={{
                      color: active.onAccent,
                    }}
                  />
                }
                title="Head Office"
                value="+ 091 5815133"
                href="tel:+ 091 5815133"
                accentColor={active.accentColor}
                textColor={active.textColor}
              />

              <ContactCard
                icon={
                  <Mail
                    size={20}
                    style={{
                      color: active.onAccent,
                    }}
                  />
                }
                title="Email"
                value={
                  MFZ_EMAIL ||
                  'Official email pending confirmation'
                }
                href={
                  MFZ_EMAIL
                    ? `mailto:${MFZ_EMAIL}`
                    : undefined
                }
                accentColor={active.accentColor}
                textColor={active.textColor}
              />

              <a
                href={`https://wa.me/${MFZ_WHATSAPP}?text=${encodeURIComponent(
                  'Assalamualaikum MFZ, I would like some information.',
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  flex
                  items-center
                  gap-4
                  rounded-3xl
                  p-6
                  transition-transform
                  hover:scale-[1.02]
                "
                style={{
                  background: '#25D366',
                }}
              >
                <div
                  className="
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                  "
                  style={{
                    background: '#ffffff',
                  }}
                >
                  <MessageCircle
                    size={21}
                    style={{
                      color: '#25D366',
                    }}
                  />
                </div>

                <div className="min-w-0">
                  <h3 className="font-black text-white">
                    WhatsApp MFZ
                  </h3>

                  <p className="mt-0.5 text-sm text-white/85">
                    {MFZ_WHATSAPP_DISPLAY}
                  </p>

                  <p className="mt-1 text-xs text-white/70">
                    Quick ordering and support
                  </p>
                </div>
              </a>

              <div
                className="rounded-3xl p-6"
                style={{
                  background: active.bgGradient,
                  border: `1px solid ${active.accentColor}33`,
                }}
              >
                <h3
                  className="text-2xl font-black"
                  style={{
                    color: active.textColor,
                    fontFamily: 'Anton, sans-serif',
                  }}
                >
                  Branch Numbers
                </h3>

                <div className="mt-4 space-y-3">
                  <BranchPhone
                    label="HBK Branch"
                    display="091-3049432"
                    phone="0913049432"
                    textColor={active.textColor}
                    accentColor={active.accentColor}
                  />

                  <BranchPhone
                    label="Town Branch"
                    display="091-3091246"
                    phone="0913091246"
                    textColor={active.textColor}
                    accentColor={active.accentColor}
                  />

                  <BranchPhone
                    label="Gulbahar Branch"
                    display="091-3026266"
                    phone="0913026266"
                    textColor={active.textColor}
                    accentColor={active.accentColor}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

interface ContactCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  accentColor: string;
  textColor: string;
  href?: string;
}

function ContactCard({
  icon,
  title,
  value,
  accentColor,
  textColor,
  href,
}: ContactCardProps) {
  const content = (
    <>
      <div
        className="
          flex
          h-12
          w-12
          shrink-0
          items-center
          justify-center
          rounded-full
        "
        style={{
          background: accentColor,
        }}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <h3
          className="font-black"
          style={{
            color: textColor,
          }}
        >
          {title}
        </h3>

        <p
          className="mt-0.5 break-words text-sm"
          style={{
            color: textColor,
            opacity: 0.65,
          }}
        >
          {value}
        </p>
      </div>
    </>
  );

  const className =
    'flex items-center gap-4 rounded-3xl p-6 transition-transform hover:scale-[1.01]';

  const style = {
    background: 'rgba(255,255,255,0.05)',
    border: `1px solid ${accentColor}22`,
  };

  if (href) {
    return (
      <a
        href={href}
        className={className}
        style={style}
      >
        {content}
      </a>
    );
  }

  return (
    <div
      className={className}
      style={style}
    >
      {content}
    </div>
  );
}

interface BranchPhoneProps {
  label: string;
  display: string;
  phone: string;
  textColor: string;
  accentColor: string;
}

function BranchPhone({
  label,
  display,
  phone,
  textColor,
  accentColor,
}: BranchPhoneProps) {
  return (
    <a
      href={`tel:${phone}`}
      className="
        flex
        items-center
        justify-between
        gap-4
        rounded-xl
        px-4
        py-3
        transition-transform
        hover:translate-x-1
      "
      style={{
        background: 'rgba(255,255,255,0.06)',
      }}
    >
      <span
        className="text-sm font-semibold"
        style={{
          color: textColor,
          opacity: 0.72,
        }}
      >
        {label}
      </span>

      <span
        className="text-sm font-black"
        style={{
          color: accentColor,
        }}
      >
        {display}
      </span>
    </a>
  );
}