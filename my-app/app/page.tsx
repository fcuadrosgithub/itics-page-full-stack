"use client"

import Link from "next/link"

export default function Home() {
  return (
    <div className="space-y-10 p-4 md:p-8">
      <section className="py-10 rounded-lg bg-gray-100 dark:bg-gray-800 transition-colors">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-blue-900 dark:text-blue-200">Instituto Tecnológico Superior del Occidente del Estado de Hidalgo</h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            "Formando profesionales con excelencia académica y valores humanos"
          </p>
          <div className="flex justify-center gap-4 mt-6 flex-wrap">
            <Link href="/aspirantes" className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded-lg transition-colors">
              Oferta Educativa
            </Link>
            <Link href="/publico" className="border border-blue-900 dark:border-blue-200 text-blue-900 dark:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-900 px-6 py-3 rounded-lg transition-colors">
              Eventos Académicos
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Estudiantes",
            description: "Acceso a servicios escolares, plataformas educativas y calendario académico.",
            link: "/alumnos",
          },
          {
            title: "Docentes",
            description: "Recursos pedagógicos, sistemas de evaluación y desarrollo docente.",
            link: "/docentes",
          },
          {
            title: "Aspirantes",
            description: "Convocatorias, procesos de admisión y planes de estudio.",
            link: "/aspirantes",
          },
          {
            title: "Egresados",
            description: "Vinculación laboral, bolsa de trabajo y educación continua.",
            link: "/egresados",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="border rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow bg-white dark:bg-gray-900 dark:border-gray-700"
          >
            <h2 className="text-xl font-bold mb-2 text-blue-900 dark:text-blue-300">{item.title}</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{item.description}</p>
            <Link
              href={item.link}
              className="inline-flex items-center text-blue-900 dark:text-blue-400 hover:underline"
            >
              Más información
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        ))}
      </section>

      <section className="py-6">
        <h2 className="text-2xl font-bold mb-6 text-blue-900 dark:text-blue-200">Noticias y Eventos ITSOEH</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Ceremonia de Graduación 2024",
              date: "5 de julio, 2024",
              description: "Celebración de la generación 2019-2024 en el Auditorio Principal."
            },
            {
              title: "Feria de Ciencias y Tecnología",
              date: "20-22 de agosto, 2024",
              description: "Exposición de proyectos innovadores de estudiantes del ITSOEH."
            },
            {
              title: "Convocatoria Beca Excelencia",
              date: "Hasta 15 de septiembre, 2024",
              description: "Apoyo económico para estudiantes con promedio mayor a 9.5."
            },
          ].map((item, index) => (
            <div key={index} className="border rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow bg-white dark:bg-gray-900 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{item.date}</p>
              <h3 className="text-lg font-semibold mb-2 text-blue-800 dark:text-blue-300">{item.title}</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">{item.description}</p>
              <Link
                href="#"
                className="inline-flex items-center text-blue-900 dark:text-blue-400 hover:underline"
              >
                Ver detalles
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="py-10 bg-blue-900 dark:bg-blue-950 text-white rounded-lg transition-colors">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Visión ITSOEH</h2>
          <p className="text-xl max-w-4xl mx-auto">
            "Ser una institución de educación superior tecnológica reconocida por su calidad académica, vinculación con los sectores productivos y contribución al desarrollo regional."
          </p>
          <div className="flex justify-center gap-4 mt-6 flex-wrap">
            <Link
              href="/contacto"
              className="bg-white text-blue-900 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Contacto
            </Link>
            <Link
              href="/campus-virtual"
              className="border border-white hover:bg-blue-800 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Campus Virtual
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
