import type { Metadata } from "next";
import { GeistSans, GeistMono } from "geist/font";
import "./globals.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const metadata: Metadata = {
  title: "ITSOEH - Módulo de Egresados",
  description: "Sistema de gestión de egresados del Instituto Tecnológico Superior del Occidente del Estado de Hidalgo",
  authors: [{ name: "ITSOEH", url: "https://itsoeh.edu.mx" }],
  keywords: ["ITSOEH", "egresados", "tecnológico", "Hidalgo"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="antialiased bg-gray-50">
        {children}
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </body>
    </html>
  );
}