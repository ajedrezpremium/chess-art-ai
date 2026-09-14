'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { AIChatWidget } from '@/components/agent/ChatWidget';
import { Send, Copy, Check, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

const TOPICS_ES = ['Colaboración artística', 'Licencias e imágenes', 'Corrección de datos', 'Prensa', 'Otro'];
const TOPICS_EN = ['Art collaboration', 'Licenses & images', 'Data correction', 'Press', 'Other'];

export default function ContactoPage() {
  const [locale, setLocale] = useState<'es' | 'en'>('es');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleLanguageChange = (e: CustomEvent<'es' | 'en'>) => {
      setLocale(e.detail);
    };
    window.addEventListener('toggle-language', handleLanguageChange as EventListener);
    return () => window.removeEventListener('toggle-language', handleLanguageChange as EventListener);
  }, []);

  const t =
    locale === 'es'
      ? {
          title: 'Contacto',
          subtitle: 'Colaboraciones, licencias, correcciones y prensa. Respondemos en unos días.',
          name: 'Nombre',
          email: 'Correo electrónico',
          topic: 'Motivo',
          message: 'Mensaje',
          messagePh: 'Cuéntanos en qué podemos ayudarte...',
          send: 'Enviar correo',
          copy: 'Copiar mensaje',
          copied: '¡Copiado!',
          success: 'Hemos preparado tu correo. Revísalo y pulsa enviar en tu cliente de correo.',
          errorName: 'Escribe tu nombre.',
          errorEmail: 'Escribe un correo válido.',
          errorTopic: 'Elige un motivo.',
          errorMessage: 'Escribe un mensaje (mínimo 10 caracteres).',
          direct: 'O escríbenos directamente a',
        }
      : {
          title: 'Contact',
          subtitle: 'Collaborations, licenses, corrections and press. We reply within a few days.',
          name: 'Name',
          email: 'Email',
          topic: 'Topic',
          message: 'Message',
          messagePh: 'Tell us how we can help...',
          send: 'Send email',
          copy: 'Copy message',
          copied: 'Copied!',
          success: 'Your email is ready. Review it and press send in your mail client.',
          errorName: 'Please enter your name.',
          errorEmail: 'Please enter a valid email.',
          errorTopic: 'Please choose a topic.',
          errorMessage: 'Please write a message (at least 10 characters).',
          direct: 'Or write to us directly at',
        };

  const topics = locale === 'es' ? TOPICS_ES : TOPICS_EN;

  const body = `${t.message}:\n${message}\n\n—\n${name} <${email}>\n${t.topic}: ${topic}\nChess Art & AI Academy`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) return setError(t.errorName);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError(t.errorEmail);
    if (!topic) return setError(t.errorTopic);
    if (message.trim().length < 10) return setError(t.errorMessage);
    setError('');
    const subject = encodeURIComponent(`[Chess Art] ${topic} — ${name}`);
    window.location.href = `mailto:chessaiagency@gmail.com?subject=${subject}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(body);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError(t.errorMessage);
    }
  };

  const inputCls =
    'w-full px-4 py-3 bg-chess-surface/60 border border-chess-border/50 rounded-xl text-sm text-chess-text-primary placeholder:text-chess-text-muted focus:outline-none focus:border-chess-gold/60 focus:ring-2 focus:ring-chess-gold/20';

  return (
    <div className="min-h-screen bg-chess-bg">
      <Header />
      <main className="pt-20 lg:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto px-6 sm:px-8 py-12"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-chess-surface/50 border border-chess-border/50 rounded-full text-sm font-medium text-chess-gold mb-3">
            <Mail className="h-4 w-4" />
            <span className="font-display">{t.title}</span>
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-chess-text-primary mb-2">
            {t.title}
          </h1>
          <p className="text-chess-text-secondary mb-8">{t.subtitle}</p>

          <form onSubmit={handleSubmit} className="glass p-5 sm:p-7 space-y-4" noValidate>
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block text-sm">
                <span className="block mb-1.5 font-medium text-chess-text-secondary">{t.name}</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.name}
                  autoComplete="name"
                  className={inputCls}
                />
              </label>
              <label className="block text-sm">
                <span className="block mb-1.5 font-medium text-chess-text-secondary">{t.email}</span>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  type="email"
                  autoComplete="email"
                  className={inputCls}
                />
              </label>
            </div>
            <label className="block text-sm">
              <span className="block mb-1.5 font-medium text-chess-text-secondary">{t.topic}</span>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className={cn(inputCls, 'cursor-pointer', !topic && 'text-chess-text-muted')}
              >
                <option value="" className="bg-chess-surface">
                  {t.topic}…
                </option>
                {topics.map((tp) => (
                  <option key={tp} value={tp} className="bg-chess-surface">
                    {tp}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="block mb-1.5 font-medium text-chess-text-secondary">{t.message}</span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t.messagePh}
                rows={6}
                className={cn(inputCls, 'resize-y min-h-[140px]')}
              />
            </label>

            {error && (
              <p role="alert" className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-2.5">
                {error}
              </p>
            )}
            {sent && !error && (
              <p role="status" className="text-sm text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-2.5">
                {t.success}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button type="submit" className="btn-primary flex-1 justify-center">
                <Send className="h-4 w-4" />
                {t.send}
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="btn-secondary justify-center"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? t.copied : t.copy}
              </button>
            </div>
          </form>

          <p className="text-center text-sm text-chess-text-muted mt-6">
            {t.direct}{' '}
            <a href="mailto:chessaiagency@gmail.com" className="text-chess-gold hover:text-chess-gold-light underline underline-offset-2">
              chessaiagency@gmail.com
            </a>
          </p>
        </motion.div>
      </main>
      <SiteFooter />
      <AIChatWidget locale={locale} />
    </div>
  );
}
