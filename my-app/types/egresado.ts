export type SocialLink = {
  id: string
  platform: string
  url: string
}

export type Egresado = {
  id: string // Ahora siempre es string (Firebase lo provee)
  nombre: string
  puesto: string
  descripcion: string
  redes: SocialLink[]
  fechaRegistro?: string
}