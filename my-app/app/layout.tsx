import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ITSOEH - Instituto Tecnológico Superior del Occidente del Estado de Hidalgo",
  description: "Portal oficial del Instituto Tecnológico Superior del Occidente del Estado de Hidalgo (ITSOEH)",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="container mx-auto px-4 py-8 flex-1">{children}</main>
            <footer className="bg-gray-900 text-white py-6">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-lg font-bold mb-2">ITSOEH</h3>
                    <p>Carretera Mixquiahuala - Tula, Km 3.5</p>
                    <p>Mixquiahuala de Juárez, Hidalgo, C.P. 42700</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">Contacto</h3>
                    <p>Teléfono: (738) 724 5568</p>
                    <p>Email: contacto@itsoeh.edu.mx</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">Enlaces rápidos</h3>
                    <ul>
                      <li>
                        <a href="#" className="hover:underline">
                          Directorio
                        </a>
                      </li>
                      <li>
                        <a href="#" className="hover:underline">
                          Mapa del sitio
                        </a>
                      </li>
                      <li>
                        <a href="#" className="hover:underline">
                          Aviso de privacidad
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="mt-6 text-center text-sm">
                  <p>© {new Date().getFullYear()} Instituto Tecnológico Superior del Occidente del Estado de Hidalgo. Todos los derechos reservados.</p>
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
