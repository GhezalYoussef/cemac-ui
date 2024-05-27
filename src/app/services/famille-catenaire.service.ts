import {HttpClient} from "@angular/common/http";
import {ConstantService} from "@tec/condor/services";
import {Observable} from "rxjs";
import {FamilleCatenaire} from "../models/famille-catenaire.model";
import {Injectable} from "@angular/core";
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
}
