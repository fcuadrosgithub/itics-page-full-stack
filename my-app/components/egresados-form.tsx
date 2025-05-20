"use client"

import React, { useState } from "react"
import SocialLinks, { type SocialLink } from "./social-links"

type Egresado = {
  id?: string // Firebase generará automáticamente el ID
  nombre: string
  puesto: string
  descripcion: string
  redes: SocialLink[]
  fechaRegistro?: string
}

type EgresadosFormProps = {
  onAddEgresado?: (egresado: Egresado) => void // Hacer opcional ya que usaremos Firestore en el padre
}

export default function EgresadosForm({ onAddEgresado }: EgresadosFormProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    puesto: "",
    descripcion: "",
  })
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError(null) // Limpiar errores al editar
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const newEgresado: Egresado = {
        ...formData,
        redes: socialLinks,
        fechaRegistro: new Date().toISOString()
      }

      // Solo llamamos a la función que pasa el padre para guardar el dato
      if (onAddEgresado) {
        onAddEgresado(newEgresado)
      }

      setSubmitted(true)
      setFormData({ nombre: "", puesto: "", descripcion: "" })
      setSocialLinks([])
    } catch (err) {
      console.error("Error al enviar:", err)
      setError("Error al enviar el formulario. Por favor, inténtalo de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="w-full max-w-2xl mx-auto border rounded-lg p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-center text-blue-900 mb-4">
          ¡Gracias por registrarte!
        </h2>
        <p className="text-center mb-6">
          Tu información ha sido recibida correctamente.
        </p>
        <div className="text-center">
          <button
            onClick={() => {
              setFormData({ nombre: "", puesto: "", descripcion: "" })
              setSocialLinks([])
              setSubmitted(false)
            }}
            className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded"
          >
            Registrar otro egresado
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto border rounded-lg p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-blue-900 mb-2">
        Registro de Egresados
      </h2>
      <p className="text-gray-600 mb-6">
        Completa el formulario con tus datos profesionales actuales
      </p>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="nombre"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nombre completo
            </label>
            <input
              id="nombre"
              name="nombre"
              placeholder="Ej. Juan Pérez González"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div>
            <label
              htmlFor="puesto"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Puesto actual
            </label>
            <input
              id="puesto"
              name="puesto"
              placeholder="Ej. Gerente de Proyectos"
              value={formData.puesto}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div>
            <label
              htmlFor="descripcion"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Descripción de tu trabajo
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              placeholder="Describe brevemente tus responsabilidades y logros en tu puesto actual"
              value={formData.descripcion}
              onChange={handleChange}
              required
              rows={4}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <SocialLinks links={socialLinks} onChange={setSocialLinks} />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-900 hover:bg-blue-800 text-white py-2 rounded disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Enviando..." : "Registrar información"}
        </button>
      </form>
    </div>
  )
}
