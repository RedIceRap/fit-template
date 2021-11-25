import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  excludedUrls = ['https://some-url-to-exclude.com'];

  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return from(this.authService.getToken()).pipe(
      mergeMap((authToken) => {
        if (
          authToken &&
          this.excludedUrls.some((url: string) => req.url.startsWith(url)) ===
            false
        ) {
          console.log('reached');

          req = req.clone({
            withCredentials: true,
            headers: req.headers.set('Authorization', `Bearer ${authToken}`),
          });
        }
        return next.handle(req);
      })
    );
  }
}
