'use client';

import { useRouter } from 'next/navigation';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gray-100 font-sans">
      {/* Header */}
      <header className="bg-blue-900 text-white py-4 px-6">
        <h1 className="text-3xl font-bold text-center">
          ITSOEH - Instituto Tecnológico Superior del Occidente del Estado de Hidalgo
        </h1>
      </header>

      {/* Navbar */}
      <nav className="bg-blue-700 text-white flex flex-wrap justify-center space-x-4 py-3 text-sm md:text-base">
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
          <a
            key={item}
            href="#"
            className="hover:underline"
            onClick={() => {
              if (item === 'Egresados') router.push('/egresados');
            }}
          >
            {item}
          </a>
        ))}
      </nav>

      {/* Carrusel */}
      <section className="max-w-4xl mx-auto mt-8">
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

      {/* Acceso a sección de egresados */}
      <section className="text-center mt-10">
        <h2 className="text-xl font-semibold mb-2">¿Eres egresado?</h2>
        <p className="mb-4">Consulta o regístrate en nuestra sección de egresados.</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => router.push('/egresados')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Ver egresados
          </button>
          <button
            onClick={() => router.push('/egresados/formulario')}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Agregar egresado
          </button>
        </div>
      </section>
    </main>
  );
}
