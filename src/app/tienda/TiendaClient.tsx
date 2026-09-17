'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { AIChatWidget } from '@/components/agent/ChatWidget';
import { ShoppingBag, BookOpen, Crown, Palette, Clapperboard, ExternalLink, Info, Search, Store, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface ShopLink {
  name: string;
  url: string;
  descEs: string;
  descEn: string;
  country?: string;
}

interface ShopCategory {
  id: string;
  icon: typeof BookOpen;
  titleEs: string;
  titleEn: string;
  links: ShopLink[];
}

const CATEGORIES: ShopCategory[] = [
  {
    id: 'libros',
    icon: BookOpen,
    titleEs: 'Libros de ajedrez',
    titleEn: 'Chess books',
    links: [
      {
        name: 'ChessBase Shop',
        url: 'https://shop.chessbase.com/en',
        descEs: 'Editorial oficial: DVDs, libros digitales y bases de datos. Edición India disponible.',
        descEn: 'Official publisher: DVDs, e-books and databases. Indian edition available.',
        country: 'EU · US · IN',
      },
      {
        name: 'Everyman Chess',
        url: 'https://www.everymanchess.com',
        descEs: 'Editorial británica de referencia: aperturas, estrategia y finales.',
        descEn: 'Leading British publisher: openings, strategy and endgames.',
        country: 'UK · INT',
      },
      {
        name: 'Quality Chess',
        url: 'https://www.qualitychess.co.uk',
        descEs: 'Libros de alto nivel para jugadores de club y profesionales.',
        descEn: 'High-level books for club players and professionals.',
        country: 'UK · INT',
      },
      {
        name: 'New In Chess',
        url: 'https://www.newinchess.com',
        descEs: 'Revista y editorial holandesa legendaria desde 1984.',
        descEn: 'Legendary Dutch magazine and publisher since 1984.',
        country: 'NL · INT',
      },
      {
        name: 'Casa del Libro',
        url: 'https://www.casadellibro.com/libros-de-ajedrez/121000000',
        descEs: 'Librería española con sección de ajedrez en castellano.',
        descEn: 'Spanish bookshop with a chess section in Spanish.',
        country: 'ES',
      },
      {
        name: 'Amazon Libros',
        url: 'https://www.amazon.es/s?k=ajedrez+libro',
        descEs: 'Catálogo internacional con envío a España, México y Latinoamérica.',
        descEn: 'International catalogue shipping to Spain, Mexico and Latin America.',
        country: 'ES · MX · LATAM',
      },
      {
        name: 'Fnac',
        url: 'https://www.fnac.es',
        descEs: 'Libros y cine de ajedrez con tiendas en España, Francia y Portugal.',
        descEn: 'Chess books and films with stores in Spain, France and Portugal.',
        country: 'ES · FR · PT',
      },
      {
        name: 'Gandhi',
        url: 'https://www.gandhi.com.mx',
        descEs: 'Principal librería de México: busca su sección de ajedrez.',
        descEn: 'Mexico’s leading bookshop: check its chess section.',
        country: 'MX',
      },
      {
        name: 'Buscalibre',
        url: 'https://www.buscalibre.com',
        descEs: 'Librería online con envíos a toda Latinoamérica y España.',
        descEn: 'Online bookshop shipping across Latin America and Spain.',
        country: 'LATAM · ES',
      },
      {
        name: 'Waterstones',
        url: 'https://www.waterstones.com',
        descEs: 'Referente británico para libros de ajedrez en inglés.',
        descEn: 'British reference for chess books in English.',
        country: 'UK',
      },
    ],
  },
  {
    id: 'tableros',
    icon: Crown,
    titleEs: 'Tableros y piezas',
    titleEn: 'Boards & pieces',
    links: [
      {
        name: 'House of Staunton',
        url: 'https://www.houseofstaunton.com',
        descEs: 'Piezas Staunton artesanales, proveedor de campeonatos oficiales.',
        descEn: 'Handcrafted Staunton pieces, supplier of official championships.',
        country: 'US · INT',
      },
      {
        name: 'DGT',
        url: 'https://www.dgt.nl',
        descEs: 'Tableros y relojes electrónicos oficiales de la FIDE.',
        descEn: 'Official FIDE electronic boards and clocks.',
        country: 'NL · INT',
      },
      {
        name: 'ChessBaron',
        url: 'https://www.chessbaron.co.uk',
        descEs: 'Tienda europea clásica: juegos, relojes y accesorios.',
        descEn: 'Classic European shop: sets, clocks and accessories.',
        country: 'UK · EU',
      },
      {
        name: 'Chess House',
        url: 'https://www.chesshouse.com',
        descEs: 'Tienda estadounidense con guía de compra y envío internacional.',
        descEn: 'US shop with buying guides and international shipping.',
        country: 'US · INT',
      },
      {
        name: 'ChessBase India',
        url: 'https://chessbase.in',
        descEs: 'Portal y tienda oficial para India, cuna de campeones.',
        descEn: 'Official portal and shop for India, home of champions.',
        country: 'IN',
      },
      {
        name: 'Mercado Libre',
        url: 'https://www.mercadolibre.com',
        descEs: 'Marketplace líder en Latinoamérica para tableros y libros.',
        descEn: 'Latin America’s leading marketplace for sets and books.',
        country: 'LATAM',
      },
    ],
  },
  {
    id: 'arte',
    icon: Palette,
    titleEs: 'Arte y obra gráfica',
    titleEn: 'Art & prints',
    links: [
      {
        name: 'Tienda Museo del Prado',
        url: 'https://tienda.museodelprado.es',
        descEs: 'Reproducciones y obra gráfica del museo (envío internacional).',
        descEn: 'Museum reproductions and prints (international shipping).',
        country: 'ES · INT',
      },
      {
        name: 'The MET Store',
        url: 'https://store.metmuseum.org',
        descEs: 'Tienda oficial del Metropolitan Museum of Art de Nueva York.',
        descEn: 'Official store of New York’s Metropolitan Museum of Art.',
        country: 'US · INT',
      },
      {
        name: 'National Gallery Shop',
        url: 'https://shop.nationalgallery.org.uk',
        descEs: 'Láminas y libros de la pinacoteca londinense.',
        descEn: 'Prints and books from London’s National Gallery.',
        country: 'UK · INT',
      },
      {
        name: 'Rijksmuseum Shop',
        url: 'https://shop.rijksmuseum.nl',
        descEs: 'Reproducciones de los maestros holandeses.',
        descEn: 'Reproductions of the Dutch masters.',
        country: 'NL · INT',
      },
    ],
  },
  {
    id: 'cine',
    icon: Clapperboard,
    titleEs: 'Cine y documentales',
    titleEn: 'Film & documentaries',
    links: [
      {
        name: 'Filmin',
        url: 'https://www.filmin.es',
        descEs: 'Plataforma con cine de autor: busca «ajedrez» en su catálogo.',
        descEn: 'Arthouse streaming platform: search “chess” in its catalogue.',
        country: 'ES · MX',
      },
      {
        name: 'MUBI',
        url: 'https://mubi.com',
        descEs: 'Cine de autor internacional, disponible en 190 países.',
        descEn: 'International arthouse cinema, available in 190 countries.',
        country: 'INT',
      },
      {
        name: 'Amazon',
        url: 'https://www.amazon.es/s?k=ajedrez+pelicula',
        descEs: 'Películas y documentales sobre ajedrez en DVD y streaming.',
        descEn: 'Chess films and documentaries on DVD and streaming.',
        country: 'ES · MX · US',
      },
    ],
  },
  {
    id: 'plataformas',
    icon: Clapperboard,
    titleEs: 'Jugar y aprender online',
    titleEn: 'Play & learn online',
    links: [
      {
        name: 'Chess.com',
        url: 'https://www.chess.com',
        descEs: 'La mayor comunidad mundial: juego, lecciones y tienda.',
        descEn: 'The world’s largest community: play, lessons and shop.',
        country: 'INT',
      },
      {
        name: 'Lichess',
        url: 'https://lichess.org',
        descEs: 'Ajedrez libre, gratuito y sin publicidad para todo el mundo.',
        descEn: 'Free, open-source chess with no ads, for everyone.',
        country: 'INT',
      },
      {
        name: 'Chessable',
        url: 'https://www.chessable.com',
        descEs: 'Cursos interactivos con repetición espaciada, en varios idiomas.',
        descEn: 'Interactive courses with spaced repetition, in several languages.',
        country: 'INT',
      },
      {
        name: 'ChessBase',
        url: 'https://www.chessbase.com',
        descEs: 'Bases de datos y retransmisiones de la élite mundial.',
        descEn: 'Databases and elite live broadcasts.',
        country: 'EU · INT',
      },
    ],
  },
];

export function TiendaClient() {
  const [locale, setLocale] = useState<'es' | 'en'>('es');
  useEffect(() => {
    const h = (e: CustomEvent<'es' | 'en'>) => setLocale(e.detail);
    window.addEventListener('toggle-language', h as EventListener);
    return () => window.removeEventListener('toggle-language', h as EventListener);
  }, []);
  const es = locale === 'es';
  const [query, setQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ shop: '', email: '', web: '', country: '', kind: 'Librería', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const q = query.trim().toLowerCase();
  const filtered = CATEGORIES.map((cat) => ({
    ...cat,
    links: cat.links.filter(
      (l) =>
        !q ||
        l.name.toLowerCase().includes(q) ||
        l.descEs.toLowerCase().includes(q) ||
        l.descEn.toLowerCase().includes(q) ||
        (l.country || '').toLowerCase().includes(q)
    ),
  })).filter((cat) => cat.links.length > 0);

  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');
    try {
      const res = await fetch('/api/shops/apply', {
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

  return (
    <div className="min-h-screen bg-chess-bg">
      <Header locale={locale} />
      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-36 md:pt-44 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-chess-surface/50 border border-chess-border/50 rounded-full text-sm font-medium text-chess-gold mb-4">
            <ShoppingBag className="h-4 w-4" />
            {es ? 'Enlaces oficiales' : 'Official links'}
          </span>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-chess-text-primary">
            {es ? 'Tienda' : 'Shop'}
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-chess-text-secondary">
            {es
              ? 'Selección de tiendas y editoriales oficiales para informarte y comprar obras relacionadas con el ajedrez: libros, cuadros, dibujos y películas.'
              : 'A selection of official shops and publishers to explore and buy chess-related works: books, paintings, drawings and films.'}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-chess-text-muted" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={es ? 'Buscar tiendas, libros, países…' : 'Search shops, books, countries…'}
                aria-label={es ? 'Buscar en la tienda' : 'Search the shop'}
                className="w-full pl-12 pr-4 py-3 bg-chess-surface/60 border border-chess-border/50 rounded-xl text-chess-text-primary placeholder:text-chess-text-muted focus:outline-none focus:border-chess-gold/60 focus:ring-2 focus:ring-chess-gold/20"
              />
            </div>
            <button onClick={() => { setShowForm(true); setStatus('idle'); }} className="btn-primary whitespace-nowrap">
              <Store className="h-5 w-5" />
              {es ? 'Alta como punto de venta' : 'Register as a seller'}
            </button>
          </div>
        </motion.div>

        {q && filtered.length === 0 && (
          <p className="text-chess-text-secondary mb-8">
            {es ? 'Sin resultados para tu búsqueda.' : 'No results for your search.'}
          </p>
        )}

        <div className="space-y-12">
          {filtered.map((cat, ci) => (
            <motion.section
              key={cat.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: ci * 0.08 }}
            >
              <h2 className="flex items-center gap-3 font-display text-xl md:text-2xl font-bold text-chess-text-primary mb-6">
                <span className="w-10 h-10 rounded-xl bg-chess-gold/10 border border-chess-gold/30 flex items-center justify-center">
                  <cat.icon className="h-5 w-5 text-chess-gold" />
                </span>
                {es ? cat.titleEs : cat.titleEn}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {cat.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="card-interactive group p-5 flex flex-col"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-chess-text-primary group-hover:text-chess-gold transition-colors">
                          {link.name}
                        </h3>
                        {link.country && (
                          <span className="mt-1 inline-block text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-chess-gold/10 text-chess-gold border border-chess-gold/30">
                            {link.country}
                          </span>
                        )}
                      </div>
                      <ExternalLink className="h-4 w-4 text-chess-text-muted group-hover:text-chess-gold transition-colors flex-shrink-0 mt-0.5" />
                    </div>
                    <p className="text-sm text-chess-text-secondary leading-relaxed flex-1">
                      {es ? link.descEs : link.descEn}
                    </p>
                    <span className="mt-3 text-xs font-medium text-chess-gold">
                      {es ? 'Enlace oficial ↗' : 'Official link ↗'}
                    </span>
                  </a>
                ))}
              </div>
            </motion.section>
          ))}
        </div>

        <p className="mt-12 flex items-start gap-2 text-sm text-chess-text-muted max-w-3xl">
          <Info className="h-4 w-4 mt-0.5 flex-shrink-0 text-chess-gold" />
          {es
            ? 'Todos los enlaces llevan a webs oficiales externas. ChessArt AI no vende directamente ni recibe comisión: es una guía editorial independiente.'
            : 'All links go to external official websites. ChessArt AI does not sell directly nor earns commission: it is an independent editorial guide.'}
        </p>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setShowForm(false)}
            >
              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 24, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="card-elevated w-full max-w-lg p-6 md:p-8 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label={es ? 'Alta como punto de venta' : 'Register as a seller'}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h2 className="font-display text-xl md:text-2xl font-bold text-chess-text-primary">
                    {es ? 'Alta como punto de venta' : 'Register as a seller'}
                  </h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="rounded-lg p-1.5 text-chess-text-muted hover:text-chess-text-primary hover:bg-chess-surface-elevated/60"
                    aria-label={es ? 'Cerrar' : 'Close'}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-sm text-chess-text-secondary mb-6">
                  {es
                    ? '¿Tienes una tienda o editorial? Solicita aparecer en la guía. Revisamos cada alta en 24–48h.'
                    : 'Own a shop or publishing house? Request to join the guide. We review each application within 24–48h.'}
                </p>
                {status === 'ok' ? (
                  <div className="flex items-start gap-3 p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                    <CheckCircle2 className="h-6 w-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-emerald-300">{es ? '¡Solicitud recibida!' : 'Application received!'}</p>
                      <p className="text-sm text-chess-text-secondary mt-1">
                        {es
                          ? 'La revisaremos en 24–48h y te avisaremos por email.'
                          : 'We’ll review it within 24–48h and notify you by email.'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={submit} className="grid gap-4">
                    <label className="block">
                      <span className="block text-sm font-medium text-chess-text-secondary mb-1.5">{es ? 'Nombre de la tienda *' : 'Shop name *'}</span>
                      <input required value={form.shop} onChange={set('shop')} className="input-base" placeholder="Ajedrez Premium" />
                    </label>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <label className="block">
                        <span className="block text-sm font-medium text-chess-text-secondary mb-1.5">Email *</span>
                        <input required type="email" value={form.email} onChange={set('email')} className="input-base" placeholder="tienda@email.com" />
                      </label>
                      <label className="block">
                        <span className="block text-sm font-medium text-chess-text-secondary mb-1.5">{es ? 'País *' : 'Country *'}</span>
                        <input required value={form.country} onChange={set('country')} className="input-base" placeholder="España" />
                      </label>
                    </div>
                    <label className="block">
                      <span className="block text-sm font-medium text-chess-text-secondary mb-1.5">Web *</span>
                      <input required type="url" value={form.web} onChange={set('web')} className="input-base" placeholder="https://…" />
                    </label>
                    <label className="block">
                      <span className="block text-sm font-medium text-chess-text-secondary mb-1.5">{es ? 'Tipo *' : 'Type *'}</span>
                      <select value={form.kind} onChange={set('kind')} className="input-base">
                        {(es ? ['Librería', 'Tableros y piezas', 'Arte', 'Cine', 'Plataforma online', 'Otro'] : ['Bookshop', 'Boards & pieces', 'Art', 'Film', 'Online platform', 'Other']).map((k) => (
                          <option key={k} value={k} className="bg-chess-surface">{k}</option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className="block text-sm font-medium text-chess-text-secondary mb-1.5">{es ? 'Mensaje (opcional)' : 'Message (optional)'}</span>
                      <textarea value={form.message} onChange={set('message')} className="input-base textarea-base" rows={3} />
                    </label>
                    {status === 'error' && (
                      <p className="flex items-center gap-2 text-sm text-red-400">
                        <AlertCircle className="h-4 w-4" />
                        {es ? 'No se pudo enviar: ' : 'Could not submit: '}{errorMsg}
                      </p>
                    )}
                    <button type="submit" disabled={status === 'sending'} className="btn-primary disabled:opacity-50">
                      {status === 'sending' ? <Loader2 className="h-5 w-5 animate-spin" /> : <Store className="h-5 w-5" />}
                      {es ? 'Enviar solicitud' : 'Send application'}
                    </button>
                  </form>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <SiteFooter locale={locale} />
      <AIChatWidget locale={locale} />
    </div>
  );
}
