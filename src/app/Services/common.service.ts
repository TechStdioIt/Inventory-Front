import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Subject, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { DD_Menu } from '../Models/drodown.model';

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

  constructor(private location: Location, private http: HttpClient, private toastr: ToastrService) {}

  // Back button logic
  BackButton() {
    this.location.back();
  }

  async getDropDownData(flag: number, variable: string) {
    (await this.GetDataById('Administrator/GetDropdownData', flag.toString())).subscribe(
      (x: any) => {
        this[variable] = x;
      }
    );
  }

  // Method to fetch data by ID
  GetDataById(endpoint: string, id: string) {
    return this.http.get(`${endpoint}/${id}`).pipe(
      catchError((error) => {
        console.error('API error:', error);
        this.toastr.error('An error occurred while fetching data', 'Error');
        return throwError(() => error);
      })
    );
  }
}
