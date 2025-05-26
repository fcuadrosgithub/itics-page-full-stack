'use client';

import React, { useEffect, useState } from "react";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaTiktok } from 'react-icons/fa';
import { FiEdit, FiTrash } from 'react-icons/fi';
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
  carrera?: string;
  descripcionTrabajo?: string;
  foto?: string;
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
  const [filtroTexto, setFiltroTexto] = useState("");
  const [filtroCarrera, setFiltroCarrera] = useState("");
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
        carrera: data.carrera,
        descripcionTrabajo: data.descripcionTrabajo,
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

  const carrerasUnicas = Array.from(
    new Set(egresados.map((e) => e.carrera).filter(Boolean))
  ) as string[];

  const listaFiltrada = egresados.filter((e) => {
    const textoMatch =
      quitarAcentos(e.nombre).includes(quitarAcentos(filtroTexto)) ||
      quitarAcentos(e.puesto).includes(quitarAcentos(filtroTexto));
    const carreraMatch = filtroCarrera === "" || e.carrera === filtroCarrera;
    return textoMatch && carreraMatch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <h2 className="text-4xl font-bold mb-6 text-center text-blue-900">Egresados</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre o puesto"
          value={filtroTexto}
          onChange={(e) => setFiltroTexto(e.target.value)}
          className="border border-gray-300 p-3 rounded-md flex-1 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        />

        <select
          value={filtroCarrera}
          onChange={(e) => setFiltroCarrera(e.target.value)}
          className="border border-gray-300 p-3 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value="">Todas las carreras</option>
          {carrerasUnicas.map((carrera) => (
            <option key={carrera} value={carrera}>
              {carrera}
            </option>
          ))}
        </select>

        <button
          onClick={() => router.push("/egresados/formulario")}
          className="bg-blue-700 text-white px-5 py-3 rounded-md hover:bg-blue-800 shadow-lg transition"
        >
          + Agregar egresado
        </button>
      </div>

      {listaFiltrada.length === 0 ? (
        <p className="text-center text-gray-500">No hay egresados que coincidan.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {listaFiltrada.map((egresado) => {
            const fotoLocal = localStorage.getItem(`foto_egresado_${egresado.id}`);

            return (
              <div
                key={egresado.id}
                className="bg-white border border-blue-300 rounded-2xl shadow-2xl p-5 flex flex-col items-center relative hover:shadow-blue-400 transition"
              >
                {/* Foto */}
                {fotoLocal ? (
                  <img
                    src={fotoLocal}
                    alt={`Foto de ${egresado.nombre}`}
                    className="w-28 h-28 rounded-full object-cover mb-3 border border-blue-400 shadow-md"
                  />
                ) : (
                  <div className="w-28 h-28 bg-gray-300 rounded-full flex items-center justify-center mb-3 border border-blue-400 shadow-md">
                    <span className="text-gray-500">Sin foto</span>
                  </div>
                )}

                {/* Nombre y datos */}
                <h3 className="text-lg font-bold text-center text-gray-900">{egresado.nombre}</h3>
                <p className="text-sm text-gray-700 text-center">{egresado.puesto}</p>
                {egresado.carrera && (
                  <p className="text-sm text-blue-700 italic mt-1 text-center">{egresado.carrera}</p>
                )}
                {egresado.descripcionTrabajo && (
                  <p className="text-xs text-gray-500 mt-2 text-center">{egresado.descripcionTrabajo}</p>
                )}

                {/* Redes sociales */}
                <div className="flex space-x-3 my-3">
                  {egresado.redes.map((red, i) => {
                    const Icono = iconosRedes[red.tipo];
                    return Icono ? (
                      <a
                        key={i}
                        href={red.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-2xl hover:scale-110 transition"
                        title={red.tipo}
                      >
                        {Icono()}
                      </a>
                    ) : null;
                  })}
                </div>

                {/* Iconos de acciones */}
                <div className="absolute top-3 right-3 flex space-x-2">
                  <button
                    onClick={() => router.push(`/egresados/formulario?id=${egresado.id}`)}
                    title="Editar"
                    className="text-yellow-600 hover:text-yellow-800 transition"
                  >
                    <FiEdit size={20} />
                  </button>
                  <button
                    onClick={() => eliminar(egresado.id)}
                    title="Eliminar"
                    className="text-red-600 hover:text-red-800 transition"
                  >
                    <FiTrash size={20} />
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
