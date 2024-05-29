import {ELigne} from "./enum/ELigne.enum";

export interface CategorieMaintenance {

    id:number;
    typeLigne:ELigne
    pantoMin:number;
    pantoMax:number;
    vitesseMin:number;
    viteeseMax:number;
    categorieMaintenance:string;
}
