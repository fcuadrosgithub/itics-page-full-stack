"use client"

import React, { useState, useRef } from "react"
import SocialLinks, { type SocialLink } from "./social-links"

type Egresado = {
  id?: string
  nombre: string
  puesto: string
  descripcion: string
  redes: SocialLink[]
  imagen?: string
  fechaRegistro?: string
}

type EgresadosFormProps = {
  onAddEgresado?: (egresado: Egresado) => void
}

export default function EgresadosForm({ onAddEgresado }: EgresadosFormProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    puesto: "",
    descripcion: "",
  })
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [imagen, setImagen] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    // Validación de nombre
    if (!formData.nombre.trim()) {
      errors.nombre = "El nombre es requerido"
    } else if (formData.nombre.length < 3) {
      errors.nombre = "El nombre debe tener al menos 3 caracteres"
    }

    // Validación de puesto
    if (!formData.puesto.trim()) {
      errors.puesto = "El puesto es requerido"
    }

    // Validación de descripción
    if (!formData.descripcion.trim()) {
      errors.descripcion = "La descripción es requerida"
    } else if (formData.descripcion.length < 20) {
      errors.descripcion = "La descripción debe tener al menos 20 caracteres"
    }

    // Validación de redes sociales
    socialLinks.forEach((link, index) => {
      if (!link.url.trim()) {
        errors[`redes-${index}`] = "La URL no puede estar vacía"
      } else if (!validateUrl(link.url)) {
        errors[`redes-${index}`] = "Ingresa una URL válida (incluye http:// o https://)"
      }
    })

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    
    // Limpiar error cuando el usuario escribe
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = {...prev}
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.match('image.*')) {
      setError("Por favor, selecciona un archivo de imagen válido (JPEG, PNG)")
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

  const handleSocialLinksChange = (links: SocialLink[]) => {
    setSocialLinks(links)
    // Limpiar errores de redes sociales cuando cambian
    setFieldErrors(prev => {
      const newErrors = {...prev}
      Object.keys(newErrors).forEach(key => {
        if (key.startsWith('redes-')) {
          delete newErrors[key]
        }
      })
      return newErrors
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const newEgresado: Egresado = {
        ...formData,
        redes: socialLinks.map(link => ({
          ...link,
          // Asegurar que la URL tenga protocolo si no lo tiene
          url: link.url.startsWith('http') ? link.url : `https://${link.url}`
        })),
        imagen: imagen || undefined,
        fechaRegistro: new Date().toISOString()
      }

      if (onAddEgresado) {
        onAddEgresado(newEgresado)
      }

      setSubmitted(true)
      setFormData({ nombre: "", puesto: "", descripcion: "" })
      setSocialLinks([])
      setImagen(null)
      setFieldErrors({})
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Foto de perfil
            </label>
            <div className="flex items-center space-x-4">
              {imagen ? (
                <div className="relative">
                  <img 
                    src={imagen} 
                    alt="Previsualización" 
                    className="w-20 h-20 rounded-full object-cover border-2 border-blue-200"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                  id="imagenInput"
                />
                <label
                  htmlFor="imagenInput"
                  className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {imagen ? "Cambiar imagen" : "Subir imagen"}
                </label>
                <p className="text-xs text-gray-500 mt-1">Formatos: JPG, PNG (Max. 2MB)</p>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre completo <span className="text-red-500">*</span>
            </label>
            <input
              id="nombre"
              name="nombre"
              placeholder="Ej. Juan Pérez González"
              value={formData.nombre}
              onChange={handleChange}
              className={`w-full border ${fieldErrors.nombre ? 'border-red-500' : 'border-gray-300'} rounded-md p-2`}
            />
            {fieldErrors.nombre && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.nombre}</p>
            )}
          </div>

          <div>
            <label htmlFor="puesto" className="block text-sm font-medium text-gray-700 mb-1">
              Puesto actual <span className="text-red-500">*</span>
            </label>
            <input
              id="puesto"
              name="puesto"
              placeholder="Ej. Gerente de Proyectos"
              value={formData.puesto}
              onChange={handleChange}
              className={`w-full border ${fieldErrors.puesto ? 'border-red-500' : 'border-gray-300'} rounded-md p-2`}
            />
            {fieldErrors.puesto && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.puesto}</p>
            )}
          </div>

          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción de tu trabajo <span className="text-red-500">*</span>
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              placeholder="Describe brevemente tus responsabilidades y logros en tu puesto actual (mínimo 20 caracteres)"
              value={formData.descripcion}
              onChange={handleChange}
              rows={4}
              className={`w-full border ${fieldErrors.descripcion ? 'border-red-500' : 'border-gray-300'} rounded-md p-2`}
            />
            {fieldErrors.descripcion && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.descripcion}</p>
            )}
          </div>

          <SocialLinks 
            links={socialLinks} 
            onChange={handleSocialLinksChange} 
          />
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