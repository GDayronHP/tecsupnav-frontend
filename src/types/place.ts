export interface PlaceType {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlaceCount {
  rutasOrigen: number;
  rutasDestino: number;
}

export interface Place {
  id: string;
  nombre: string;
  latitud: number;
  longitud: number;
  descripcion: string;
  imagen: string | null;
  isActive: boolean;
  piso: number;
  edificio: string;
  codigoQR: string | null;
  createdAt: string;
  updatedAt: string;
  tipoId: string;
  tipo: PlaceType;
  _count: PlaceCount;
}
