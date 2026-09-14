'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { AIChatWidget } from '@/components/agent/ChatWidget';
import {
  Palette, BadgeCheck, Clock, UploadCloud, ShieldCheck, User, Mail,
  Briefcase, ArrowRight, CheckCircle2, AlertCircle, Loader2, ExternalLink,
} from 'lucide-react';

const CATEGORIES = ['Dibujo', 'Pintura', 'Escultura', 'Fotografía', 'Digital', 'Otra'];

export function ArtistasClient() {
  const [locale, setLocale] = useState<'es' | 'en'>('es');
  useEffect(() => {
    const h = (e: CustomEvent<'es' | 'en'>) => setLocale(e.detail);
    window.addEventListener('toggle-language', h as EventListener);
    return () => window.removeEventListener('toggle-language', h as EventListener);
  }, []);

  const [tab, setTab] = useState<'artists' | 'collaborators'>('artists');
  const [form, setForm] = useState({ name: '', email: '', title: '', category: 'Dibujo', description: '', imageUrl: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const [cform, setCform] = useState({ alias: '', email: '', kind: 'Obra de arte', title: '', description: '', link: '' });
  const [cstatus, setCstatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');
  const [cerror, setCerror] = useState('');

  const es = locale === 'es';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');
    try {
      const res = await fetch('/api/artists/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, locale }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Error');
      setStatus('ok');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Error');
    }
  };

  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const cset = (k: keyof typeof cform) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setCform((f) => ({ ...f, [k]: e.target.value }));

  const submitCollaborator = async (e: React.FormEvent) => {
    e.preventDefault();
    setCstatus('sending');
    setCerror('');
    try {
      const res = await fetch('/api/collaborators/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...cform, locale }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Error');
      setCstatus('ok');
    } catch (err) {
      setCstatus('error');
      setCerror(err instanceof Error ? err.message : 'Error');
    }
  };

  return (
    <div className="min-h-screen bg-chess-bg">
      <Header locale={locale} />
      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-36 md:pt-44 pb-20">
        {/* Cabecera */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-chess-surface/50 border border-chess-border/50 rounded-full text-sm font-medium text-chess-gold mb-4">
            <Palette className="h-4 w-4" />
            {es ? 'Comunidad de artistas' : 'Artist community'}
          </span>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-chess-text-primary">
            {es ? 'Artistas' : 'Artists'}
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-chess-text-secondary">
            {es
              ? 'Cada artista tiene su propio perfil y puede subir sus obras directamente. Todo el material pasa una revisión editorial de calidad y legalidad en 24–48h antes de publicarse.'
              : 'Each artist has their own profile and can upload works directly. All material passes an editorial quality and legality review within 24–48h before publication.'}
          </p>
        </motion.div>

        {/* Tabs Artistas / Colaboradores */}
        <div className="mb-10 flex flex-wrap items-center gap-2" role="tablist" aria-label={es ? 'Comunidad' : 'Community'}>
          {[
            { id: 'artists' as const, label: es ? 'Artistas' : 'Artists', icon: Palette },
            { id: 'collaborators' as const, label: es ? 'Colaboradores' : 'Contributors', icon: UploadCloud },
          ].map((tb) => (
            <button
              key={tb.id}
              role="tab"
              aria-selected={tab === tb.id}
              onClick={() => setTab(tb.id)}
              className={
                tab === tb.id
                  ? 'flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-xl border-2 border-chess-gold bg-chess-gold/5 text-chess-gold transition-all duration-200'
                  : 'flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-xl border-2 border-chess-border/50 text-chess-text-secondary hover:text-chess-text-primary hover:border-chess-gold/30 hover:bg-chess-surface-elevated/30 transition-all duration-200'
              }
            >
              <tb.icon className="h-4 w-4" />
              {tb.label}
            </button>
          ))}
        </div>

        {tab === 'artists' ? (
        <>
        {/* Ficha destacada: Pablo Iglesias */}
        <motion.section
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
          className="card-elevated p-6 md:p-10 mb-14 overflow-hidden relative"
        >
          <div className="absolute inset-0 hero-gradient-mesh opacity-60 pointer-events-none" />
          <div className="relative flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0">
              <img
                src="/artists/pablo-iglesias.svg"
                alt="Retrato ilustrado de Pablo Iglesias"
                className="w-28 h-28 md:w-36 md:h-36 rounded-3xl shadow-strong border border-chess-gold/30 object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-chess-text-primary">Pablo Iglesias</h2>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-chess-gold/15 text-chess-gold border border-chess-gold/30">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  {es ? 'Artista verificado · Fundador' : 'Verified artist · Founder'}
                </span>
              </div>
              <p className="text-sm text-chess-gold font-medium mb-4">
                {es ? 'Serie DIBUJOS · Top 100 Combinaciones de la Historia' : 'DRAWINGS series · Top 100 Combinations in History'}
              </p>
              <p className="text-chess-text-secondary leading-relaxed max-w-3xl">
                {es
                  ? 'Artista visual especializado en la intersección entre el ajedrez y el arte contemporáneo. Su serie DIBUJOS transforma posiciones ajedrecísticas icónicas en obras que capturan la tensión, el sacrificio y la belleza del momento decisivo. Primera ficha de artista de la plataforma.'
                  : 'Visual artist specialized in the intersection of chess and contemporary art. His DRAWINGS series transforms iconic chess positions into works capturing the tension, sacrifice and beauty of the decisive moment. The platform’s first artist profile.'}
              </p>
              <div className="flex flex-wrap gap-6 mt-6">
                {[
                  { v: '100', l: es ? 'Combinaciones' : 'Combinations' },
                  { v: '100', l: es ? 'Ilustraciones' : 'Artworks' },
                  { v: '1', l: es ? 'Serie publicada' : 'Published series' },
                ].map((s) => (
                  <div key={s.l}>
                    <div className="font-display text-2xl font-bold text-chess-text-primary">{s.v}</div>
                    <div className="text-xs text-chess-text-muted">{s.l}</div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 mt-6">
                <a
                  href="https://www.linkedin.com/in/pabloiglesias1991/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary !py-2.5 !px-4 text-sm"
                >
                  <Briefcase className="h-4 w-4" /> LinkedIn <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <Link href="/combinaciones" className="btn-primary !py-2.5 !px-4 text-sm">
                  {es ? 'Ver su serie' : 'View his series'} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Cómo funciona */}
        <section className="mb-14">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-chess-text-primary mb-8">
            {es ? 'Cómo publicar tu obra' : 'How to publish your work'}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: UploadCloud,
                t: es ? '1. Sube tu obra' : '1. Upload your work',
                d: es
                  ? 'Rellena el formulario con tu perfil y tu obra (título, categoría, descripción e imagen). Recibirás confirmación inmediata.'
                  : 'Fill in the form with your profile and work (title, category, description and image). You’ll get instant confirmation.',
              },
              {
                icon: ShieldCheck,
                t: es ? '2. Revisión 24–48h' : '2. Review within 24–48h',
                d: es
                  ? 'Nuestro equipo revisa calidad artística, originalidad, derechos de imagen y legalidad antes de aprobar. Te avisamos por email.'
                  : 'Our team reviews artistic quality, originality, image rights and legality before approval. We’ll notify you by email.',
              },
              {
                icon: User,
                t: es ? '3. Tu perfil público' : '3. Your public profile',
                d: es
                  ? 'Al aprobarse, tu obra se publica con tu perfil propio de artista: bio, galería, enlaces y contacto profesional.'
                  : 'Once approved, your work is published under your own artist profile: bio, gallery, links and professional contact.',
              },
            ].map((s, i) => (
              <motion.div
                key={s.t}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.15 + i * 0.1 }}
                className="card-base p-6"
              >
                <div className="w-12 h-12 rounded-2xl bg-chess-gold/10 border border-chess-gold/30 flex items-center justify-center mb-4">
                  <s.icon className="h-6 w-6 text-chess-gold" />
                </div>
                <h3 className="font-semibold text-chess-text-primary mb-2">{s.t}</h3>
                <p className="text-sm text-chess-text-secondary leading-relaxed">{s.d}</p>
              </motion.div>
            ))}
          </div>
          <p className="mt-6 flex items-start gap-2 text-sm text-chess-text-muted max-w-3xl">
            <Clock className="h-4 w-4 mt-0.5 flex-shrink-0 text-chess-gold" />
            {es
              ? 'Compromiso de revisión: 24–48h laborables. Solo se publican obras originales o con derechos acreditados; el contenido ilegal, plagiado o que vulnere derechos de terceros será rechazado.'
              : 'Review commitment: 24–48 business hours. Only original or rights-cleared works are published; illegal, plagiarized or rights-infringing content will be rejected.'}
          </p>
        </section>

        {/* Formulario de subida */}
        <section className="card-elevated p-6 md:p-10">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-chess-text-primary mb-2">
            {es ? 'Sube tu obra' : 'Submit your work'}
          </h2>
          <p className="text-chess-text-secondary mb-8 max-w-2xl">
            {es
              ? 'Completa todos los campos. Al enviar aceptas que tu obra sea revisada y, si se aprueba, publicada con tu nombre.'
              : 'Fill in all fields. By submitting you agree that your work will be reviewed and, if approved, published under your name.'}
          </p>

          {status === 'ok' ? (
            <div className="flex items-start gap-3 p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <CheckCircle2 className="h-6 w-6 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-emerald-300">
                  {es ? '¡Obra recibida!' : 'Work received!'}
                </p>
                <p className="text-sm text-chess-text-secondary mt-1">
                  {es
                    ? 'La revisaremos en un plazo de 24–48h y te avisaremos por email. Gracias por compartir tu arte.'
                    : 'We’ll review it within 24–48h and notify you by email. Thank you for sharing your art.'}
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="grid md:grid-cols-2 gap-5">
              <label className="block">
                <span className="block text-sm font-medium text-chess-text-secondary mb-1.5">
                  {es ? 'Nombre artístico *' : 'Artist name *'}
                </span>
                <input required value={form.name} onChange={set('name')} className="input-base" placeholder="Ada Lovelace" />
              </label>
              <label className="block">
                <span className="block text-sm font-medium text-chess-text-secondary mb-1.5">Email *</span>
                <input required type="email" value={form.email} onChange={set('email')} className="input-base" placeholder="artista@email.com" />
              </label>
              <label className="block">
                <span className="block text-sm font-medium text-chess-text-secondary mb-1.5">
                  {es ? 'Título de la obra *' : 'Work title *'}
                </span>
                <input required value={form.title} onChange={set('title')} className="input-base" placeholder={es ? 'La Inmortal en tinta' : 'The Immortal in ink'} />
              </label>
              <label className="block">
                <span className="block text-sm font-medium text-chess-text-secondary mb-1.5">
                  {es ? 'Categoría *' : 'Category *'}
                </span>
                <select value={form.category} onChange={set('category')} className="input-base">
                  {CATEGORIES.map((c) => <option key={c} value={c} className="bg-chess-surface">{c}</option>)}
                </select>
              </label>
              <label className="block md:col-span-2">
                <span className="block text-sm font-medium text-chess-text-secondary mb-1.5">
                  {es ? 'Descripción (técnica, medidas, historia) *' : 'Description (technique, size, story) *'}
                </span>
                <textarea required value={form.description} onChange={set('description')} className="input-base textarea-base" rows={4} />
              </label>
              <label className="block md:col-span-2">
                <span className="block text-sm font-medium text-chess-text-secondary mb-1.5">
                  {es ? 'URL de la imagen *' : 'Image URL *'}
                </span>
                <input
                  required
                  type="url"
                  value={form.imageUrl}
                  onChange={set('imageUrl')}
                  className="input-base"
                  placeholder="https://…"
                />
                <span className="block text-xs text-chess-text-muted mt-1.5">
                  {es
                    ? 'Sube tu imagen a un alojamiento (p. ej. Imgur, Drive público, tu web) y pega aquí el enlace. Debe ser obra original o con derechos acreditados.'
                    : 'Upload your image to a host (e.g. Imgur, public Drive, your site) and paste the link here. It must be original or rights-cleared work.'}
                </span>
              </label>
              {status === 'error' && (
                <p className="md:col-span-2 flex items-center gap-2 text-sm text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  {es ? 'No se pudo enviar: ' : 'Could not submit: '}{errorMsg}
                  {' — '}
                  <a className="underline" href={`mailto:chessaiagency@gmail.com?subject=${encodeURIComponent('Nueva obra: ' + form.title)}`}>
                    {es ? 'enviar por email' : 'send by email'}
                  </a>
                </p>
              )}
              <div className="md:col-span-2 flex items-center gap-3">
                <button type="submit" disabled={status === 'sending'} className="btn-primary disabled:opacity-50">
                  {status === 'sending' ? <Loader2 className="h-5 w-5 animate-spin" /> : <Mail className="h-5 w-5" />}
                  {es ? 'Enviar para revisión' : 'Submit for review'}
                </button>
                <span className="inline-flex items-center gap-1.5 text-xs text-chess-text-muted">
                  <Mail className="h-3.5 w-3.5" /> chessaiagency@gmail.com
                </span>
              </div>
            </form>
          )}
        </section>
        </>
        ) : (
        <>
        {/* Colaboradores anónimos */}
        <motion.section
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="card-elevated p-6 md:p-10"
        >
          <h2 className="font-display text-2xl md:text-3xl font-bold text-chess-text-primary mb-2">
            {es ? 'Colaboradores' : 'Contributors'}
          </h2>
          <p className="text-chess-text-secondary mb-8 max-w-3xl">
            {es
              ? '¿Tienes una obra, un extracto, una curiosidad o un dato de interés sobre ajedrez y arte? Envíalo de forma anónima o con tu alias: lo valoramos y, si enriquece la web, lo publicamos con tu crédito (o sin él, como prefieras). Revisión en 24–48h.'
              : 'Have a work, excerpt, curiosity or interesting fact about chess and art? Send it anonymously or with your alias: we review it and, if it enriches the site, we publish it with your credit (or without, as you prefer). Review within 24–48h.'}
          </p>

          {cstatus === 'ok' ? (
            <div className="flex items-start gap-3 p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <CheckCircle2 className="h-6 w-6 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-emerald-300">{es ? '¡Aporte recibido!' : 'Contribution received!'}</p>
                <p className="text-sm text-chess-text-secondary mt-1">
                  {es
                    ? 'Lo valoraremos en 24–48h. Si se publica, respetaremos tu decisión de crédito o anonimato. Gracias.'
                    : 'We’ll review it within 24–48h. If published, we’ll respect your credit or anonymity choice. Thank you.'}
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={submitCollaborator} className="grid md:grid-cols-2 gap-5">
              <label className="block">
                <span className="block text-sm font-medium text-chess-text-secondary mb-1.5">
                  {es ? 'Alias (o “Anónimo”) *' : 'Alias (or “Anonymous”) *'}
                </span>
                <input required value={cform.alias} onChange={cset('alias')} className="input-base" placeholder={es ? 'Anónimo' : 'Anonymous'} />
              </label>
              <label className="block">
                <span className="block text-sm font-medium text-chess-text-secondary mb-1.5">
                  Email ({es ? 'opcional, para avisarte si se publica' : 'optional, to notify you if published'})
                </span>
                <input type="email" value={cform.email} onChange={cset('email')} className="input-base" placeholder="alias@email.com" />
              </label>
              <label className="block">
                <span className="block text-sm font-medium text-chess-text-secondary mb-1.5">{es ? 'Tipo de aporte *' : 'Contribution type *'}</span>
                <select value={cform.kind} onChange={cset('kind')} className="input-base">
                  {(es ? ['Obra de arte', 'Extracto o texto', 'Curiosidad o dato', 'Otro'] : ['Artwork', 'Excerpt or text', 'Curiosity or fact', 'Other']).map((k) => (
                    <option key={k} value={k} className="bg-chess-surface">{k}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="block text-sm font-medium text-chess-text-secondary mb-1.5">{es ? 'Título *' : 'Title *'}</span>
                <input required value={cform.title} onChange={cset('title')} className="input-base" placeholder={es ? 'El mate del pasillo' : 'The corridor mate'} />
              </label>
              <label className="block md:col-span-2">
                <span className="block text-sm font-medium text-chess-text-secondary mb-1.5">{es ? 'Tu aporte *' : 'Your contribution *'}</span>
                <textarea required value={cform.description} onChange={cset('description')} className="input-base textarea-base" rows={5} />
              </label>
              <label className="block md:col-span-2">
                <span className="block text-sm font-medium text-chess-text-secondary mb-1.5">
                  {es ? 'Enlace o imagen (opcional)' : 'Link or image (optional)'}
                </span>
                <input value={cform.link} onChange={cset('link')} className="input-base" placeholder="https://…" />
              </label>
              {cstatus === 'error' && (
                <p className="md:col-span-2 flex items-center gap-2 text-sm text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  {es ? 'No se pudo enviar: ' : 'Could not submit: '}{cerror}
                  {' — '}
                  <a className="underline" href="mailto:chessaiagency@gmail.com">
                    {es ? 'enviar por email' : 'send by email'}
                  </a>
                </p>
              )}
              <div className="md:col-span-2">
                <button type="submit" disabled={cstatus === 'sending'} className="btn-primary disabled:opacity-50">
                  {cstatus === 'sending' ? <Loader2 className="h-5 w-5 animate-spin" /> : <Mail className="h-5 w-5" />}
                  {es ? 'Enviar aporte' : 'Send contribution'}
                </button>
              </div>
            </form>
          )}
        </motion.section>
        </>
        )}
      </main>
      <SiteFooter locale={locale} />
      <AIChatWidget locale={locale} />
    </div>
  );
}
