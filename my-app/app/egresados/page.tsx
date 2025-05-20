"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import EgresadosForm from "@/components/egresados-form"
import SearchBar from "@/components/search-bar"
import BolsaTrabajo from "@/components/bolsa-trabajo"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, orderBy, addDoc } from "firebase/firestore"
import type { SocialLink } from "@/components/social-links"

type Egresado = {
  id: string
  nombre: string
  puesto: string
  descripcion: string
  redes: SocialLink[]
  fechaRegistro?: string
}

type TabType = "directorio" | "registro" | "bolsa"

export default function EgresadosPage() {
  const [egresados, setEgresados] = useState<Egresado[]>([])
  const [searchResults, setSearchResults] = useState<Egresado[]>([])
  const [activeTab, setActiveTab] = useState<TabType>("directorio")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEgresados = async () => {
      try {
        const q = query(collection(db, "egresados"), orderBy("fechaRegistro", "desc"))
        const querySnapshot = await getDocs(q)
        
        const egresadosData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Egresado[]
        
        setEgresados(egresadosData)
        setSearchResults(egresadosData)
      } catch (err) {
        console.error("Error al cargar egresados:", err)
        setError("Error al cargar los datos. Intenta recargar la página.")
      } finally {
        setLoading(false)
      }
    }

    fetchEgresados()
  }, [])

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults(egresados)
      return
    }

    const filteredResults = egresados.filter(
      (egresado) =>
        egresado.nombre.toLowerCase().includes(query.toLowerCase()) ||
        egresado.puesto.toLowerCase().includes(query.toLowerCase()) ||
        egresado.descripcion.toLowerCase().includes(query.toLowerCase())
    )

    setSearchResults(filteredResults)
  }

  const handleAddEgresado = async (nuevoEgresado: Omit<Egresado, 'id'>) => {
    try {
      setLoading(true)
      
      const docRef = await addDoc(collection(db, "egresados"), {
        ...nuevoEgresado,
        fechaRegistro: new Date().toISOString()
      })
      
      const egresadoConId = { ...nuevoEgresado, id: docRef.id }
      const updatedEgresados = [egresadoConId, ...egresados]
      
      setEgresados(updatedEgresados)
      setSearchResults(updatedEgresados)
      setActiveTab("directorio")
    } catch (err) {
      console.error("Error al registrar egresado:", err)
      setError("Error al registrar. Por favor intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  if (loading && egresados.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-6 text-center space-y-6 dark:bg-gray-900 dark:text-gray-300">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-300 rounded w-3/4 mx-auto dark:bg-gray-700"></div>
          <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto dark:bg-gray-700"></div>
        </div>
        <p className="text-lg font-semibold">Cargando egresados...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-4 dark:bg-gray-900 dark:text-red-400">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 dark:bg-red-900 dark:border-red-600 dark:text-red-300 rounded">
          <div className="flex justify-between items-center">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="text-blue-700 hover:underline font-semibold dark:text-blue-400 transition-colors duration-200"
            >
              Recargar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-10 max-w-7xl mx-auto p-6 dark:bg-gray-900 dark:text-gray-300 min-h-screen">
      <header className="text-center space-y-5">
        <h1 className="text-5xl font-extrabold text-blue-900 dark:text-blue-400 drop-shadow-md">
          Comunidad de Egresados
        </h1>
        <p className="text-lg max-w-3xl mx-auto text-gray-700 dark:text-gray-400">
          Conecta con tus compañeros y comparte tu trayectoria profesional
        </p>
        <div className="flex justify-center gap-6">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-blue-900 hover:underline font-medium dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200 group"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor" 
              className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-1"
            >
              <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
            </svg>
            Volver al inicio
          </Link>
        </div>
      </header>

      {/* Tabs */}
      <nav className="border-b border-gray-300 dark:border-gray-700">
        <div className="flex justify-center space-x-8">
          {(["directorio", "registro", "bolsa"] as TabType[]).map((tab) => {
            const label = tab === "directorio" ? "Directorio" : tab === "registro" ? "Registrarse" : "Bolsa de Trabajo"
            const isActive = activeTab === tab
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative py-3 px-8 font-semibold text-lg transition-all duration-300 rounded-t-md
                  ${isActive
                    ? "text-blue-900 dark:text-blue-400 border-b-4 border-blue-900 dark:border-blue-400 bg-blue-50/50 dark:bg-gray-800/80"
                    : "text-gray-500 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50"}
                `}
              >
                {label}
                {isActive && (
                  <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-blue-600 dark:bg-blue-500 animate-pulse"></span>
                )}
              </button>
            )
          })}
        </div>
      </nav>

      {/* Contenido según pestaña */}
      <section>
        {activeTab === "directorio" ? (
          <div className="space-y-8">
            <div className="flex justify-center">
              <SearchBar 
                onSearch={handleSearch} 
                placeholder="Buscar por nombre, puesto o descripción..."
              />
            </div>

            {searchResults.length === 0 ? (
              <div className="text-center py-20 space-y-6 text-gray-500 dark:text-gray-400">
                <p className="text-xl font-medium">
                  {egresados.length === 0 
                    ? "Aún no hay egresados registrados." 
                    : "No se encontraron resultados para tu búsqueda."}
                </p>
                <button
                  onClick={() => setActiveTab("registro")}
                  className="bg-blue-900 hover:bg-blue-800 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  {egresados.length === 0 ? "Sé el primero en registrarse" : "Intentar con otra búsqueda"}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {searchResults.map((egresado) => (
                  <article
                    key={egresado.id}
                    className="border border-gray-300 dark:border-gray-700 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 hover:-translate-y-1"
                  >
                    <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-400">{egresado.nombre}</h3>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-1">{egresado.puesto}</p>
                    <p className="mt-4 text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">{egresado.descripcion}</p>

                    {egresado.redes && egresado.redes.length > 0 && (
                      <div className="mt-6 flex flex-wrap gap-3">
                        {egresado.redes.map((link) => (
                          <a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-blue-700 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-sm px-3 py-1.5 rounded bg-blue-50 dark:bg-blue-900/30 transition-all duration-200 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                          >
                            <span>{link.platform}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5">
                              <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
                            </svg>
                          </a>
                        ))}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === "registro" ? (
          <div className="max-w-3xl mx-auto p-6 rounded-lg bg-gray-50 dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
            <EgresadosForm onAddEgresado={handleAddEgresado} />
          </div>
        ) : (
          <BolsaTrabajo />
        )}
      </section>
    </div>
  )
}