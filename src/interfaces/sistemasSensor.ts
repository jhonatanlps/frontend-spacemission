import { Sensor } from "./sensor";
import { Sistemas } from "./sistemas";

export interface SistemasSensor {
    id: number;
    sensor: Sensor;
    sistemas: Sistemas;
    valor: number;
    timestamp: string;
}