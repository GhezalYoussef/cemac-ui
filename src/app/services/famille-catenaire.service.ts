import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ConstantService} from "@tec/condor/services";
import {Observable} from "rxjs";
import {FamilleCatenaire} from "../models/famille-catenaire.model";
import {Injectable} from "@angular/core";
import {Catenaire} from "../models/catenaire.model";
@Injectable({
    providedIn: 'root'
})
export class FamilleCatenaireService {
    private serverUrl: string;

    constructor(private http: HttpClient,
                private cs: ConstantService) {
        this.serverUrl = this.cs.get("serverUrl");
    }

    findAll(): Observable<FamilleCatenaire[]>{
        return this.http.get<FamilleCatenaire[]>(`${this.serverUrl}/api/v1/famille-catenaire/list-famille-catenaire`);
    }

    delete(familleCatenaireId: number) {
        return this.http.delete<string>(`${this.serverUrl}/api/v1/famille-catenaire/delete-famille-catenaire/${familleCatenaireId}`)
    }

    add(familleCatenaire: FamilleCatenaire) {
        const url = `${this.serverUrl}/api/v1/famille-catenaire/update-famille-catenaire`;
        const httpOptions = {
            headers: new HttpHeaders({'Content-Type': 'application/json'})
        };
        return this.http.post<Catenaire>(url, familleCatenaire, httpOptions);
    }

}
