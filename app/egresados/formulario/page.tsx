"use client";
import { useState, useEffect } from "react";
import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/src/lib/firebaseConfig";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaTiktok,
  FaUpload,
} from "react-icons/fa";

const redesDisponibles = [
  { nombre: "Facebook", icono: <FaFacebook />, dominio: "facebook.com" },
  { nombre: "Twitter", icono: <FaTwitter />, dominio: "twitter.com" },
  { nombre: "LinkedIn", icono: <FaLinkedin />, dominio: "linkedin.com" },
  { nombre: "Instagram", icono: <FaInstagram />, dominio: "instagram.com" },
  { nombre: "TikTok", icono: <FaTiktok />, dominio: "tiktok.com" },
];

type RedSocial = { tipo: string; url: string };

const carreras = [
  "Ingeniería Civil",
  "Ingeniería Industrial",
  "Ingeniería Electromecánica",
  "Ingeniería Logística",
  "Ingeniería Gestión Empresarial",
  "Ingeniería Sistemas Computacionales",
  "Ingeniería Tecnologías de la Información y Comunicaciones",
  "Ingeniería en Industrias Alimentarias",
  "Arquitectura",
];

export default function FormularioEgresado() {
  const [nombre, setNombre] = useState("");
  const [puesto, setPuesto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [carrera, setCarrera] = useState("");
  const [foto, setFoto] = useState<string | null>(null);
  const [redesSociales, setRedesSociales] = useState<RedSocial[]>([{ tipo: "", url: "" }]);
  const [mensaje, setMensaje] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    if (!id) return;
    async function cargarEgresado() {
      const docRef = doc(db, "egresados", id!);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setNombre(data.nombre || "");
        setPuesto(data.puesto || "");
        setDescripcion(data.descripcion || "");
        setCarrera(data.carrera || "");
        setRedesSociales(data.redes || [{ tipo: "", url: "" }]);
        const fotoLocal = localStorage.getItem(`foto_egresado_${id}`);
        if (fotoLocal) setFoto(fotoLocal);
      }
    }
    cargarEgresado();
  }, [id]);

  const handleFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    if (archivo) {
      const lector = new FileReader();
      lector.onloadend = () => {
        setFoto(lector.result as string);
      };
      lector.readAsDataURL(archivo);
    }
  };

  const handleRedSocialChange = (index: number, campo: "tipo" | "url", valor: string) => {
    const nuevas = [...redesSociales];
    nuevas[index][campo] = valor;
    setRedesSociales(nuevas);
  };

  const agregarRed = () => {
    setRedesSociales([...redesSociales, { tipo: "", url: "" }]);
  };

  const validarRed = (tipo: string, url: string) => {
    if (!tipo || !url) return false;
    const red = redesDisponibles.find((r) => r.nombre === tipo);
    return red ? url.includes(red.dominio) : false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const datosValidos = redesSociales.every((r) => validarRed(r.tipo, r.url));
    if (!datosValidos) {
      alert("Por favor revisa las URLs de las redes sociales.");
      return;
    }

    const datos = {
      nombre,
      puesto,
      descripcion,
      carrera,
      redes: redesSociales,
    };

    if (id) {
      const docRef = doc(db, "egresados", id);
      await setDoc(docRef, datos);
      if (foto) localStorage.setItem(`foto_egresado_${id}`, foto);
      setMensaje("¡Egresado actualizado con éxito!");
    } else {
      const docRef = await addDoc(collection(db, "egresados"), datos);
      if (foto) localStorage.setItem(`foto_egresado_${docRef.id}`, foto);
      setMensaje("¡Egresado agregado con éxito!");
    }

    setTimeout(() => router.push("/egresados"), 2000);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-2xl shadow-md">
      <h2 className="text-3xl font-bold text-center mb-6 text-blue-800">
        {id ? "Editar Egresado" : "Formulario de Egresado"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          className="border border-gray-300 p-2 w-full rounded-lg"
        />
        <input
          type="text"
          placeholder="Puesto actual"
          value={puesto}
          onChange={(e) => setPuesto(e.target.value)}
          required
          className="border border-gray-300 p-2 w-full rounded-lg"
        />
        <select
          value={carrera}
          onChange={(e) => setCarrera(e.target.value)}
          required
          className="border border-gray-300 p-2 w-full rounded-lg"
        >
          <option value="">Selecciona una carrera</option>
          {carreras.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <textarea
          placeholder="Descripción del trabajo"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
          rows={3}
          className="border border-gray-300 p-2 w-full rounded-lg"
        />

        <label className="flex items-center gap-2 cursor-pointer text-blue-700">
          <FaUpload />
          <span>Subir foto del egresado</span>
          <input type="file" accept="image/*" onChange={handleFoto} className="hidden" />
        </label>
        {foto && (
          <Image
            src={foto}
            alt="Foto seleccionada"
            width={150}
            height={150}
            className="rounded-full object-cover mt-2 mx-auto"
          />
        )}

        <h3 className="font-semibold text-gray-800">Redes sociales:</h3>
        {redesSociales.map((r, i) => (
          <div key={i} className="flex flex-col sm:flex-row gap-2 items-center">
            <select
              value={r.tipo}
              onChange={(e) => handleRedSocialChange(i, "tipo", e.target.value)}
              required
              className="border border-gray-300 p-2 w-full sm:w-1/3 rounded-lg"
            >
              <option value="">Selecciona red</option>
              {redesDisponibles.map((red) => (
                <option key={red.nombre} value={red.nombre}>
                  {red.nombre}
                </option>
              ))}
            </select>
            <input
              type="url"
              placeholder="URL de red social"
              value={r.url}
              onChange={(e) => handleRedSocialChange(i, "url", e.target.value)}
              required
              className="border border-gray-300 p-2 w-full sm:w-2/3 rounded-lg"
            />
            <span className="text-xl">
              {redesDisponibles.find((red) => red.nombre === r.tipo)?.icono ?? "❔"}
            </span>
          </div>
        ))}

        <button
          type="button"
          onClick={agregarRed}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          + Agregar otra red
        </button>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full font-semibold"
        >
          {id ? "Actualizar egresado" : "Guardar egresado"}
        </button>

        {mensaje && <p className="text-blue-600 font-semibold text-center">{mensaje}</p>}
      </form>
    </div>
  );
}
