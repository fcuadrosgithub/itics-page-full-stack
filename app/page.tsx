'use client';

import { useRouter } from 'next/navigation';
import { Carousel } from 'react-responsive-carousel';
import { Users, UserPlus } from 'lucide-react';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Encabezado */}
      <header className="bg-blue-900 text-white py-6 px-4 shadow-md">
        <h1 className="text-3xl md:text-4xl font-bold text-center leading-snug">
          Instituto Tecnológico Superior del Occidente del Estado de Hidalgo
        </h1>
      </header>

      {/* Barra de navegación */}
      <nav className="bg-blue-700 text-white flex flex-wrap justify-center gap-6 py-4 shadow-md">
        {[
          'Tecnológico',
          'Oferta Educativa',
          'Estudiantes',
          'Egresados',
          'Academia',
          'Posgrado',
          'Transparencia',
          'Buzón',
        ].map((item) => (
          <button
            key={item}
            className="hover:underline hover:text-yellow-300 transition"
            onClick={() => {
              if (item === 'Egresados') router.push('/egresados');
              // Puedes agregar otras rutas si lo deseas
            }}
          >
            {item}
          </button>
        ))}
      </nav>

      {/* Carrusel de imágenes */}
      <section className="max-w-5xl mx-auto mt-8 rounded-xl overflow-hidden shadow-lg">
        <Carousel autoPlay infiniteLoop showThumbs={false}>
          <div>
            <img src="/images/itsoeh1.jpg" alt="Campus 1" />
            <p className="legend">Bienvenidos al ITSOEH</p>
          </div>
          <div>
            <img src="/images/itsoeh2.jpeg" alt="Campus 2" />
            <p className="legend">Formando profesionistas del futuro</p>
          </div>
          <div>
            <img src="/images/itsoeh3.jpg" alt="Campus 3" />
            <p className="legend">Innovación y tecnología</p>
          </div>
        </Carousel>
      </section>

      {/* Sección para egresados */}
      <section className="text-center mt-16 mb-12 px-4">
        <h2 className="text-2xl font-bold mb-3">¿Eres egresado?</h2>
        <p className="text-gray-700 mb-6">
          Consulta o regístrate en nuestra sección de egresados.
        </p>
        <div className="flex justify-center flex-wrap gap-4">
          <button
            onClick={() => router.push('/egresados')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-full shadow transition"
          >
            <Users size={20} />
            Ver egresados
          </button>
          <button
            onClick={() => router.push('/egresados/formulario')}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-full shadow transition"
          >
            <UserPlus size={20} />
            Agregar egresado
          </button>
        </div>
      </section>
    </main>
  );
}
