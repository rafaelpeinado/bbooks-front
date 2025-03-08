import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GetTokenUseCase } from '../core/use-cases/auth/get-token.use-case';

@Injectable()
export class Interceptor implements HttpInterceptor {

  constructor(
    private readonly getTokenUseCase: GetTokenUseCase,
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes(environment.api) || req.url.includes(environment.feedApi) || req.url.includes(environment.competitionApi)) {
      const request = req.clone({
        setHeaders: {
          // 'Access-Control-Allow-Origin': '*',
          // 'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
          'Access-Control-Allow-Methods': 'GET, POST',
          Authorization: `Bearer ${this.getTokenUseCase.execute()}`,
        },
      });
      return next.handle(request);
    }
    return next.handle(req);
  }
}
