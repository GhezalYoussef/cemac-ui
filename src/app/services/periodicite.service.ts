import {HttpClient} from "@angular/common/http";
import {ConstantService} from "@tec/condor/services";
import {Periodicite} from "../models/periodicite.model";
import {Observable} from "rxjs";

export class PeriodiciteService {
    private serverUrl: string;

    constructor(private http: HttpClient,
                private cs: ConstantService) {
        this.serverUrl = this.cs.get("serverUrl");
    }

    findAll(): Observable<Periodicite[]>{
        return this.http.get<Periodicite[]>(`${this.serverUrl}/api/v1/periodicite/list-periodicite`);
    }
}
