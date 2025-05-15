"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaEdit, FaTrash, FaPlus, FaSearch, FaLink } from "react-icons/fa";

interface RedSocial {
  id: number;
  nombre: string;
  url: string;
}

interface Egresado {
  id: number;
  nombre: string;
  puesto: string;
  descripcion: string;
  redesSociales: RedSocial[];
}

export default function ListaEgresados() {
  const router = useRouter();
  const [egresados, setEgresados] = useState<Egresado[]>([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const almacenados = JSON.parse(localStorage.getItem("egresados") || "[]");
    setEgresados(almacenados);
  }, []);

  const eliminarEgresado = (id: number) => {
    if (confirm("¿Seguro que deseas eliminar este egresado?")) {
      const filtrados = egresados.filter((e) => e.id !== id);
      localStorage.setItem("egresados", JSON.stringify(filtrados));
      setEgresados(filtrados);
    }
  };

  const editarEgresado = (id: number) => {
    router.push(`/egresados/formulario?id=${id}`);
  };

  const filtrarEgresados = () => {
    return egresados.filter(
      (e) =>
        e.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        e.puesto.toLowerCase().includes(busqueda.toLowerCase()) ||
        e.descripcion.toLowerCase().includes(busqueda.toLowerCase())
    );
  };

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center text-blue-800 mb-6">Lista de Egresados</h1>

      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => router.push("/egresados/formulario")}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          <FaPlus /> Nuevo Egresado
        </button>

        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-1 bg-white">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre, puesto o descripción"
            className="outline-none"
          />
        </div>
      </div>

      {filtrarEgresados().length === 0 ? (
        <p className="text-center text-gray-500">No hay egresados registrados o que coincidan con la búsqueda.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtrarEgresados().map((e) => (
            <li key={e.id} className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
              <h2 className="text-xl font-semibold text-blue-700">{e.nombre}</h2>
              <p className="text-gray-700 font-medium">{e.puesto}</p>
              <p className="text-gray-600 italic mt-1">{e.descripcion}</p>
              {/* Redes sociales */}
              {e.redesSociales && e.redesSociales.length > 0 && (
                <div className="mt-2 space-y-1">
                  {e.redesSociales.map((red) => (
                    <a
                      key={red.id}
                      href={red.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline flex items-center gap-1"
                    >
                      <FaLink /> {red.nombre}
                    </a>
                  ))}
                </div>
              )}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => editarEgresado(e.id)}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <FaEdit /> Editar
                </button>
                <button
                  onClick={() => eliminarEgresado(e.id)}
                  className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <FaTrash /> Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
