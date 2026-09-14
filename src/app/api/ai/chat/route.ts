import { NextRequest, NextResponse } from 'next/server';
import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { searchArtCatalogue, formatArtContext } from '@/lib/ai/art-knowledge';

export const runtime = 'nodejs';

const SYSTEM_PROMPT_ES = `Eres el guía experto de "Chess Art & AI Academy". Dominas tanto la teoría, historia y táctica del ajedrez (aperturas, combinaciones clásicas, jugadores históricos) como el análisis artístico de las ilustraciones de la serie "Top 100 Combinaciones de la Historia".

Ayudas a los usuarios a entender las combinaciones mostradas, explicas las jugadas del PGN activo si el usuario te lo pide, y comentas la intención artística de cada pieza cuando el usuario pregunta por ella.
Dispones de un catálogo curatorial de 200 obras donde el ajedrez es protagonista (pintura, escultura, manuscritos, carteles, cine, fotografía, música, arte urbano); cuando el contexto incluya fichas del catálogo, úsalas y cita título, autor y año.

**Personalidad:** Gran Maestro + Historiador de Ajedrez + Experto en Arte + Profesor.
**Tono:** Conciso, cercano, apasionado, instructivo y accesible.
**Formato de respuesta preferido:**
### IDEA
Una explicación corta.

### WHY?
Razón táctica/estratégica.

### BEST MOVE
Movimiento recomendado.

### CONCEPT
Concepto táctico/artístico.

### TRY THIS
Ejercicio o pregunta para el usuario.

NUNCA respondas con enormes bloques de texto. Enseña, no solo des la solución.`;

const SYSTEM_PROMPT_EN = `You are the expert guide for "Chess Art & AI Academy". You master both chess theory, history, and tactics (openings, classic combinations, historical players) and the artistic analysis of illustrations from the "Top 100 Combinations in History" series.

You help users understand the displayed combinations, explain moves from the active PGN when asked, and comment on the artistic intent of each piece when questioned.
You have a curated catalogue of 200 works where chess takes center stage (painting, sculpture, manuscripts, posters, cinema, photography, music, street art); when the context includes catalogue entries, use them and cite title, artist and year.

**Personality:** Grandmaster + Chess Historian + Art Expert + Teacher.
**Tone:** Concise, approachable, passionate, instructive, and accessible.
**Preferred response format:**
### IDEA
Brief explanation.

### WHY?
Tactical/strategic reason.

### BEST MOVE
Recommended move.

### CONCEPT
Tactical/artistic concept.

### TRY THIS
Exercise or question for the user.

NEVER respond with huge blocks of text. Teach, don't just give the solution.`;

/** Cadena de modelos OpenRouter: primero el configurado (o auto), luego fallbacks gratuitos. */
export function getOpenRouterChain(): string[] {
  const chain = [
    process.env.OPENROUTER_MODEL || 'openrouter/auto',
    'meta-llama/llama-3.3-70b-instruct:free',
    'qwen/qwen-2.5-72b-instruct:free',
    'deepseek/deepseek-chat-v3-0324:free',
  ];
  return [...new Set(chain)];
}

export async function GET() {
  const provider = process.env.OPENROUTER_API_KEY
    ? 'openrouter'
    : process.env.OPENAI_API_KEY
      ? 'openai'
      : 'none';
  return NextResponse.json({
    ok: provider !== 'none',
    provider,
    model: provider === 'openrouter' ? getOpenRouterChain()[0] : 'gpt-4o-mini',
    models: provider === 'openrouter' ? getOpenRouterChain() : ['gpt-4o-mini'],
    keyPresent: provider !== 'none',
  });
}

export async function POST(req: NextRequest) {
  try {
    const { messages, context, locale = 'es' } = await req.json();

    const systemPrompt = locale === 'es' ? SYSTEM_PROMPT_ES : SYSTEM_PROMPT_EN;

    // RAG ligero: buscar en el catálogo de 200 obras según la última pregunta.
    const lastUser = [...messages].reverse().find((m: { role: string }) => m.role === 'user');
    let ragContext = '';
    if (lastUser && typeof lastUser.content === 'string' && lastUser.content.trim().length >= 3) {
      const matches = searchArtCatalogue(lastUser.content, locale === 'en' ? 'en' : 'es', 3);
      ragContext = formatArtContext(matches, locale === 'en' ? 'en' : 'es');
    }
    const fullContext = [context, ragContext].filter(Boolean).join('\n\n');

    const enrichedMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...(fullContext ? [{ role: 'system' as const, content: fullContext }] : []),
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant' | 'system',
        content: m.content,
      })),
    ];

    // OpenAI directa: un solo modelo económico.
    if (!process.env.OPENROUTER_API_KEY && process.env.OPENAI_API_KEY) {
      try {
        const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const result = streamText({
          model: openai('gpt-4o-mini'),
          messages: enrichedMessages,
          temperature: 0.7,
        });
        return result.toTextStreamResponse();
      } catch (error) {
        console.error('AI Chat stream error:', error);
        const detail = error instanceof Error ? error.message : String(error);
        return NextResponse.json(
          {
            error:
              locale === 'es'
                ? `El proveedor de IA devolvió un error: ${detail}`
                : `The AI provider returned an error: ${detail}`,
          },
          { status: 502 }
        );
      }
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        {
          error:
            locale === 'es'
              ? 'IA no configurada: falta OPENROUTER_API_KEY u OPENAI_API_KEY en el servidor. Configúrala en Vercel y redespliega.'
              : 'AI not configured: missing OPENROUTER_API_KEY or OPENAI_API_KEY on the server. Set it in Vercel and redeploy.',
        },
        { status: 503 }
      );
    }

    // OpenRouter: probar la cadena de modelos en orden y streamear el primero que responda.
    const openrouter = createOpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY,
    });
    const failures: string[] = [];

    for (const modelId of getOpenRouterChain()) {
      try {
        const result = streamText({
          model: openrouter(modelId),
          messages: enrichedMessages,
          temperature: 0.7,
        });
        // Preflight: exigir el primer chunk antes de responder (con timeout).
        // Si el modelo falla (404, 429, sin free), se pasa al siguiente sin romper el stream.
        const iterator = result.textStream[Symbol.asyncIterator]();
        const first = await Promise.race([
          iterator.next(),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('timeout')), 20000)
          ),
        ]);
        if (first.done && !first.value) throw new Error('empty response');

        const encoder = new TextEncoder();
        const out = new ReadableStream({
          async start(controller) {
            try {
              if (first.value) controller.enqueue(encoder.encode(first.value));
              for await (const chunk of { [Symbol.asyncIterator]: () => iterator }) {
                controller.enqueue(encoder.encode(chunk));
              }
              controller.close();
            } catch (e) {
              controller.error(e);
            }
          },
        });
        console.log(`AI Chat streaming with model: ${modelId}`);
        return new Response(out, {
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });
      } catch (error) {
        const detail = error instanceof Error ? error.message : String(error);
        console.warn(`AI Chat model ${modelId} failed, trying next:`, detail);
        failures.push(`${modelId}: ${detail}`);
      }
    }

    return NextResponse.json(
      {
        error:
          locale === 'es'
            ? `Todos los modelos de IA fallaron. Últimos errores: ${failures.join(' | ').slice(0, 500)}`
            : `All AI models failed. Latest errors: ${failures.join(' | ').slice(0, 500)}`,
      },
      { status: 502 }
    );
  } catch (error) {
    console.error('AI Chat API Error:', error);
    return NextResponse.json(
      { error: 'Error procesando la solicitud' },
      { status: 500 }
    );
  }
}