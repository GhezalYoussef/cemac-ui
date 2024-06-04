import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ConstantService} from "@tec/condor/services";
import {Periodicite} from "../models/periodicite.model";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class PeriodiciteService {
    private serverUrl: string;

    constructor(private http: HttpClient,
                private cs: ConstantService) {
        this.serverUrl = this.cs.get("serverUrl");
    }

    findAll(): Observable<Periodicite[]>{
        return this.http.get<Periodicite[]>(`${this.serverUrl}/api/v1/periodicite/list-periodicite`);
    }

    delete(periodidiciteId: number) {
        return this.http.delete<string>(`${this.serverUrl}/api/v1/periodicite/delete-periodicite/${periodidiciteId}`)
    }

    add(periodicite: Periodicite) {
        const url = `${this.serverUrl}/api/v1/periodicite/update-periodicite`;
        const httpOptions = {
            headers: new HttpHeaders({'Content-Type': 'application/json'})
        };
        return this.http.post<Periodicite>(url, periodicite, httpOptions);
    }
}
