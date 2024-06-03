import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ConstantService} from "@tec/condor/services";
import {Utilisateur} from "../models/Utilisateur.model";

@Injectable({
    providedIn: 'root'
})
export class UtilisateurService {

    private serverUrl: string;

    constructor(private http: HttpClient,
                private cs: ConstantService
    ) {
        this.serverUrl = this.cs.get("serverUrl");
    }

    addUtilisateur(utilisateur: Utilisateur) {
        const url = `${this.serverUrl}/api/v1/utilisateur/update-utilisateur`;
        const httpOptions = {
            headers: new HttpHeaders({'Content-Type': 'application/json'})
        };
        return this.http.post<Utilisateur>(url, utilisateur, httpOptions);
    }

    deleteUtilisateur(utilisateurId: number) {
        return this.http.delete<string>(`${this.serverUrl}/api/v1/utilisateur/delete-utilisateur/${utilisateurId}`)
    }

    getListUtilisateur() {
        return this.http.get<Utilisateur[]>(`${this.serverUrl}/api/v1/utilisateur/list-utilisateur`);
    }

    isUtilisateur(idSNCF: string) {
        return this.http.get<boolean>(`${this.serverUrl}/api/v1/utilisateur/is-utilisateur/${idSNCF}`);
    }

    getUtilisateur(idSNCF: string) {
        return this.http.get<Utilisateur>(`${this.serverUrl}/api/v1/utilisateur/get-utilisateur/${idSNCF}`);
    }

}
