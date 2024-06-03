import {Injectable} from '@angular/core';
import {AuthenticationService} from "@tec/condor/services";
import {UtilisateurService} from "./utilisateur.service";
import {Utilisateur} from "../models/Utilisateur.model";
import {EProfil} from "../models/enum/EProfil.enum";

@Injectable({
    providedIn: 'root'
})
export class CustomAuthService {

    private _utilisateur ?: Utilisateur;

    constructor(private authService: AuthenticationService,
                private utilisateurService: UtilisateurService) {
    }

    hasRole(profils: EProfil[]) {
        return this.isAuthenticated().then(
            res => {
                if (res === 1) {
                    if (profils.includes(this.utilisateur.profil.libelle)) {
                        return 1;
                    } else {
                        return 2;
                    }
                } else {
                    return 3;
                }
            });
    }

    isAuthenticated() {
        return this.authService.isAuthenticated().then(
            res => {
                if (res) {
                    if (this.utilisateur) {
                        return 1;
                    } else {
                        return this.utilisateurService.getUtilisateur(this.authService.currentUser.id).toPromise().then(
                            res => {
                                if (res) {
                                    this.utilisateur = res;
                                    return 1;
                                } else {
                                    return 2;
                                }
                            },
                            reason => {
                                return 2;
                            });
                    }
                } else {
                    return 3;
                }
            },reason => {
                this.authService.logout();
            })
    }

    isAdmin() {
        return this.utilisateur.profil.libelle === EProfil.ADMIN;
    }

    isSimpleUser() {
        return this.utilisateur.profil.libelle === EProfil.SIMPLE_USER;
    }

    login(otherRedirection?: string) {
        this.authService.login(otherRedirection);
    }

    get utilisateur() {
        return this._utilisateur;
    }

    set utilisateur(utilisateur: Utilisateur) {
        this._utilisateur = utilisateur;
    }

}
