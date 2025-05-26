export type TipoRedSocial = "facebook" | "twitter" | "linkedin" | "github" | "x" | "web";

export interface RedSocial {
  tipo: TipoRedSocial;
  url: string;
}

export interface Egresado {
  id?: string;
  nombre: string;
  puesto: string;
  carrera: string;
  fotoURL: string;
  redesSociales: RedSocial[];
  fechaRegistro?: any; // Firebase Timestamp
}
