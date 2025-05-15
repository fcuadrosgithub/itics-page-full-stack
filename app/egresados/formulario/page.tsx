"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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

export default function FormularioEgresados() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idParam = searchParams.get("id");

  const [nombre, setNombre] = useState("");
  const [puesto, setPuesto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [redesSociales, setRedesSociales] = useState<RedSocial[]>([]);

  // Carga datos para edición si hay id en query
  useEffect(() => {
    if (idParam) {
      const almacenados: Egresado[] = JSON.parse(localStorage.getItem("egresados") || "[]");
      const egresadoEditar = almacenados.find((e) => e.id === Number(idParam));
      if (egresadoEditar) {
        setNombre(egresadoEditar.nombre);
        setPuesto(egresadoEditar.puesto);
        setDescripcion(egresadoEditar.descripcion);
        setRedesSociales(egresadoEditar.redesSociales || []);
      }
    }
  }, [idParam]);

  // Agregar una red social vacía nueva
  const agregarRedSocial = () => {
    setRedesSociales((prev) => [
      ...prev,
      { id: Date.now(), nombre: "", url: "" },
    ]);
  };

  // Actualizar un campo de una red social específica
  const actualizarRedSocial = (id: number, campo: "nombre" | "url", valor: string) => {
    setRedesSociales((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, [campo]: valor } : r
      )
    );
  };

  // Eliminar una red social
  const eliminarRedSocial = (id: number) => {
    setRedesSociales((prev) => prev.filter((r) => r.id !== id));
  };

  const guardarEgresado = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim() || !puesto.trim()) {
      alert("Por favor completa al menos el nombre y el puesto.");
      return;
    }

    // Validar URLs básicas de redes sociales (opcional)
    for (const red of redesSociales) {
      if (red.nombre.trim() && red.url.trim()) {
        try {
          new URL(red.url);
        } catch {
          alert(`La URL de la red social "${red.nombre}" no es válida.`);
          return;
        }
      } else if (red.nombre.trim() || red.url.trim()) {
        alert("Si agregas una red social, ambos campos deben estar completos.");
        return;
      }
    }

    const almacenados: Egresado[] = JSON.parse(localStorage.getItem("egresados") || "[]");

    if (idParam) {
      // Editar existente
      const actualizados = almacenados.map((e) =>
        e.id === Number(idParam)
          ? {
              ...e,
              nombre,
              puesto,
              descripcion,
              redesSociales: redesSociales.filter(r => r.nombre.trim() && r.url.trim()),
            }
          : e
      );
      localStorage.setItem("egresados", JSON.stringify(actualizados));
    } else {
      // Nuevo egresado
      const nuevo: Egresado = {
        id: Date.now(),
        nombre,
        puesto,
        descripcion,
        redesSociales: redesSociales.filter(r => r.nombre.trim() && r.url.trim()),
      };
      localStorage.setItem("egresados", JSON.stringify([...almacenados, nuevo]));
    }

    router.push("/egresados");
  };

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">
        {idParam ? "Editar Egresado" : "Nuevo Egresado"}
      </h1>

      <form onSubmit={guardarEgresado} className="space-y-4 bg-white p-6 rounded-lg shadow-md border border-gray-300">
        <div>
          <label className="block font-semibold mb-1">Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Puesto</label>
          <input
            type="text"
            value={puesto}
            onChange={(e) => setPuesto(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Descripción del trabajo</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            rows={3}
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">Redes Sociales</label>
          {redesSociales.map((red) => (
            <div key={red.id} className="flex gap-2 mb-2 items-center">
              <input
                type="text"
                placeholder="Nombre red social (e.g. LinkedIn)"
                value={red.nombre}
                onChange={(e) => actualizarRedSocial(red.id, "nombre", e.target.value)}
                className="flex-1 border border-gray-300 rounded px-2 py-1"
              />
              <input
                type="url"
                placeholder="URL"
                value={red.url}
                onChange={(e) => actualizarRedSocial(red.id, "url", e.target.value)}
                className="flex-1 border border-gray-300 rounded px-2 py-1"
              />
              <button
                type="button"
                onClick={() => eliminarRedSocial(red.id)}
                className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                aria-label="Eliminar red social"
              >
                X
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={agregarRedSocial}
            className="mt-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + Agregar red social
          </button>
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => router.push("/egresados")}
            className="bg-gray-400 text-gray-900 px-4 py-2 rounded hover:bg-gray-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Guardar
          </button>
        </div>
      </form>
    </main>
  );
}
