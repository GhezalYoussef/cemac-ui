import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ConstantService} from "@tec/condor/services";
import {Observable} from "rxjs";
import {Profil} from "../models/profil.model";

@Injectable({
    providedIn: 'root'
})
export class ProfilService {

    private serverUrl: string;

    constructor(private http: HttpClient,
                private cs: ConstantService
    ) {
        this.serverUrl = this.cs.get("serverUrl");
    }

    getListProfil(): Observable<Profil[]> {
        const url = `${this.serverUrl}/api/v1/profil/list-profil`;
        return this.http.get<Profil[]>(url);
    }
}
