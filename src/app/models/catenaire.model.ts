import {Periodicite} from "./periodicite.model";

export interface Catenaire{

    id:number;
    familleCatenaire:number;
    periodicites:Periodicite[];
    libelle:string;

}
