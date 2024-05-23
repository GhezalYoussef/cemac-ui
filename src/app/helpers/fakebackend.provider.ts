import { Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { dematerialize, delay, materialize, mergeMap } from "rxjs/operators";

// Pour exemple : déclaration d'une liste de produits dans un fichier JSON en local
// import * as listeProduct from '../../assets/data/products.json';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // wrap in delayed observable to simulate server api call
    return of(null).pipe(
      mergeMap(() => {
        /* Pour exemple :
      const products = JSON.parse(window.localStorage.getItem('products'));
      if (request.url.search('api/products') === 0 && request.method === 'GET') {
          if (window.localStorage.getItem('products')) {
              return of(new HttpResponse({ status: 200, body: products }));
          } else {
              localStorage.setItem('products', JSON.stringify(<any>listeProduct));
              return of(new HttpResponse({ status: 200, body: <any>listeProduct }));
          }
      }
      */

        // pass through any requests not handled above
        return next.handle(request);
      }),
      /**
       * call materialize and dematerialize to ensure delay even if an error is thrown
       * (https://github.com/Reactive-Extensions/RxJS/issues/648)
       */
      materialize(),
      delay(500),
      dematerialize()
    );
  }
}

export const fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true,
};
