import {Catenaire} from "./catenaire.model";
import {ELigne} from "./enum/ELigne.enum";
import {EUnit} from "./enum/EUnit.enum";

export interface Periodicite{

    id:number;
    catenaires:Catenaire[];
    categorieOperation:string;
    sousCategorieOperation:string;
    libelle:string;
    sousOperation:string;
    typeLigne:ELigne;
    tension:ELigne;
    categorieMaintenance:string;
    unit:EUnit;
    periode:number;
}
