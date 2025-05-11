import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
 constructor(private toastr: ToastrService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = localStorage.getItem('token');
   var excludedUrls: string[] = [
    '/Administrator/Login',
    '/Branch/GetBranchListByMaster',
    'Administrator/GetDropdownData'
  ];

    // Skip interceptor logic for login API
  const isExcluded = excludedUrls.some(url => req.url.includes(url));
    if (isExcluded) {
      return next.handle(req); // Skip token validation
    }

    if (token) {
      const cloned = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
      return next.handle(cloned);
    } else {
      this.toastr.error('Your Token has expired', 'Please log in again');
      this.router.navigate(['/']);
    }

    return next.handle(req);
  }
}
