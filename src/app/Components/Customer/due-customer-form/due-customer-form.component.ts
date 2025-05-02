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

export class DueCustomerFormComponent implements OnInit, OnDestroy {
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
dueAmount : number =0;
  formdata: any[] = [
    { type: 'text', name: 'customerName', label: 'Customer Name', required: true, column: 4, isReadOnly: true },
    { type: 'text', name: 'code', label: 'Customer Code', required: true, column: 4, isReadOnly: true },
    { type: 'text', name: 'address', label: 'Customer Address', required: true, column: 4, isReadOnly: true },
    { type: 'text', name: 'phone', label: 'Mobile', required: true, column: 6, isReadOnly: true },
    { type: 'text', name: 'email', label: 'Email', required: true, column: 6, isReadOnly: true },
    { type: 'text', name: 'totalAmount', label: 'Payable Amount', required: true, column: 4, isReadOnly: true },
    { type: 'text', name: 'givenAmount', label: 'Previous Given Amount', required: true, column: 4, isReadOnly: true },
    { type: 'text', name: 'dueAmount', label: 'Due Amount', required: true, column: 4, isReadOnly: true },
    {
      type: 'text', name: 'givenAmountNow', label: 'Given Amount', required: true, column: 4,
      eventEmit: {
        keyup: 'changeDueAmount',

      }
    },
    { type: 'text', name: 'extraDiscount', label: 'Extra Discount', required: true, column: 4 ,
      eventEmit: {
        keyup: 'changeDueAmount',

      }
    }

  ];




  constructor(
    private dataService: HttpClientConnectionService,
    private toastr: ToastrService,
    private router: ActivatedRoute,
    private route: Router,
    private location: Location,
    public gridHandleService: GridHandlerService,
    private commonService: CommonService
  ) {
    this.router.queryParams.subscribe((data: any) => {
      if (data.do != undefined && data != null) {
        this.getDataById(data.do);
      } else {
        this.FormData = new Category();
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

  }
  onSubmit(form: NgForm) {
    this.insertOrUpdate(form);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  getDataById(id: any) {
    this.dataService.GetData(`${this.getDataByIdAPI}?id=` + id).subscribe((data: any) => {
      // this.FormData=data.data;
      this.FormData = mapKeys(data.data, (_, key) => camelCase(key)) as any;
      this.dueAmount = this.FormData.dueAmount;
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


  changeDueAmount(evt: any) {
    if(Number(evt.target.value) > this.dueAmount){
     this.toastr.error("Due Amount should be getter than Given Amount","Error!");
     this.FormData.givenAmountNow = undefined;
     this.FormData.dueAmount = this.dueAmount;
    }else{
      this.FormData.dueAmount =this.dueAmount - Number(evt.target.value);
    }
  }
}

