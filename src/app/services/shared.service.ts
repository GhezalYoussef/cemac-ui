import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {Requete} from "../models/requete";

@Injectable({
    providedIn: 'root'
})
export class SharedService {

    private requete = new BehaviorSubject<Requete>(null);
    public requete$ = this.requete.asObservable();

    public setRequete(requete: Requete) {
        this.requete.next(requete);
    }
}
