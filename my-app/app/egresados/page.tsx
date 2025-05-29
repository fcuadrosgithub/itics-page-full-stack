"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import EgresadosForm from "@/components/egresados-form"
import EditarEgresado from "@/components/editar"
import SearchBar from "@/components/search-bar"
import BolsaTrabajo from "@/components/bolsa-trabajo"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, orderBy, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore"
import type { SocialLink } from "@/components/social-links"

type Egresado = {
  id: string
  nombre: string
  puesto: string
  descripcion: string
  redes: SocialLink[]
  imagen?: string
  fechaRegistro?: string
}

type TabType = "directorio" | "registro" | "bolsa"

export default function EgresadosPage() {
  const [egresados, setEgresados] = useState<Egresado[]>([])
  const [searchResults, setSearchResults] = useState<Egresado[]>([])
  const [activeTab, setActiveTab] = useState<TabType>("directorio")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingEgresado, setEditingEgresado] = useState<Egresado | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

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
      setShowAddForm(false)
      setActiveTab("directorio")
    } catch (err) {
      console.error("Error al registrar egresado:", err)
      setError("Error al registrar. Por favor intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateEgresado = async (updatedEgresado: Egresado) => {
    try {
      const updatedEgresados = egresados.map(egresado => 
        egresado.id === updatedEgresado.id ? updatedEgresado : egresado
      )
      
      setEgresados(updatedEgresados)
      setSearchResults(updatedEgresados)
    } catch (err) {
      console.error("Error al actualizar:", err)
      setError("Error al actualizar el egresado.")
    }
  }

  const handleDeleteEgresado = async (id: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este egresado?")) {
      try {
        await deleteDoc(doc(db, "egresados", id))
        const filteredEgresados = egresados.filter(egresado => egresado.id !== id)
        setEgresados(filteredEgresados)
        setSearchResults(filteredEgresados)
      } catch (err) {
        console.error("Error al eliminar:", err)
        setError("Error al eliminar el egresado.")
      }
    }
  }

  if (loading && egresados.length === 0) {
    return <div className="max-w-7xl mx-auto p-6 text-center space-y-6 dark:bg-gray-900 dark:text-gray-300">Cargando...</div>
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-4 dark:bg-gray-900 dark:text-red-400">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 dark:bg-red-900 dark:border-red-600 dark:text-red-300 rounded">
          <p>{error}</p>
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
                  onClick={() => setShowAddForm(true)}
                  className="bg-blue-900 hover:bg-blue-800 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  {egresados.length === 0 ? "Sé el primero en registrarse" : "Agregar nuevo egresado"}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {searchResults.map((egresado) => (
                  <article key={egresado.id} className="border border-gray-300 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 hover:-translate-y-1 relative">
                    <div className="absolute top-3 right-3 flex space-x-2">
                      <button
                        onClick={() => setEditingEgresado(egresado)}
                        className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        title="Editar"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteEgresado(egresado.id)}
                        className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        title="Eliminar"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-start space-x-4">
                      {egresado.imagen ? (
                        <img 
                          src={egresado.imagen} 
                          alt={egresado.nombre}
                          className="w-16 h-16 rounded-full object-cover border-2 border-blue-200"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                      <div>
                        <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-400">{egresado.nombre}</h3>
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-1">{egresado.puesto}</p>
                      </div>
                    </div>

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

      {/* Botón flotante para agregar egresado */}
      {activeTab === "directorio" && (
        <button
          onClick={() => setShowAddForm(true)}
          className="fixed bottom-8 right-8 bg-blue-900 hover:bg-blue-800 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          aria-label="Agregar egresado"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      )}

      {editingEgresado && (
        <EditarEgresado
          egresado={editingEgresado}
          onClose={() => setEditingEgresado(null)}
          onUpdate={handleUpdateEgresado}
        />
      )}

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-2xl bg-white rounded-lg p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-blue-900">Agregar Nuevo Egresado</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <EgresadosForm 
              onAddEgresado={(nuevoEgresado) => {
                handleAddEgresado(nuevoEgresado)
                setShowAddForm(false)
              }} 
            />
          </div>
        </div>
      )}
    </div>
  )
}