import {HttpClient} from "@angular/common/http";
import {ConstantService} from "@tec/condor/services";
import {Observable} from "rxjs";
import {CategorieMaintenance} from "../models/categorie-maintenance.model";
import {Injectable} from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class CategorieMaintenanceService {

    private serverUrl: string;

    constructor(private http: HttpClient,
                private cs: ConstantService) {
        this.serverUrl = this.cs.get("serverUrl");
    }

    findAll(): Observable<CategorieMaintenance[]> {
        return this.http.get<CategorieMaintenance[]>(`${this.serverUrl}/api/v1/categorie-maintenance/list-categorie-maintenance`);
    }

}
