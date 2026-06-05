import api from "./api";
import { Alerta } from "../interfaces/alerta";

export async function listarAlertas(): Promise<Alerta[]> {
    const response = await api.get<Alerta[]>("/alerta");
    return response.data;
}

export async function obterAlertaPorId(id: number): Promise<Alerta> {
    const response = await api.get<Alerta>(`/alerta/${id}`);
    return response.data;
}