"use client";

import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { useRouter } from "next/navigation";

interface RedSocial {
  nombre: string;
  url: string;
}

export default function FormularioEgresado() {
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [puesto, setPuesto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [redesSociales, setRedesSociales] = useState<RedSocial[]>([{ nombre: "", url: "" }]);
  const [guardando, setGuardando] = useState(false);

  const agregarRedSocial = () => {
    setRedesSociales([...redesSociales, { nombre: "", url: "" }]);
  };

  const cambiarRedSocial = (index: number, campo: keyof RedSocial, valor: string) => {
    const copia = [...redesSociales];
    copia[index][campo] = valor;
    setRedesSociales(copia);
  };

  const eliminarRedSocial = (index: number) => {
    const copia = [...redesSociales];
    copia.splice(index, 1);
    setRedesSociales(copia);
  };

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);

    try {
      await addDoc(collection(db, "egresados"), {
        nombre,
        puesto,
        descripcion,
        redesSociales: redesSociales.filter(r => r.nombre && r.url), // guardamos solo las completas
        createdAt: serverTimestamp(),
      });
      alert("Egresado guardado correctamente.");
      router.push("/egresados");
    } catch (error) {
      alert("Error guardando egresado: " + error);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form onSubmit={manejarSubmit} className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Agregar Egresado</h1>
      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
        className="w-full mb-3 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Puesto"
        value={puesto}
        onChange={(e) => setPuesto(e.target.value)}
        required
        className="w-full mb-3 p-2 border rounded"
      />
      <textarea
        placeholder="Descripción del trabajo"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        className="w-full mb-3 p-2 border rounded"
      />

      <h2 className="font-semibold mb-2">Redes Sociales</h2>
      {redesSociales.map((red, i) => (
        <div key={i} className="flex gap-2 mb-2 items-center">
          <input
            type="text"
            placeholder="Nombre red social"
            value={red.nombre}
            onChange={(e) => cambiarRedSocial(i, "nombre", e.target.value)}
            className="flex-1 p-2 border rounded"
          />
          <input
            type="url"
            placeholder="URL"
            value={red.url}
            onChange={(e) => cambiarRedSocial(i, "url", e.target.value)}
            className="flex-2 p-2 border rounded"
          />
          {redesSociales.length > 1 && (
            <button
              type="button"
              onClick={() => eliminarRedSocial(i)}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              Eliminar
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={agregarRedSocial}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        + Agregar otra red social
      </button>

      <button
        type="submit"
        disabled={guardando}
        className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {guardando ? "Guardando..." : "Guardar Egresado"}
      </button>
    </form>
  );
}
