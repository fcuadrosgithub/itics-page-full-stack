import { TipoRedSocial } from "./types";
import { Facebook, Twitter, Linkedin, Github, Globe, X } from "lucide-react";

export const redesSocialesDisponibles: {
  tipo: TipoRedSocial;
  nombre: string;
  icono: any;
  dominio: string;
}[] = [
  { tipo: "facebook", nombre: "Facebook", icono: Facebook, dominio: "facebook.com" },
  { tipo: "twitter", nombre: "Twitter", icono: Twitter, dominio: "twitter.com" },
  { tipo: "linkedin", nombre: "LinkedIn", icono: Linkedin, dominio: "linkedin.com" },
  { tipo: "github", nombre: "GitHub", icono: Github, dominio: "github.com" },
  { tipo: "x", nombre: "X", icono: X, dominio: "x.com" },
  { tipo: "web", nombre: "Sitio Web", icono: Globe, dominio: "" },
];
