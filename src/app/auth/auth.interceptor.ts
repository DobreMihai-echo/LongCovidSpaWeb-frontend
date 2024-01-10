import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable, catchError, throwError } from "rxjs";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
@Injectable()
export class AuthInterceptor implements HttpInterceptor{

    constructor(private authService: AuthService, private router:Router) {}


    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.authService.getToken();

        if(token) {
            req = this.addToken(req, token);
        }

        return next.handle(req).pipe(
            catchError(
                (err:HttpErrorResponse) => {
                    console.log(err.status);
                    if(err.status === 401) {
                        this.router.navigate(['/login']);
                    } else if(err.status === 403) {
                        this.router.navigate(['/forbidden'])
                    }
                    return throwError(err.error ? err.error : "Something is wrong");
                }
            )
        );
    }


    private addToken(request: HttpRequest<any>, token:string) {
        return request.clone(
            {
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
    }

}