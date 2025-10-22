export interface Intent {
    intent: string;
    confidence: number;
    entities: Entity;
    originalQuery: string;
    interpretation: string;
}

export interface Entity {
    destination?: string;
    placeType?: string;
}

export interface Option {
    id: string;
    label: string;
    description?: string;
}

