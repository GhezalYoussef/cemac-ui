import {Profil} from "./profil.model";

export interface Utilisateur{

    id:number;
    idSncf:string;
    nom:string;
    prenom:string;
    profil:Profil;
}
