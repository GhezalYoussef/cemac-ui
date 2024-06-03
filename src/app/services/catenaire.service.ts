import {HttpClient} from "@angular/common/http";
import {ConstantService} from "@tec/condor/services";
import {Observable} from "rxjs";
import {Catenaire} from "../models/catenaire.model";
import {Injectable} from "@angular/core";

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
    
}
