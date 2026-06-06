import { Sistemas } from "./sistemas";
import { StatusAlerta } from "../types/statusAlerta";

export interface Alerta {
    id: number;
    descricao: string;
    status: StatusAlerta;
    sistemas: Sistemas;   
}