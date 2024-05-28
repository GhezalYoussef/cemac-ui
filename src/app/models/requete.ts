import {ELigne} from "./enum/ELigne.enum";
import {ECategorie} from "./enum/ECategorie.enum";

export interface Requete{

    id: number;
    requeteRef:string;
    dateCreation:string;
    createur:string;
    dateModification:string;
    modificateur:string;
    typeLigne:ELigne;
    nbrPanto:number;
    vitesse:number;
    categorieMaintenance:ECategorie;
    typeInstallationTension:number;
    nombreML:number;
    nombreIS:number;
    nombreAIG:number;
    nombreAT:number;
    nombreIA:number;

}
