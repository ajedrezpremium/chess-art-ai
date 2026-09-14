import { NextRequest, NextResponse } from 'next/server';
import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

export const runtime = 'nodejs';

const SYSTEM_PROMPT_ES = `Eres el guía experto de "Chess Art & AI Academy". Dominas tanto la teoría, historia y táctica del ajedrez (aperturas, combinaciones clásicas, jugadores históricos) como el análisis artístico de las ilustraciones de la serie "Top 100 Combinaciones de la Historia".

Ayudas a los usuarios a entender las combinaciones mostradas, explicas las jugadas del PGN activo si el usuario te lo pide, y comentas la intención artística de cada pieza cuando el usuario pregunta por ella.

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

export async function GET() {
  const provider = process.env.OPENROUTER_API_KEY
    ? 'openrouter'
    : process.env.OPENAI_API_KEY
      ? 'openai'
      : 'none';
  return NextResponse.json({
    ok: provider !== 'none',
    provider,
    model: provider === 'openrouter'
      ? (process.env.OPENROUTER_MODEL || 'openrouter/auto')
      : 'gpt-4o-mini',
    keyPresent: provider !== 'none',
  });
}

export async function POST(req: NextRequest) {
  try {
    const { messages, context, locale = 'es' } = await req.json();

    const systemPrompt = locale === 'es' ? SYSTEM_PROMPT_ES : SYSTEM_PROMPT_EN;

    const enrichedMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...(context ? [{ role: 'system' as const, content: context }] : []),
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant' | 'system',
        content: m.content,
      })),
    ];

    // Configure model based on available API key
    let model;
    if (process.env.OPENROUTER_API_KEY) {
      const openrouter = createOpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: process.env.OPENROUTER_API_KEY,
      });
      model = openrouter(process.env.OPENROUTER_MODEL || 'openrouter/auto');
    } else if (process.env.OPENAI_API_KEY) {
      const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });
      model = openai('gpt-4o-mini');
    } else {
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

    try {
      const result = streamText({
        model,
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
  } catch (error) {
    console.error('AI Chat API Error:', error);
    return NextResponse.json(
      { error: 'Error procesando la solicitud' },
      { status: 500 }
    );
  }
}