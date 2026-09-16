// Posiciones EXACTAS de las combinaciones, por slug.
// Prioridad máxima: si un slug está aquí, su diagrama usa este FEN.
// Cómo corregir una posición:
//   1. Opción código (rápida, versionada): añade `'<slug>': '<FEN>',` abajo.
//   2. Opción base de datos (definitiva): UPDATE combinations SET fen='<FEN>'
//      WHERE slug='<slug>'; (requiere que el FEN tenga los 6 campos).
// La Inmortal ya es correcta en la base y no necesita override.

export const COMBINATION_FEN_OVERRIDES: Record<string, string> = {
  // Ejemplo:
  // 'the-evergreen-game': 'r1bqk2r/pppp1ppp/2n2n2/4p3/2B1P3/2N2N2/PPPP1PPP/R1BQ1RK1 w kq - 0 1',
};
