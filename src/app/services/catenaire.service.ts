import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ConstantService} from "@tec/condor/services";
import {Observable} from "rxjs";
import {Catenaire} from "../models/catenaire.model";
import {Injectable} from "@angular/core";
import {Periodicite} from "../models/periodicite.model";

@Injectable({
    providedIn: 'root'
})
export class CatenaireService {

    private serverUrl: string;

    constructor(private http: HttpClient,
                private cs: ConstantService) {
        this.serverUrl = this.cs.get("serverUrl");
    }

    findAll(): Observable<Catenaire[]>{
        return this.http.get<Catenaire[]>(`${this.serverUrl}/api/v1/catenaire/list-catenaire`);
    }

    delete(catenaireId: number) {
        return this.http.delete<string>(`${this.serverUrl}/api/v1/catenaire/delete-catenaire/${catenaireId}`)
    }

    add(catenaire: Catenaire) {
        const url = `${this.serverUrl}/api/v1/catenaire/update-catenaire`;
        const httpOptions = {
            headers: new HttpHeaders({'Content-Type': 'application/json'})
        };
        return this.http.post<Catenaire>(url, catenaire, httpOptions);
    }

    addAll(catenaireList: Catenaire[]) {
        const url = `${this.serverUrl}/api/v1/catenaire/update-catenaire-list`;
        const httpOptions = {
            headers: new HttpHeaders({'Content-Type': 'application/json'})
        };
        return this.http.post<Periodicite[]>(url, catenaireList, httpOptions);
    }
}
