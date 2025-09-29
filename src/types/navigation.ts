export interface Punto {
    lat: number;
    lng: number;
}

export interface Route {
    route: Punto[];
    distancia: number;
    tiempoEstimado: number;
    accesible: number;
}

export interface Destination {
    id: string;
    nombre: string;
    latitud: number;
    longitud: number;
    tipo: string;
    edificio: string;
    piso: number;
}

export interface Navigation {
    route: Route;
    destination: Destination;
    instructions: string[];
    direccion?: string;
}
