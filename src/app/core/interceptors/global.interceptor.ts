import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from 'src/app/shared/token.service';

@Injectable()
export class GlobalInterceptor implements HttpInterceptor {
  baseUrl = 'https://upskilling-egypt.com:3006/api/v1/'
  newRequest: HttpRequest<unknown> | undefined;
  constructor(private tokenService: TokenService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.tokenService.getToken()) {
      this.newRequest = request.clone({
        url: this.baseUrl + request.url,
        setHeaders: {
          Authorization: `Bearer ${this.tokenService.getToken()}`
        }
      })
    }
    else {
      this.newRequest = request.clone({
        url: this.baseUrl + request.url
      })
    }
    return next.handle(this.newRequest);
  }
}
