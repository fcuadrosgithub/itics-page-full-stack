"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebaseConfig";
import {
  collection,
  addDoc,
  updateDoc,
  getDoc,
  doc,
} from "firebase/firestore";

interface RedSocial {
  nombre: string;
  url: string;
}

export default function FormularioEgresado() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [nombre, setNombre] = useState("");
  const [puesto, setPuesto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [redesSociales, setRedesSociales] = useState<RedSocial[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    const obtenerDatos = async () => {
      if (id) {
        setLoading(true);
        try {
          const docRef = doc(db, "egresados", id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setNombre(data.nombre);
            setPuesto(data.puesto);
            setDescripcion(data.descripcion);
            setRedesSociales(data.redesSociales || []);
          } else {
            setMensaje("Egresado no encontrado.");
          }
        } catch (error) {
          setMensaje("Error al cargar datos.");
          console.error(error);
        }
        setLoading(false);
      }
    };
    obtenerDatos();
  }, [id]);

  const agregarRedSocial = () => {
    setRedesSociales([...redesSociales, { nombre: "", url: "" }]);
  };

  const actualizarRedSocial = (index: number, campo: keyof RedSocial, valor: string) => {
    const nuevasRedes = [...redesSociales];
    nuevasRedes[index][campo] = valor;
    setRedesSociales(nuevasRedes);
  };

  const eliminarRedSocial = (index: number) => {
    const nuevasRedes = redesSociales.filter((_, i) => i !== index);
    setRedesSociales(nuevasRedes);
  };

  const validarDatos = () => {
    if (!nombre.trim() || !puesto.trim()) {
      setMensaje("Nombre y puesto son obligatorios.");
      return false;
    }
    for (const red of redesSociales) {
      if (red.url && !/^https?:\/\/.+\..+/.test(red.url)) {
        setMensaje(`URL inválida en red social: ${red.nombre || "sin nombre"}`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");
    if (!validarDatos()) return;

    const datos = { nombre, puesto, descripcion, redesSociales };
    setSubmitLoading(true);
    try {
      if (id) {
        await updateDoc(doc(db, "egresados", id), datos);
        setMensaje("¡Egresado actualizado con éxito!");
      } else {
        await addDoc(collection(db, "egresados"), datos);
        setMensaje("¡Egresado registrado exitosamente!");
      }
      setTimeout(() => router.push("/egresados"), 1500);
    } catch (error) {
      console.error("Error al guardar:", error);
      setMensaje("Ocurrió un error al guardar el egresado.");
    }
    setSubmitLoading(false);
  };

  if (loading) return <p className="text-center mt-10 text-gray-600">Cargando datos...</p>;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-6">
      <section className="bg-white max-w-3xl w-full rounded-2xl shadow-lg p-8 sm:p-12">
        <h1 className="text-4xl font-extrabold text-blue-900 text-center mb-10 tracking-wide">
          {id ? "Editar Egresado" : "Registrar Egresado"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 text-lg placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            required
            disabled={submitLoading}
          />
          <input
            type="text"
            value={puesto}
            onChange={(e) => setPuesto(e.target.value)}
            placeholder="Puesto"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 text-lg placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            required
            disabled={submitLoading}
          />
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Descripción"
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 text-lg placeholder-gray-400 resize-none
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            disabled={submitLoading}
          />

          <h2 className="text-xl font-semibold text-blue-700 mt-8 mb-4">Redes Sociales</h2>

          {redesSociales.map((red, index) => (
            <div key={index} className="flex gap-3 items-center mb-3">
              <input
                type="text"
                value={red.nombre}
                onChange={(e) => actualizarRedSocial(index, "nombre", e.target.value)}
                placeholder="Nombre (ej. LinkedIn)"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-gray-800 placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                disabled={submitLoading}
              />
              <input
                type="url"
                value={red.url}
                onChange={(e) => actualizarRedSocial(index, "url", e.target.value)}
                placeholder="URL (https://...)"
                className="flex-2 border border-gray-300 rounded-lg px-3 py-2 text-gray-800 placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                disabled={submitLoading}
              />
              <button
                type="button"
                onClick={() => eliminarRedSocial(index)}
                className="text-red-600 hover:text-red-800 font-semibold transition"
                disabled={submitLoading}
                aria-label={`Quitar red social ${red.nombre || index + 1}`}
              >
                ✕
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={agregarRedSocial}
            className="inline-block text-blue-600 font-semibold hover:text-blue-800 transition focus:outline-none"
            disabled={submitLoading}
          >
            + Agregar otra red social
          </button>

          <button
            type="submit"
            className="mt-8 w-full bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-700
            focus:outline-none focus:ring-4 focus:ring-blue-300 transition disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={submitLoading}
          >
            {submitLoading ? (id ? "Actualizando..." : "Registrando...") : id ? "Actualizar" : "Registrar"}
          </button>
        </form>

        {mensaje && (
          <p
            className={`mt-6 text-center font-medium ${
              mensaje.includes("error") ? "text-red-600" : "text-green-600"
            }`}
          >
            {mensaje}
          </p>
        )}
      </section>
    </main>
  );
}
