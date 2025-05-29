"use client"

import type React from "react"
import { useState } from "react"

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
}

export default function SearchBar({ onSearch, placeholder = "Buscar..." }: SearchBarProps) {
  const [query, setQuery] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value
    setQuery(newQuery)
    onSearch(newQuery) // Llama a la función de búsqueda en tiempo real
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query) // Por si también quieres que funcione al enviar el formulario
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-lg gap-2">
      <div className="relative flex-grow">
        <input
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md py-2 px-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <button type="submit" className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded">
        Buscar
      </button>
    </form>
  )
}
