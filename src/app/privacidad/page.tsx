'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { AIChatWidget } from '@/components/agent/ChatWidget';

const CONTENT = {
  es: {
    title: 'Política de Privacidad',
    updated: 'Última actualización: septiembre de 2026',
    intro:
      'Chess Art & AI Academy respeta tu privacidad. Esta página explica de forma clara qué datos tratamos, por qué y cuáles son tus derechos.',
    sections: [
      {
        h: '1. Datos que recogemos',
        p: 'La web se puede explorar sin crear cuenta. Si contactas con nosotros, trataremos tu nombre, correo y mensaje solo para responderte. Si usas el agente Chess AI Art, tu pregunta y el contexto de la posición visible se envían al proveedor de IA (OpenRouter u OpenAI) únicamente para generar la respuesta.',
      },
      {
        h: '2. Finalidad y base jurídica',
        p: 'Respondemos a tus consultas y mejoramos el contenido educativo (interés legítimo y consentimiento al enviarnos el formulario). Nunca vendemos ni cedemos tus datos con fines publicitarios.',
      },
      {
        h: '3. Conservación',
        p: 'Los mensajes de contacto se conservan el tiempo necesario para atender tu solicitud. Las conversaciones del chat viven en tu navegador durante la sesión, salvo que decidas guardarlas.',
      },
      {
        h: '4. Tus derechos',
        p: 'Puedes pedir acceso, rectificación, supresión, oposición, limitación y portabilidad de tus datos escribiendo a pablo.iglesias@chessart.ai. También puedes reclamar ante la autoridad de control de tu país.',
      },
      {
        h: '5. Menores',
        p: 'El contenido es apto para todos los públicos, pero los menores de 14 años deben usar el formulario con ayuda de un adulto.',
      },
      {
        h: '6. Cambios',
        p: 'Publicaremos aquí cualquier cambio de esta política con su fecha de actualización.',
      },
    ],
  },
  en: {
    title: 'Privacy Policy',
    updated: 'Last updated: September 2026',
    intro:
      'Chess Art & AI Academy respects your privacy. This page clearly explains what data we process, why, and what your rights are.',
    sections: [
      {
        h: '1. Data we collect',
        p: 'You can browse the site without an account. If you contact us, we process your name, email and message only to reply. If you use the Chess AI Art agent, your question and the visible position context are sent to the AI provider (OpenRouter or OpenAI) solely to generate the answer.',
      },
      {
        h: '2. Purpose and legal basis',
        p: 'We reply to your enquiries and improve our educational content (legitimate interest and consent when you submit the form). We never sell or share your data for advertising.',
      },
      {
        h: '3. Retention',
        p: 'Contact messages are kept only as long as needed to handle your request. Chat conversations live in your browser during the session unless you choose to save them.',
      },
      {
        h: '4. Your rights',
        p: 'You may request access, rectification, erasure, objection, restriction and portability of your data at pablo.iglesias@chessart.ai. You may also lodge a complaint with your national supervisory authority.',
      },
      {
        h: '5. Children',
        p: 'Content is suitable for all audiences, but children under 14 should use the form with adult help.',
      },
      {
        h: '6. Changes',
        p: 'Any change to this policy will be published here with its update date.',
      },
    ],
  },
} as const;

export default function PrivacidadPage() {
  const [locale, setLocale] = useState<'es' | 'en'>('es');

  useEffect(() => {
    const handleLanguageChange = (e: CustomEvent<'es' | 'en'>) => {
      setLocale(e.detail);
    };
    window.addEventListener('toggle-language', handleLanguageChange as EventListener);
    return () => window.removeEventListener('toggle-language', handleLanguageChange as EventListener);
  }, []);

  const t = CONTENT[locale];

  return (
    <div className="min-h-screen bg-chess-bg">
      <Header />
      <main className="pt-20 lg:pt-24">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto px-6 sm:px-8 py-12"
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold text-chess-text-primary mb-2">
            {t.title}
          </h1>
          <p className="text-sm text-chess-text-muted mb-8">{t.updated}</p>
          <p className="text-chess-text-secondary leading-relaxed mb-8">{t.intro}</p>
          <div className="space-y-6">
            {t.sections.map((s) => (
              <section key={s.h} className="glass p-5 sm:p-6">
                <h2 className="font-display text-lg font-semibold text-chess-gold mb-2">{s.h}</h2>
                <p className="text-chess-text-secondary leading-relaxed text-[15px]">{s.p}</p>
              </section>
            ))}
          </div>
        </motion.article>
      </main>
      <SiteFooter />
      <AIChatWidget locale={locale} />
    </div>
  );
}
