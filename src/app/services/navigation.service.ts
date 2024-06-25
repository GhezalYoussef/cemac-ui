import {Router} from "@angular/router";
import {Requete} from "../models/requete";
import {Injectable} from "@angular/core";
import {SharedService} from "./shared.service";

@Injectable({
    providedIn: 'root'
})
export class NavigationService{
    constructor(
        private router: Router,
        private sharedSrvice: SharedService
    ) {}

    public navigationToUpdateRequete(requete: Requete){
        const url = `/saisie`;
        this.sharedSrvice.setRequete(requete);
        this.router.navigateByUrl(url);
    }

    public navigationToAddRequete(){
        const url = `/saisie`;
        this.sharedSrvice.setRequete(null);
        this.router.navigateByUrl(url);
    }

    public navigationToAnalyseRequete(requete: Requete){
        const url= `/analyse`;
        this.sharedSrvice.setRequete(requete);
        this.router.navigateByUrl(url);
    }

    public navigationToCompareRequetes(requeteList: Requete[]){
        const url= `/analyse`;
        this.sharedSrvice.setRequeteList(requeteList);
        this.router.navigateByUrl(url);
    }

    public navigateToAccueil(){
        const url = `/accueil`;
        this.router.navigateByUrl(url);
    }

    public navigateToListRequetes(){
        const url = `/requetes`;
        this.router.navigateByUrl(url);
    }
}
