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
  selector: 'app-bm-form',
  templateUrl: './bm-form.component.html',
  styleUrl: './bm-form.component.scss'
})
export class BmFormComponent implements OnInit {
  [key: string]: any;
  text: string = '';
  exist: boolean = false;
  FormData: any = new Suppliers();
  isSubmitting: boolean = false;
  fromHeader: string = 'Business Master';
  insertOrUpdateAPI: string = 'BusinessMaster/CreateOrUpdateBusinessMaster';
  getDataByIdAPI: string = 'Bank/GetBankById';
  listRoute: string = '/bankList';

  formdata: any[] = [
    { type: 'text', name: 'name', label: 'Bank Name', required: true,column:6,placeHolder:"Enter Bank Name"},
    { type: 'text', name: 'address', label: 'Address', required: true,column:6,placeHolder:"Enter Address Name"},
    { type: 'text', name: 'branch', label: 'Branch', required: true,column:6,placeHolder:"Enter Branch Name"},

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

  

  
  
}
