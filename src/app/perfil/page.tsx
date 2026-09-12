import { Metadata } from 'next';
import { ProfileClient } from './ProfileClient';
export const metadata: Metadata = { title: 'Mi Progreso | Chess Art AI Academy', description: 'Tu progreso tactico, racha diaria y estadisticas.' };
export default function PerfilPage() { return <ProfileClient />; }