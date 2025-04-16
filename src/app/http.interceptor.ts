import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent,  HttpHandler,  HttpRequest} from '@angular/common/http';

import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

@Injectable()
export class HttpInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Write your logic 
    let headers = req.headers;
    const token = localStorage.getItem('token') || '';

    headers = headers.append('Content-Type', 'application/json');
    if (req.url.endsWith('/Image/UploadImage')) {
    headers = headers.delete('Content-Type'); // Remove Content-Type header
    }
    if (token) {
    headers = headers.append('Authorization', `Bearer ${token}`)
    }

    const request = req.clone(
    {
        headers
    });
    return next.handle(request)
    .pipe(
        map((event: HttpEvent<any>) => {
            return event;
        }),
        catchError((err: any) => {
            if (err instanceof HttpErrorResponse) {
            if (err.status === 403) {
                // user doesn't have access to that module
                // this.router.navigate(['/', 'admin', 'forbidden']);
            }
            if (err.status === 401) {
                // JWT expired, go to login
                if (token) localStorage.removeItem('token');
                location.replace('/');
            }
            }
            return throwError(err.error);
        })
    );
  }
}
