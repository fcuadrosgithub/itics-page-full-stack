"use client"

type OfertaTrabajo = {
  id: string
  titulo: string
  empresa: string
  descripcion: string
  requisitos: string
  contacto: string
  salario: string
  ubicacion: string
  tipo: string
}

export default function BolsaTrabajo() {
  // Datos de ejemplo estáticos
  const ofertas: OfertaTrabajo[] = [
    {
      id: '1',
      titulo: 'Desarrollador Frontend React',
      empresa: 'Tech Solutions MX',
      descripcion: 'Buscamos desarrollador frontend con experiencia en React para unirse a nuestro equipo de desarrollo de aplicaciones web.',
      requisitos: '2+ años con React, TypeScript, Next.js. Conocimiento de hooks, context API y Redux.',
      contacto: 'rh@techsolutions.mx',
      salario: '$30,000 - $40,000 MXN',
      ubicacion: 'CDMX (Híbrido)',
      tipo: 'Tiempo completo'
    },
    {
      id: '2',
      titulo: 'Diseñador UX/UI',
      empresa: 'Digital Creatives',
      descripcion: 'Oportunidad para diseñador con experiencia en creación de interfaces y flujos de usuario para aplicaciones móviles y web.',
      requisitos: 'Portafolio demostrable, experiencia con Figma, Adobe XD, conocimiento de principios de UX.',
      contacto: 'talent@digitalcreatives.com',
      salario: '$25,000 - $35,000 MXN',
      ubicacion: 'Remoto',
      tipo: 'Tiempo completo'
    },
    {
      id: '3',
      titulo: 'Ingeniero Backend Node.js',
      empresa: 'Data Systems',
      descripcion: 'Buscamos ingeniero backend para desarrollo y mantenimiento de APIs y servicios en la nube.',
      requisitos: 'Node.js, Express, MongoDB, AWS, arquitectura de microservicios.',
      contacto: 'jobs@datasystems.com',
      salario: '$35,000 - $45,000 MXN',
      ubicacion: 'Guadalajara',
      tipo: 'Tiempo completo'
    },
    {
      id: '4',
      titulo: 'Especialista en Marketing Digital',
      empresa: 'Growth Agency',
      descripcion: 'Posición para manejo de campañas digitales, SEO y redes sociales para clientes internacionales.',
      requisitos: 'Experiencia en Google Ads, Facebook Ads, Google Analytics, inglés avanzado.',
      contacto: 'apply@growthagency.com',
      salario: '$28,000 - $38,000 MXN',
      ubicacion: 'Monterrey',
      tipo: 'Medio tiempo'
    }
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-blue-900 mb-6">Ofertas de Empleo</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ofertas.map((oferta) => (
          <div key={oferta.id} className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow bg-white">
            <h3 className="text-xl font-bold text-blue-900">{oferta.titulo}</h3>
            <p className="text-lg font-semibold text-gray-800 mt-1">{oferta.empresa}</p>
            
            <div className="mt-3 space-y-2">
              <p className="text-gray-600"><span className="font-medium">Ubicación:</span> {oferta.ubicacion}</p>
              <p className="text-gray-600"><span className="font-medium">Tipo:</span> {oferta.tipo}</p>
              <p className="text-gray-600"><span className="font-medium">Salario:</span> {oferta.salario}</p>
            </div>
            
            <div className="mt-4">
              <h4 className="font-medium text-gray-900">Descripción:</h4>
              <p className="text-gray-600 mt-1">{oferta.descripcion}</p>
            </div>
            
            <div className="mt-4">
              <h4 className="font-medium text-gray-900">Requisitos:</h4>
              <p className="text-gray-600 mt-1">{oferta.requisitos}</p>
            </div>
            
            <div className="mt-6">
              <a 
                href={`mailto:${oferta.contacto}?subject=Postulación para ${oferta.titulo}`}
                className="inline-block bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg"
              >
                Postularme
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}