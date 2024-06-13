import {ELigne} from "./enum/ELigne.enum";
import {AnalyseResult} from "./analyse-result.model";

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
    categorieMaintenance:string;
    typeInstallationTension:number;
    nombreML:number;
    nombreIS:number;
    nombreAIG:number;
    nombreAT:number;
    nombreIA:number;
    analyseResultList: AnalyseResult[];

}
