import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Subject, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { DatePipe, Location } from '@angular/common';
import { DD_Menu } from '../Models/drodown.model';
import { createUrl } from 'src/utility/common';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  [key: string]: any;
  dataList: any[] = [];

  // Declaration of all Dropdown List start
  DD_Menu: DD_Menu[] = [];
  // Declaration of all Dropdown List end

  iSButtonManagementComponentFormShow: boolean = true;

  constructor(private location: Location, private http: HttpClient, private toastr: ToastrService,private cookieService: CookieService,private datePipe:DatePipe) {}

  // Back button logic
  BackButton() {
    this.location.back();
  }

  getDropDownData(flag: number) {
    return this.GetDataById(`Administrator/GetDropdownData?flag=${flag}`);
  }


  // Method to fetch data by ID
  GetDataById(endpoint: string) {
    endpoint = createUrl(endpoint)
    return this.http.get(`${endpoint}`).pipe(
      catchError((error) => {
        console.error('API error:', error);
        this.toastr.error('An error occurred while fetching data', 'Error');
        return throwError(() => error);
      })
    );
  }
  setCookie(name: string, value: string, expiredays: number =0) {
    const expirationDate = new Date();
    if(expiredays >0){
      expirationDate.setDate(expirationDate.getDate() + expiredays);
    }
    this.cookieService.set(name, value, expirationDate);
  }

  // Get a cookie
  getCookie(name: string) {
    return this.cookieService.get(name);
  }

  // Delete a cookie
  deleteCookie(name: string) {
    this.cookieService.delete(name);
  }

  // Delete all cookies
  deleteAllCookies() {
    this.cookieService.deleteAll();
  }
  formatDate(date: string | Date,format:string): string {
    return this.datePipe.transform(date, format) || '';
  }
}
