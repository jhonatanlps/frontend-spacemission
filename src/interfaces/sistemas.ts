import { Sensor } from "./sensor";
import { SistemasSensor } from "./sistemasSensor";

export interface Sistemas {
    id: number;
    nome: string;
    descricao: string;
    status: boolean;
    sensores: SistemasSensor[];
}