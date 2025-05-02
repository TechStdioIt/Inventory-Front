import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { camelCase, mapKeys } from 'lodash';
import { GridHandlerService } from 'src/app/Services/GridHandler.service';
import { Subject, take, takeUntil } from 'rxjs';
import { Category } from 'src/app/Models/Category';
import { Customer } from 'src/app/Models/Customer';
import { CommonService } from 'src/app/Services/common.service';
@Component({
  selector: 'app-due-customer-form',
  templateUrl: './due-customer-form.component.html',
  styleUrl: './due-customer-form.component.scss'
})

export class DueCustomerFormComponent implements OnInit,OnDestroy {
  [key: string]: any;
  text: string = '';
  exist: boolean = false;
  FormData: any = new Customer();
  isSubmitting: boolean = false;
  private destroy$ = new Subject<void>();
  fromHeader: string = 'Due Customer';
  insertOrUpdateAPI: string = 'DueCustomer/SaveCustomerDueAmount';
  getDataByIdAPI: string = 'DueCustomer/GetAllDueCustomerListById';
  listRoute: string = '/GetAllDueCustomerList';

  formdata: any[] = [
    { type: 'text', name: 'name', label: 'Customer Name', required: true,column:4},
    { type: 'text', name: 'address', label: 'Customer Address', required: true,column:4},
    { type: 'text', name: 'phone', label: 'Mobile', required: true,column:4},
    { type: 'text', name: 'email', label: 'Email', required: true,column:4},
    { type: 'select', name: 'customerTypeId', label: 'Type of Customer', required: true,column:4,options:[],optionValue:'id',optionText:'name'},
    { type: 'text', name: 'city', label: 'City', required: true,column:4},
    { type: 'number', name: 'cp', label: 'Customer CP', required: true,column:4},
    { type: 'text', name: 'zipCode', label: 'ZipCode', required: true,column:4},
    
  ];


  

  constructor(
    private dataService: HttpClientConnectionService,
    private toastr: ToastrService,
    private router:ActivatedRoute,
    private route:Router,
    private location:Location,
    public gridHandleService:GridHandlerService,
    private commonService:CommonService
  ) {
    this.router.queryParams.subscribe((data:any)=>{
      if(data.do !=undefined && data !=null){
        this.getDataById(data.do);
      }else{
        this.FormData =new Category();
      }
    });
    this.gridHandleService.add$
    .pipe(takeUntil(this.destroy$)) // Automatically unsubscribes when component is destroyed
    .subscribe(async (data: NgForm) => {
      if (!this.isSubmitting) { // Prevent multiple submissions
        this.isSubmitting = true;

        try {
          await this.onSubmit(data); // Your form submission logic
          this.gridHandleService.selectedTab = "List";
        } catch (error) {
          console.error('Error during submission:', error);
        } finally {
          this.isSubmitting = false; // Reset flag after completion
        }
      }
    });
  }
  ngOnInit(): void {
    this.commonService.getDropDownData(7).subscribe((data:any)=>{
      this.formdata.find(field => field.name === 'customerTypeId').options = data
    })
  }
  onSubmit(form: NgForm) {
    this.insertOrUpdate(form);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  getDataById(id:any){
    this.dataService.GetData(`${this.getDataByIdAPI}?id=`+id).subscribe((data:any)=>{
      // this.FormData=data.data;
      this.FormData = mapKeys(data.data, (_, key) => camelCase(key)) as Category;
    })
  }
  insertOrUpdate(form: NgForm) {
    this.dataService.PostData(this.insertOrUpdateAPI, this.FormData).subscribe(
      (res) => {
        this.toastr.success('Successfull', `${this.fromHeader} Information`);
       this.FormData = new Category();
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
  onValueReceived(eventData: { value: any; fieldName?: any }) {
    this.FormData[eventData.fieldName] = eventData.value;
  }
}

