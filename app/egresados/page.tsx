'use client';

import React, { useEffect, useState } from "react";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaTiktok } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { getDocs, collection, deleteDoc, doc } from 'firebase/firestore';
import { db } from "@/src/lib/firebaseConfig";

type RedSocial = {
  tipo: RedesKeys;
  url: string;
};

type RedesKeys = 'Facebook' | 'Twitter' | 'LinkedIn' | 'Instagram' | 'TikTok';

type Egresado = {
  id: string;
  nombre: string;
  puesto: string;
  foto?: string; // clave en localStorage
  redes: RedSocial[];
};

const quitarAcentos = (texto: string) =>
  texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const iconosRedes: Record<RedesKeys, () => React.ReactNode> = {
  Facebook: () => <FaFacebook className="text-blue-600" />,
  Twitter: () => <FaTwitter className="text-sky-400" />,
  LinkedIn: () => <FaLinkedin className="text-blue-700" />,
  Instagram: () => <FaInstagram className="text-pink-500" />,
  TikTok: () => <FaTiktok className="text-black" />,
};

export default function Egresados() {
  const [egresados, setEgresados] = useState<Egresado[]>([]);
  const [filtro, setFiltro] = useState("");
  const router = useRouter();

  const cargarEgresados = async () => {
    const snapshot = await getDocs(collection(db, "egresados"));
    const lista: Egresado[] = [];
    snapshot.forEach((docu) => {
      const data = docu.data();
      lista.push({
        id: docu.id,
        nombre: data.nombre,
        puesto: data.puesto,
        redes: data.redes || [],
      });
    });
    setEgresados(lista);
  };

  useEffect(() => {
    cargarEgresados();
  }, []);

  const eliminar = async (id: string) => {
    if (!confirm("¿Deseas eliminar este egresado?")) return;
    await deleteDoc(doc(db, "egresados", id));
    localStorage.removeItem(`foto_egresado_${id}`);
    cargarEgresados();
  };

  // Filtrar por nombre o puesto, sin acentos y case insensitive
  const listaFiltrada = egresados.filter(
    (e) =>
      quitarAcentos(e.nombre).includes(quitarAcentos(filtro)) ||
      quitarAcentos(e.puesto).includes(quitarAcentos(filtro))
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4">Egresados</h2>
      <input
        type="text"
        placeholder="Buscar por nombre o puesto"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />
      <button
        onClick={() => router.push("/egresados/formulario")}
        className="bg-green-600 text-white px-4 py-2 rounded mb-4"
      >
        + Agregar egresado
      </button>

      {listaFiltrada.length === 0 ? (
        <p>No hay egresados que coincidan.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {listaFiltrada.map((egresado) => {
            const fotoLocal = localStorage.getItem(`foto_egresado_${egresado.id}`);

            return (
              <div
                key={egresado.id}
                className="border rounded p-4 flex flex-col items-center"
              >
                {fotoLocal ? (
                  <img
                    src={fotoLocal}
                    alt={`Foto de ${egresado.nombre}`}
                    className="w-32 h-32 rounded-full object-cover mb-2"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center mb-2">
                    <span className="text-gray-500">Sin foto</span>
                  </div>
                )}
                <h3 className="text-xl font-semibold">{egresado.nombre}</h3>
                <p className="text-gray-600 mb-2">{egresado.puesto}</p>

                <div className="flex space-x-3 mb-4">
                  {egresado.redes.map((red, i) => {
                    const Icono = iconosRedes[red.tipo];
                    return Icono ? (
                      <a
                        key={i}
                        href={red.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-2xl hover:opacity-70"
                        title={red.tipo}
                      >
                        {Icono()}
                      </a>
                    ) : null;
                  })}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => router.push(`/egresados/formulario?id=${egresado.id}`)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => eliminar(egresado.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
