import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export const runtime = 'edge';

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

    const model = process.env.OPENROUTER_API_KEY
      ? openai('openrouter/auto', {
          baseURL: 'https://openrouter.ai/api/v1',
          apiKey: process.env.OPENROUTER_API_KEY,
        })
      : openai('gpt-4o-mini');

    const result = streamText({
      model,
      messages: enrichedMessages,
      temperature: 0.7,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('AI Chat API Error:', error);
    return NextResponse.json(
      { error: 'Error procesando la solicitud' },
      { status: 500 }
    );
  }
}