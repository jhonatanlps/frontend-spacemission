// src/services/sistemasService.ts
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

export async function criarSistema(novoSistema: Sistemas): Promise<Sistemas> {
    const payload = {
        nome: novoSistema.nome,
        descricao: novoSistema.descricao,
        status: novoSistema.status,
        sensores: novoSistema.sensores.map(s => ({
            sensor: {
                id: s.sensor.id 
            },            
        })),
    };

    const response = await api.post<Sistemas>("/sistemas", payload);
    return response.data;
}