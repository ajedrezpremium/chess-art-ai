import type { Metadata } from 'next';
import { ArtistasClient } from './ArtistasClient';

export const metadata: Metadata = {
  title: 'Artistas | Chess Art & AI Academy',
  description:
    'Perfiles de artistas de ajedrez y arte. Pablo Iglesias y la serie DIBUJOS. Sube tu obra: revisión editorial en 24–48h.',
};

export default function ArtistasPage() {
  return <ArtistasClient />;
}
