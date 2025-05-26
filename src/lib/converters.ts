import { Egresado } from "./types";
import { FirestoreDataConverter, Timestamp } from "firebase/firestore";

export const egresadoConverter: FirestoreDataConverter<Egresado> = {
  toFirestore: (egresado) => ({
    ...egresado,
    fechaCreacion: egresado.fechaCreacion ? egresado.fechaCreacion : Timestamp.now()
  }),
  fromFirestore: (snapshot) => {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      nombre: data.nombre,
      descripcion: data.descripcion,
      redesSociales: data.redesSociales || [],
      fechaCreacion: data.fechaCreacion?.toDate?.() ?? new Date(),
      imagenUrl: data.imagenUrl,
    };
  },
};
