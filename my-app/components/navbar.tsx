"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import ThemeToggle from "./theme-toggle" // Asegúrate de tener este componente creado

const navItems = [
  { name: "Inicio", href: "/" },
  { name: "Alumnos", href: "/alumnos" },
  { name: "Docentes", href: "/docentes" },
  { name: "Aspirantes", href: "/aspirantes" },
  { name: "Egresados", href: "/egresados" },
  { name: "Público en general", href: "/publico" },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="bg-blue-900 text-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              ITSOEH
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-6 items-center">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`hover:text-gray-300 ${
                  pathname === item.href ? "font-bold border-b-2 border-white" : ""
                }`}
              >
                {item.name}
              </Link>
            ))}
            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
              {isOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-900 pb-4">
          <div className="container mx-auto px-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block py-2 hover:bg-blue-800 rounded px-3 ${
                  pathname === item.href ? "font-bold bg-blue-800" : ""
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 px-3">
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
