import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {Observable} from "rxjs";
import {CustomAuthService} from "./custom-auth.service";
import {MessageService} from "primeng/api";


@Injectable({
    providedIn: 'root'
})
export class CustomRoleGuardService implements CanActivate {

    constructor(private authService: CustomAuthService,
                private router: Router,
                private messageService: MessageService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.authService.hasRole(route.data.roles).then(
            (res) => {
                if (res === 1) {
                    return true;
                } else {
                    this.messageService.add(
                        {
                            severity: 'info',
                            summary: 'Info',
                            detail: 'Vous n\'avez pas les droits pour accéder à cette page.',
                            key: 'top'
                        });
                    this.router.navigate(["/"]);
                    return false;
                }
            }
        );
    }
}
