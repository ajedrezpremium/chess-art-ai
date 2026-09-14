import type { Metadata } from 'next';
import { TiendaClient } from './TiendaClient';

export const metadata: Metadata = {
  title: 'Tienda | Chess Art & AI Academy',
  description:
    'Enlaces oficiales para comprar libros, tableros, arte y cine relacionados con el ajedrez.',
};

export default function TiendaPage() {
  return <TiendaClient />;
}
