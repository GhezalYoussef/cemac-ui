import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {ConstantService} from "@tec/condor/services";
import {catchError, Observable, throwError} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ExcelService{

    private serverUrl: string;


    constructor(private http: HttpClient,
                private cs: ConstantService
    ) {
        this.serverUrl = this.cs.get("serverUrl");
    }

    importDonnees(file: Blob): Observable<any> {
        const formData: FormData = new FormData();
        formData.append('file', file);

        return this.http.post(`${this.serverUrl}/api/v1/excel/import-donnees`, file, {
            reportProgress: true,
            observe: 'events',
        }).pipe(
            catchError(this.handleError)
        );
    }

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // Une erreur côté client ou réseau.
            console.error('Une erreur est survenue:', error.error.message);
        } else {
            // Le backend a renvoyé un code d'erreur non réussi.
            console.error(
                `Le backend a renvoyé le code ${error.status}, ` +
                `le corps était : ${error.error}`);
        }
        // Renvoie un Observable avec un message d'erreur adapté.
        return throwError('Quelque chose de malheureux s\'est produit; veuillez réessayer plus tard.');
    }

}
