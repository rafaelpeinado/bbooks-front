import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoaderService } from '../services/loader.service';
import { environment } from 'src/environments/environment';
import { GetTokenUseCase } from '../core/use-cases/auth/get-token.use-case';

@Injectable()
export class Interceptor implements HttpInterceptor {

  constructor(
    private loader: LoaderService,
    private getTokenUseCase: GetTokenUseCase,
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes(environment.api) || req.url.includes(environment.feedApi) || req.url.includes(environment.competitionApi)) {
      if (!req.urlWithParams.includes('?async=true')) { this.loader.showLoader(); }
      const request = req.clone({
        setHeaders: {
          // 'Access-Control-Allow-Origin': '*',
          // 'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
           'Access-Control-Allow-Methods': 'GET, POST',
          Authorization: `Bearer ${this.getTokenUseCase.execute()}`,
        },
      });
      return next.handle(request).pipe(
        tap((ev: HttpEvent<any>) => {
          if (ev instanceof HttpResponse) {
            if (!request.urlWithParams.includes('?async=true')) {
              if (!request.urlWithParams.includes('?async=true')) { this.loader.hideLoader(); }
            }
          }
        },
          (err: any) => {
            if (!request.urlWithParams.includes('?async=true')) {
              if (!request.urlWithParams.includes('?async=true')) { this.loader.hideLoader(); }
            }
          })
      );
    } else {
      const request = req.clone({});
      return next.handle(request).pipe(
        tap((ev: HttpEvent<any>) => {
          if (ev instanceof HttpResponse) {
            if (!request.urlWithParams.includes('?async=true')) {
              if (!request.urlWithParams.includes('?async=true')) { this.loader.hideLoader(); }
            }
          }
        },
          (err: any) => {
            if (!request.urlWithParams.includes('?async=true')) {
              if (!request.urlWithParams.includes('?async=true')) { this.loader.hideLoader(); }
            }
          })
      );
    }

  }

}
