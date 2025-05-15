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

// Aquí empieza el componente
export default function FormularioEgresado() {
  // Todo tu código y hooks aquí
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

  if (loading) return <p className="text-center mt-10">Cargando datos...</p>;

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-blue-800 mb-6">
        {id ? "Editar Egresado" : "Registrar Egresado"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre"
          className="w-full border p-2 rounded"
          required
          disabled={submitLoading}
        />
        <input
          type="text"
          value={puesto}
          onChange={(e) => setPuesto(e.target.value)}
          placeholder="Puesto"
          className="w-full border p-2 rounded"
          required
          disabled={submitLoading}
        />
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Descripción"
          className="w-full border p-2 rounded"
          disabled={submitLoading}
        />

        <h2 className="font-semibold mt-4">Redes Sociales</h2>
        {redesSociales.map((red, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={red.nombre}
              onChange={(e) => actualizarRedSocial(index, "nombre", e.target.value)}
              placeholder="Nombre"
              className="w-1/3 border p-2 rounded"
              disabled={submitLoading}
            />
            <input
              type="url"
              value={red.url}
              onChange={(e) => actualizarRedSocial(index, "url", e.target.value)}
              placeholder="URL"
              className="w-2/3 border p-2 rounded"
              disabled={submitLoading}
            />
            <button
              type="button"
              onClick={() => eliminarRedSocial(index)}
              className="text-red-600 hover:underline"
              disabled={submitLoading}
            >
              Quitar
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={agregarRedSocial}
          className="text-blue-600 hover:underline"
          disabled={submitLoading}
        >
          + Agregar otra red social
        </button>

        <button
          type="submit"
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={submitLoading}
        >
          {submitLoading ? (id ? "Actualizando..." : "Registrando...") : id ? "Actualizar" : "Registrar"}
        </button>
      </form>

      {mensaje && <p className="text-center mt-4 text-green-600">{mensaje}</p>}
    </main>
  );
}
