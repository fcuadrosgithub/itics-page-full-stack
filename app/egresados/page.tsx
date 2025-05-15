"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaEdit, FaTrash, FaPlus, FaSearch, FaLink } from "react-icons/fa";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

interface RedSocial {
  nombre: string;
  url: string;
}

interface Egresado {
  id: string;
  nombre: string;
  puesto: string;
  descripcion: string;
  redesSociales: RedSocial[];
}

export default function ListaEgresados() {
  const router = useRouter();
  const [egresados, setEgresados] = useState<Egresado[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [eliminandoId, setEliminandoId] = useState<string | null>(null);

  useEffect(() => {
    const cargarEgresados = async () => {
      setLoading(true);
      try {
        const snapshot = await getDocs(collection(db, "egresados"));
        const lista: Egresado[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Egresado[];
        setEgresados(lista);
      } catch (error) {
        console.error("Error cargando egresados:", error);
      }
      setLoading(false);
    };

    cargarEgresados();
  }, []);

  const eliminarEgresado = async (id: string) => {
    if (confirm("¿Seguro que deseas eliminar este egresado?")) {
      setEliminandoId(id);
      try {
        await deleteDoc(doc(db, "egresados", id));
        setEgresados((prev) => prev.filter((e) => e.id !== id));
      } catch (error) {
        console.error("Error eliminando:", error);
      }
      setEliminandoId(null);
    }
  };

  const editarEgresado = (id: string) => {
    router.push(`/egresados/formulario?id=${id}`);
  };

  const filtrarEgresados = () =>
    egresados.filter(
      (e) =>
        e.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        e.puesto.toLowerCase().includes(busqueda.toLowerCase())
    );

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">
        Lista de Egresados
      </h1>

      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre o puesto"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="flex-grow border p-2 rounded"
        />
        <button
          onClick={() => router.push("/egresados/formulario")}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-1"
        >
          <FaPlus /> Agregar
        </button>
      </div>

      {loading ? (
        <p className="text-center">Cargando egresados...</p>
      ) : filtrarEgresados().length === 0 ? (
        <p className="text-center">No se encontraron egresados.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {filtrarEgresados().map(({ id, nombre, puesto, descripcion, redesSociales }) => (
            <li
              key={id}
              className="border p-4 rounded shadow bg-white flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold text-blue-800">{nombre}</h2>
                <p className="text-gray-600 italic">{puesto}</p>
                <p className="mt-2 text-gray-700">{descripcion}</p>

                {redesSociales && redesSociales.length > 0 && (
                  <div className="mt-3 flex gap-3 flex-wrap">
                    {redesSociales.map((red, i) =>
                      red.url ? (
                        <a
                          key={i}
                          href={red.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1"
                          title={red.nombre}
                        >
                          <FaLink /> {red.nombre}
                        </a>
                      ) : null
                    )}
                  </div>
                )}
              </div>

              <div className="mt-4 flex gap-3 justify-end">
                <button
                  onClick={() => editarEgresado(id)}
                  className="text-blue-600 hover:underline flex items-center gap-1"
                  disabled={eliminandoId === id}
                >
                  <FaEdit /> Editar
                </button>
                <button
                  onClick={() => eliminarEgresado(id)}
                  className="text-red-600 hover:underline flex items-center gap-1"
                  disabled={eliminandoId === id}
                >
                  {eliminandoId === id ? "Eliminando..." : <><FaTrash /> Eliminar</>}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
