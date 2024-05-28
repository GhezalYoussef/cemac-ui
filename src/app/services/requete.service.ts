import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ConstantService} from "@tec/condor/services";
import {Requete} from "../models/requete";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class RequeteService {

    private serverUrl: string;

    constructor(private http: HttpClient,
                private cs: ConstantService) {
        this.serverUrl = this.cs.get("serverUrl");
    }

    public saveRequete(requete:Requete): Observable<Requete> {
        return this.http.post<Requete>(`${this.serverUrl}/api/v1/requete/update`, requete);
    }

    public getAll(): Observable<Requete[]> {
        return this.http.get<Requete[]>(`${this.serverUrl}/api/v1/requete/list-requete`);
    }

    public getById(idRequete:number):Observable<Requete>{
        return this.http.get<Requete>(`${this.serverUrl}/api/v1/requete/${idRequete}`)
    }

    public suppressionRequete(idRequete:number){
        return this.http.delete(`${this.serverUrl}/api/v1/requete/delete?idRequete=${idRequete}`);
    }

    public analyseRequete(requete:Requete){
        return this.http.post<Requete>(`${this.serverUrl}/api/v1/requete/analyse`,requete)
    }
}
