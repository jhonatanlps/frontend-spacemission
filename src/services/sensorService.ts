import api from "./api";
import { Sensor } from "../interfaces/sensor";

export async function listarSensores(): Promise<Sensor[]> {
    const response = await api.get<Sensor[]>("/sensores");
    return response.data;
}

export async function obterSensorPorId(id: number): Promise<Sensor> {
    const response = await api.get<Sensor>(`/sensores/${id}`);
    return response.data;
}