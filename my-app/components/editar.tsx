"use client"

import React, { useState, useEffect, useRef } from "react"
import SocialLinks, { type SocialLink } from "./social-links"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

type Egresado = {
  id: string
  nombre: string
  puesto: string
  descripcion: string
  redes: SocialLink[]
  imagen?: string
  fechaRegistro?: string
}

type EditarEgresadoProps = {
  egresado: Egresado
  onClose: () => void
  onUpdate: (updatedEgresado: Egresado) => void
}

export default function EditarEgresado({ egresado, onClose, onUpdate }: EditarEgresadoProps) {
  const [formData, setFormData] = useState({
    nombre: egresado.nombre,
    puesto: egresado.puesto,
    descripcion: egresado.descripcion,
  })
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(egresado.redes || [])
  const [imagen, setImagen] = useState<string | null>(egresado.imagen || null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setFormData({
      nombre: egresado.nombre,
      puesto: egresado.puesto,
      descripcion: egresado.descripcion,
    })
    setSocialLinks(egresado.redes || [])
    setImagen(egresado.imagen || null)
  }, [egresado])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError(null)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.match('image.*')) {
      setError("Por favor, selecciona un archivo de imagen válido")
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("La imagen no debe exceder los 2MB")
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      setImagen(event.target?.result as string)
      setError(null)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setImagen(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const updatedEgresado = {
        ...egresado,
        ...formData,
        redes: socialLinks,
        imagen: imagen || undefined,
      }

      const egresadoRef = doc(db, "egresados", egresado.id)
      await updateDoc(egresadoRef, {
        nombre: formData.nombre,
        puesto: formData.puesto,
        descripcion: formData.descripcion,
        redes: socialLinks,
        imagen: imagen || null,
      })

      onUpdate(updatedEgresado)
      onClose()
    } catch (err) {
      console.error("Error al actualizar:", err)
      setError("Error al actualizar el egresado. Por favor, inténtalo de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-blue-900 dark:bg-blue-800 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-xl font-bold text-white">Editar Egresado</h2>
          <button onClick={onClose} className="text-white hover:text-blue-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 dark:bg-red-900/30 dark:border-red-600 dark:text-red-300 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Imagen */}
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                {imagen ? (
                  <img src={imagen} alt="Previsualización" className="w-32 h-32 rounded-full object-cover border-4 border-blue-200 dark:border-blue-700 shadow-md" />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
                <div className="absolute -bottom-2 right-0 flex space-x-2">
                  {imagen && (
                    <button type="button" onClick={handleRemoveImage} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
              <p className="text-xs text-gray-500 dark:text-gray-400">Formatos: JPG, PNG (Max. 2MB)</p>
            </div>

            {/* Campos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre completo *</label>
                <input id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white" />
              </div>
              <div className="space-y-2">
                <label htmlFor="puesto" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Puesto actual *</label>
                <input id="puesto" name="puesto" value={formData.puesto} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Descripción</label>
                <textarea id="descripcion" name="descripcion" value={formData.descripcion} onChange={handleChange} rows={4} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white" />
              </div>
            </div>

            {/* Redes sociales */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Redes Sociales</label>
              <SocialLinks links={socialLinks} onChange={setSocialLinks} />
            </div>

            {/* Botón */}
            <div className="flex justify-end">
              <button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow">
                {isSubmitting ? "Actualizando..." : "Guardar cambios"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
