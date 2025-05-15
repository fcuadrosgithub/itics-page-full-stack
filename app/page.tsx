'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <main style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Bienvenido a la página de egresados</h1>
      <p>Presiona el botón para ver o agregar egresados.</p>
      <button onClick={() => router.push('/egresados')}>Ver egresados</button>
      <button onClick={() => router.push('/egresados/formulario')} style={{ marginLeft: '1rem' }}>
        Agregar egresado
      </button>
    </main>
  );
}
