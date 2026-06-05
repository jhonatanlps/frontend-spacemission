import api from "./api";
import { Sistemas } from "../interfaces/sistemas";

export async function listarSistemas(): Promise<Sistemas[]> {
    const response = await api.get<Sistemas[]>("/sistemas");
    return response.data;
}

export async function obterSistemaPorId(id: number): Promise<Sistemas> {
    const response = await api.get<Sistemas>(`/sistemas/${id}`);
    return response.data;
}

export async function criarSistema(sistema: Omit<Sistemas, "id">): Promise<Sistemas> {
    const response = await api.post<Sistemas>("/sistemas", sistema);
    return response.data;
}
