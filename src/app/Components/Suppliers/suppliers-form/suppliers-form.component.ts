import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Suppliers } from 'src/app/Models/Suppliers';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';
import * as CryptoJS from 'crypto-js';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { camelCase, mapKeys } from 'lodash';
import { GridHandlerService } from 'src/app/Services/GridHandler.service';
import { take } from 'rxjs';
@Component({
  selector: 'app-suppliers-form',
  templateUrl: './suppliers-form.component.html',
  styleUrl: './suppliers-form.component.scss'
})
export class SuppliersFormComponent implements OnInit {
  [key: string]: any;
  text: string = '';
  exist: boolean = false;
  FormData: any = new Suppliers();
  isSubmitting: boolean = false;
  fromHeader: string = 'Supplier';
  insertOrUpdateAPI: string = 'Suppliers/CreateOrUpdate';
  getDataByIdAPI: string = 'Suppliers/GetSuppliersById';
  listRoute: string = '/suppliersList';

  formdata: any[] = [
    { type: 'text', name: 'companyName', label: 'Company Name', required: true,column:6,eventEmit: { keyup: 'onKeyupCompany' },placeHolder:"Enter Company Name"},
    { type: 'text', name: 'contactName', label: 'Contact Name', required: true ,column:4},
    { type: 'text', name: 'contactTitle', label: 'Contact Title', required: false ,column:4},
    { type: 'text', name: 'street', label: 'Street', required: true,column:4},
    { type: 'text', name: 'city', label: 'City', required: false ,column:4 },
    { type: 'text', name: 'province', label: 'Province', required: true },
    { type: 'text', name: 'postalCode', label: 'Postal Code', required: true },
    { type: 'text', name: 'country', label: 'Country', required: true },
    { type: 'text', name: 'phone', label: 'Phone', required: true },
    { type: 'email',name: 'email', label: 'Email', required: true },
    
  ];


  

  constructor(
    private dataService: HttpClientConnectionService,
    private toastr: ToastrService,
    private router:ActivatedRoute,
    private route:Router,
    private location:Location,
    public gridHandleService:GridHandlerService
  ) {
    this.router.queryParams.subscribe((data:any)=>{
      if(data.do !=undefined && data !=null){
        this.getDataById(data.do);
      }else{
        this.FormData =new Suppliers();
      }
    });
    this.gridHandleService.add$.pipe(take(1)).subscribe(async (data: NgForm) => {
      if (!this.isSubmitting) {
        this.isSubmitting = true;
        try {
          await this.onSubmit(data); 
          this.gridHandleService.selectedTab = "List";
          
        } catch (error) {
          console.error('Error during submission:', error);
        } finally {
          this.isSubmitting = false; // Reset flag when the operation completes or fails
        }
      }
    });
  }
  ngOnInit(): void {}
  onSubmit(form: NgForm) {
    this.insertOrUpdate(form);
  }
  getDataById(id:any){
    this.dataService.GetData(`${this.getDataByIdAPI}?id=`+id).subscribe((data:any)=>{
      ;
      // this.FormData=data.data;
      this.FormData = mapKeys(data.data, (_, key) => camelCase(key)) as Suppliers;
    })
  }
  insertOrUpdate(form: NgForm) {
    this.dataService.PostData(this.insertOrUpdateAPI, this.FormData).subscribe(
      (res) => {
        this.toastr.success('Successfull', `${this.fromHeader} Information`);
       this.FormData = new Suppliers();
       this.route.navigate([this.listRoute]);
       this.gridHandleService.selectedTab = "List";
      },
      (err) => {
        this.toastr.error('Please Try Again', 'Invalid Information!!');
        console.log(err);
      }
    );
  }

  handleEvent(functionName: string, event: any) {
    if (typeof this[functionName] === 'function') {
      this[functionName](event); // Dynamically call the specified function
    } else {
      console.error(`Function ${functionName} is not defined`);
    }
  }
  onKeyupCompany(event: any) {
    console.log('Keyup event on Company Name:', event.target.value);
  }

  

  
  
}
