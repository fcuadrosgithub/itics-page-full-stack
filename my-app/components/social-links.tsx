"use client"

import { useState } from "react"

export type SocialLink = {
  id: string
  platform: string
  url: string
}

interface SocialLinksProps {
  links: SocialLink[]
  onChange: (links: SocialLink[]) => void
}

export default function SocialLinks({ links, onChange }: SocialLinksProps) {
  const [newPlatform, setNewPlatform] = useState("")
  const [newUrl, setNewUrl] = useState("")

  const addLink = () => {
    if (!newPlatform || !newUrl) return

    const newLink: SocialLink = {
      id: Date.now().toString(),
      platform: newPlatform,
      url: newUrl,
    }

    onChange([...links, newLink])
    setNewPlatform("")
    setNewUrl("")
  }

  const removeLink = (id: string) => {
    onChange(links.filter((link) => link.id !== id))
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Redes Sociales</h3>
        <p className="text-sm text-gray-500">Añade tus perfiles de redes sociales</p>
      </div>

      {links.length > 0 && (
        <div className="space-y-3">
          {links.map((link) => (
            <div key={link.id} className="flex items-center gap-2 p-3 border rounded-md bg-gray-50">
              <div className="flex-grow">
                <p className="font-medium">{link.platform}</p>
                <p className="text-sm text-gray-500 truncate">{link.url}</p>
              </div>
              <button
                type="button"
                onClick={() => removeLink(link.id)}
                className="text-gray-500 hover:text-red-500"
                aria-label={`Eliminar ${link.platform}`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-3 items-end">
        <div>
          <label htmlFor="platform" className="block text-sm font-medium text-gray-700 mb-1">
            Plataforma
          </label>
          <select
            id="platform"
            value={newPlatform}
            onChange={(e) => setNewPlatform(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            <option value="">Seleccionar</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Twitter">Twitter</option>
            <option value="Facebook">Facebook</option>
            <option value="Instagram">Instagram</option>
            <option value="GitHub">GitHub</option>
            <option value="Sitio Web">Sitio Web</option>
          </select>
        </div>

        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
            URL
          </label>
          <input
            id="url"
            type="url"
            placeholder="https://"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <button
          type="button"
          onClick={addLink}
          disabled={!newPlatform || !newUrl}
          className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded disabled:opacity-50 flex items-center"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Añadir
        </button>
      </div>
    </div>
  )
}
