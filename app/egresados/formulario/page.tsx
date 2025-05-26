"use client";
import { useState, useEffect } from "react";
import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/src/lib/firebaseConfig";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaTiktok } from "react-icons/fa";

const redesDisponibles = [
  { nombre: "Facebook", icono: <FaFacebook />, dominio: "facebook.com" },
  { nombre: "Twitter", icono: <FaTwitter />, dominio: "twitter.com" },
  { nombre: "LinkedIn", icono: <FaLinkedin />, dominio: "linkedin.com" },
  { nombre: "Instagram", icono: <FaInstagram />, dominio: "instagram.com" },
  { nombre: "TikTok", icono: <FaTiktok />, dominio: "tiktok.com" },
];

type RedSocial = { tipo: string; url: string };

export default function FormularioEgresado() {
  const [nombre, setNombre] = useState("");
  const [puesto, setPuesto] = useState("");
  const [foto, setFoto] = useState<string | null>(null);
  const [redesSociales, setRedesSociales] = useState<RedSocial[]>([{ tipo: "", url: "" }]);
  const [mensaje, setMensaje] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

useEffect(() => {
  if (!id) return;
  async function cargarEgresado() {
    // Usa id! para asegurarle a TS que no es null ni undefined
    const docRef = doc(db, "egresados", id!);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setNombre(data.nombre || "");
      setPuesto(data.puesto || "");
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

  const handleRedSocialChange = (
    index: number,
    campo: "tipo" | "url",
    valor: string
  ) => {
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

    // Validar todas las redes sociales
    const datosValidos = redesSociales.every((r) => validarRed(r.tipo, r.url));
    if (!datosValidos) {
      alert("Por favor revisa las URLs de las redes sociales.");
      return;
    }

    if (id) {
      // Edición
      const docRef = doc(db, "egresados", id);
      await setDoc(docRef, { nombre, puesto, redes: redesSociales });
      if (foto) localStorage.setItem(`foto_egresado_${id}`, foto);
      setMensaje("¡Egresado actualizado con éxito!");
    } else {
      // Nuevo registro
      const docRef = await addDoc(collection(db, "egresados"), {
        nombre,
        puesto,
        redes: redesSociales,
      });
      if (foto) localStorage.setItem(`foto_egresado_${docRef.id}`, foto);
      setMensaje("¡Egresado agregado con éxito!");
    }

    setTimeout(() => router.push("/egresados"), 2000);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        {id ? "Editar Egresado" : "Formulario de Egresado"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          className="border p-2 w-full rounded"
        />
        <input
          type="text"
          placeholder="Puesto"
          value={puesto}
          onChange={(e) => setPuesto(e.target.value)}
          required
          className="border p-2 w-full rounded"
        />

        <input type="file" accept="image/*" onChange={handleFoto} />
        {foto && (
          <Image
            src={foto}
            alt="Foto seleccionada"
            width={150}
            height={150}
            className="rounded-full object-cover mt-2"
          />
        )}

        <h3 className="font-semibold">Redes sociales:</h3>
        {redesSociales.map((r, i) => (
          <div key={i} className="flex flex-col sm:flex-row gap-2 items-center">
            <select
              value={r.tipo}
              onChange={(e) => handleRedSocialChange(i, "tipo", e.target.value)}
              required
              className="border p-2 w-full sm:w-1/3 rounded"
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
              className="border p-2 w-full sm:w-2/3 rounded"
            />
            <span className="text-xl">
              {redesDisponibles.find((red) => red.nombre === r.tipo)?.icono ?? "❔"}
            </span>
          </div>
        ))}
        <button
          type="button"
          onClick={agregarRed}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          + Agregar otra red
        </button>

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          {id ? "Actualizar egresado" : "Guardar egresado"}
        </button>
        {mensaje && <p className="text-green-600">{mensaje}</p>}
      </form>
    </div>
  );
}
