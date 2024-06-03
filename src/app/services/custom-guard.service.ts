import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {Observable} from "rxjs";
import {CustomAuthService} from "./custom-auth.service";
import {MessageService} from "primeng/api";

@Injectable({
    providedIn: 'root'
})
export class CustomGuardService implements CanActivate {

    constructor(private authService: CustomAuthService,
                private messageService: MessageService,
                private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.authService.isAuthenticated().then(response => {
            if (response === 1) {
                return true;
            } else if (response === 2) {
                this.messageService.add(
                    {
                        severity: 'info',
                        summary: 'Info',
                        detail: 'L\'utilisateur n\'est pas autorisé à utiliser l\'application. \nVous devez réessayer de vous connecter ou veuillez vous référer à l\'administrateur de l\'application pour plus d\'informations.',
                        key: 'top'
                    });
                this.router.navigate(["/"]);
                return false;
            } else {
                this.authService.login(state.url);
                return false;
            }
        });
    }


}

