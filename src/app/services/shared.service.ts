import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {Requete} from "../models/requete";

@Injectable({
    providedIn: 'root'
})
export class SharedService {

    private requete = new BehaviorSubject<Requete>(null);
    public requete$ = this.requete.asObservable();
    private requeteList = new BehaviorSubject<Requete[]>(null);
    public requeteList$ = this.requeteList.asObservable();

    public setRequete(requete: Requete) {
        this.requete.next(requete);
    }

    public setRequeteList(requeteList: Requete[]) {
        this.requeteList.next(requeteList);
    }
}
