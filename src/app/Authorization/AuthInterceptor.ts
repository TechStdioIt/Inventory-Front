import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private toastr:ToastrService,private router:Router){}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = localStorage.getItem('token');

    if (token) {
      const cloned = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
      return next.handle(cloned);
    }else{
      this.toastr.error('Your Token has been expired','Again Login');
      this.router.navigate(['/']);
    }

    return next.handle(req);
  }
}
