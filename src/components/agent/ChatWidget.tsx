'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Bot, 
  X, 
  Send, 
  Loader2, 
  Sparkles,
  ChessRook,
  Palette,
  BookOpen,
  Brain,
  Zap,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Copy,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import type { AIMessage, ChessContext } from '@/types/combination';

const QUICK_ACTIONS = [
  { id: 'explain-position', label: 'Explicar esta posición', icon: ChessRook },
  { id: 'find-tactic', label: 'Encontrar la táctica', icon: Zap },
  { id: 'why-move', label: '¿Por qué este movimiento?', icon: Brain },
  { id: 'explain-artwork', label: 'Explicar la ilustración', icon: Palette },
  { id: 'beginner', label: 'Explicar como principiante', icon: BookOpen },
  { id: 'similar-puzzle', label: 'Dar puzzle similar', icon: Sparkles },
];

interface AIChatWidgetProps {
  initialContext?: ChessContext;
  locale?: 'es' | 'en';
}

export function AIChatWidget({ initialContext, locale = 'es' }: AIChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  const t = locale === 'es' ? {
    title: 'Chess AI',
    placeholder: 'Pregunta sobre ajedrez, arte o la combinación actual...',
    thinking: 'Pensando...',
    quickActions: 'Acciones rápidas',
    welcome: '¡Hola! Soy tu asistente de Chess Art & AI Academy.',
    capabilities: 'Pregúntame sobre:',
    chess: '♟ Ajedrez (aperturas, táctica, finales, historia)',
    art: '🎨 Arte ajedrecístico (ilustraciones, conceptos visuales)',
    combinations: '📖 Combinaciones históricas del Top 100',
    analysis: '📊 Análisis de posiciones y partidas',
    training: '🧠 Entrenamiento y ejercicios',
  } : {
    title: 'Chess AI',
    placeholder: 'Ask about chess, art, or the current combination...',
    thinking: 'Thinking...',
    quickActions: 'Quick Actions',
    welcome: 'Hello! I\'m your Chess Art & AI Academy assistant.',
    capabilities: 'Ask me about:',
    chess: '♟ Chess (openings, tactics, endgames, history)',
    art: '🎨 Chess Art (illustrations, visual concepts)',
    combinations: '📖 Historical combinations from Top 100',
    analysis: '📊 Position and game analysis',
    training: '🧠 Training and exercises',
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: AIMessage = {
        id: 'welcome',
        role: 'assistant',
        content: `${t.welcome}\n\n${t.capabilities}\n${t.chess}\n${t.art}\n${t.combinations}\n${t.analysis}\n${t.training}`,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, locale]);

  const sendMessage = useCallback(async (content: string, isQuickAction = false) => {
    if (!content.trim() && !isQuickAction) return;

    const userMessage: AIMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setShowQuickActions(false);
    setIsLoading(true);

    try {
      const contextInfo = initialContext ? `
Current combination context:
- Title: ${initialContext.combination?.title || 'N/A'}
- Players: ${initialContext.combination?.whitePlayer} vs ${initialContext.combination?.blackPlayer}
- Year: ${initialContext.combination?.year}
- FEN: ${initialContext.currentFen}
- PGN: ${initialContext.currentPgn}
- Move: ${initialContext.currentMoveIndex >= 0 ? initialContext.moveHistory[initialContext.currentMoveIndex]?.san : 'Initial position'}
` : '';

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })),
          context: contextInfo,
          locale,
        }),
      });

      if (!response.ok) throw new Error('Error en la respuesta');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';
      const assistantMessageId = `assistant-${Date.now()}`;

      const assistantMessage: AIMessage = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          assistantContent += chunk;
          setMessages(prev => prev.map(m => 
            m.id === assistantMessageId ? { ...m, content: assistantContent } : m
          ));
        }
      }
    } catch (error) {
      console.error('AI Chat error:', error);
      const errorMessage: AIMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: locale === 'es' 
          ? 'Lo siento, ha ocurrido un error. Inténtalo de nuevo.' 
          : 'Sorry, an error occurred. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, initialContext, locale]);

  const handleQuickAction = (actionId: string) => {
    const prompts: Record<string, string> = {
      'explain-position': locale === 'es' ? 'Explica la posición actual en detalle' : 'Explain the current position in detail',
      'find-tactic': locale === 'es' ? '¿Cuál es la mejor táctica en esta posición?' : 'What is the best tactic in this position?',
      'why-move': locale === 'es' ? '¿Por qué es fuerte el último movimiento jugado?' : 'Why is the last move played strong?',
      'explain-artwork': locale === 'es' ? 'Explica el concepto artístico de la ilustración actual' : 'Explain the artistic concept of the current illustration',
      'beginner': locale === 'es' ? 'Explícamelo como si fuera principiante' : 'Explain it like I\'m a beginner',
      'similar-puzzle': locale === 'es' ? 'Dame un puzzle táctico similar' : 'Give me a similar tactical puzzle',
    };
    sendMessage(prompts[actionId] || '', true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatContainerRef}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={cn(
              'fixed bottom-6 right-6 z-50 w-full max-w-sm lg:max-w-md',
              'bg-slate-950 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden',
              'flex flex-col'
            )}
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-500/20 rounded-lg">
                  <Bot className="h-5 w-5 text-blue-400" />
                </div>
                <span className="font-semibold text-white">{t.title}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white"
                aria-label="Cerrar chat"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <ScrollArea className="flex-1 min-h-[300px] max-h-[500px] p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    'flex gap-3',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.role === 'assistant' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-blue-400" />
                    </div>
                  )}
                  <div
                    className={cn(
                      'max-w-[80%] rounded-2xl px-4 py-2.5',
                      message.role === 'user'
                        ? 'bg-blue-500/30 text-white rounded-tr-sm'
                        : 'bg-slate-800/50 text-slate-100 rounded-tl-sm border border-slate-700'
                    )}
                  >
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                  </div>
                  {message.role === 'user' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                      <span className="text-xs font-medium text-slate-300">Tú</span>
                    </div>
                  )}
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 justify-start"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />
                  </div>
                  <div className="bg-slate-800/50 text-slate-100 rounded-2xl rounded-tl-sm border border-slate-700 px-4 py-2.5">
                    <div className="flex gap-1">
                      <span className="animate-bounce" style={{ animationDelay: '0ms' }}>●</span>
                      <span className="animate-bounce" style={{ animationDelay: '150ms' }}>●</span>
                      <span className="animate-bounce" style={{ animationDelay: '300ms' }}>●</span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </ScrollArea>

            {showQuickActions && messages.length <= 1 && (
              <div className="border-t border-slate-800 p-3 space-y-2">
                <p className="text-xs font-medium text-slate-500 px-2">{t.quickActions}</p>
                <div className="grid grid-cols-2 gap-2">
                  {QUICK_ACTIONS.map(({ id, label, icon: Icon }) => (
                    <Button
                      key={id}
                      variant="outline"
                      size="sm"
                      className="h-auto py-2 px-3 text-left justify-start gap-2 text-xs border-slate-700 hover:border-blue-500/50 hover:bg-blue-500/10"
                      onClick={() => handleQuickAction(id)}
                    >
                      <Icon className="h-3.5 w-3.5 text-slate-400" />
                      <span>{label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="border-t border-slate-800 p-3 bg-slate-900/50">
              <div className="flex gap-2">
                <Textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={t.placeholder}
                  className="flex-1 min-h-[44px] max-h-[120px] bg-slate-800/50 border-slate-700 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500/20 resize-none"
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e as unknown as React.FormEvent);
                    }
                  }}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!inputValue.trim() || isLoading}
                  className="text-blue-400 hover:text-blue-300 disabled:opacity-30"
                  aria-label="Enviar mensaje"
                >
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(true)}
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-40 lg:hidden p-3 bg-slate-900 border border-slate-700 rounded-full shadow-2xl flex items-center gap-2 text-white hover:bg-slate-800 transition-colors"
        aria-label="Abrir chat con Chess AI"
      >
        <div className="relative">
          <Bot className="h-6 w-6 text-blue-400" />
          <motion.span
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"
          />
        </div>
        <span className="font-medium text-sm">Chess AI</span>
      </motion.button>

      <motion.button
        onClick={() => setIsOpen(true)}
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="hidden lg:fixed bottom-6 right-6 z-40 px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-full shadow-2xl flex items-center gap-2 text-white hover:bg-slate-800 transition-colors"
        aria-label="Abrir chat con Chess AI"
      >
        <div className="relative">
          <Bot className="h-5 w-5 text-blue-400" />
          <motion.span
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full"
          />
        </div>
        <span className="font-medium text-sm">Chess AI</span>
      </motion.button>
    </>
  );
}