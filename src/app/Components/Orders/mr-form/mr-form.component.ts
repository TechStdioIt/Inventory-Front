import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { camelCase, mapKeys } from 'lodash';
import { GridHandlerService } from 'src/app/Services/GridHandler.service';
import { Subject, takeUntil } from 'rxjs';
import { Doctor } from 'src/app/Models/Doctor';
import { CommonService } from 'src/app/Services/common.service';
import { MoneyReceipt } from 'src/app/Models/MoneyReciept';
@Component({
  selector: 'app-mr-form',
  templateUrl: './mr-form.component.html',
  styleUrl: './mr-form.component.scss'
})
export class MrFormComponent implements OnInit, OnDestroy {
  [key: string]: any;
  dropdownSettings = {};
  text: string = '';
  exist: boolean = false;
  FormData: any = new MoneyReceipt();
  isSubmitting: boolean = false;
  private destroy$ = new Subject<void>();
  fromHeader: string = 'Money Receipt';
  insertOrUpdateAPI: string = 'MoneyReceiptNew/CreateOrUpdateMoneyReceipt';
  getDataByIdAPI: string = 'MoneyReceiptNew/GetInvoiceDataListByIds';
  listRoute: string = '/mrList';
  selectedItems: any[] = [];
  totalInvoiceAmount: number = 0;
  // paymentAmount: number = 0;
  totalOrderAmount: number = 0;
  totalOrderDiscount: number = 0;
  totalPaymentAmount: number = 0;
  totalDiscountAmount: number = 0;
  totalDueAmount: number = 0;
  totalAit: number = 0;


  DetailsData: any[] = [];
  userColumns = [
    { caption: 'ID', key: 'invId', width: 50, isShow: false },
    { caption: 'Invoice Number ', key: 'invoiceNo' },
    { caption: 'Invoice Amount', key: 'totalInvAmount' },
    { caption: 'Previous AIT', key: 'alreadyait' },
    { caption: 'Previos Discount', key: 'alreadydiscountAmount' },
    { caption: 'Previos Payment', key: 'alreadyPaidAmount' },
    { caption: 'Previous Total Amount', key: 'alreadyDone' },
    { caption: 'Total Return Amount', key: 'returnAmt' },
    { caption: 'Order Discount ', key: 'totalOrderDiscount' },
    { caption: 'Payable Amount', key: 'payable', type: 'text' , isReadOnly:true},
    { caption: 'AIT', key: 'ait', type: 'text' },
    { caption: 'Payment', key: 'paymentAmount', type: 'text' },
    { caption: 'Discount', key: 'discountAmount', type: 'text' },
    { caption: 'Due', key: 'dueAmount', type: 'text' , isReadOnly:true}
  ];
  isShowSum :boolean =true;
  // sumColumn:string[]=['','','','totalInvAmount','alreadyait','alreadydiscountAmount','alreadyPaidAmount','alreadyDone','returnAmt']
  sumColumn:any[] = [
    {key:'totalInvAmount',position:4},
    {key:'alreadyait',position:5},
    {key:'alreadydiscountAmount',position:6},
    {key:'alreadyPaidAmount',position:7},
    {key:'alreadyDone',position:8},
    {key:'returnAmt',position:9},
    {key:'totalOrderDiscount',position:10},
    {key:'payable',position:11},
    {key:'ait',position:12},
    
  ]
  Inv: any = 0;

  constructor(
    private dataService: HttpClientConnectionService,
    private toastr: ToastrService,
    private router: ActivatedRoute,
    private route: Router,
    private location: Location,
    public gridHandleService: GridHandlerService,
    private commonService: CommonService
  ) {
    if (this.gridHandleService.checkBoxSelectedData.length < 1) {
      this.gridHandleService.selectedTab = 'List';
      this.route.navigate([this.listRoute]);
    } else {
      this.getDataById();
    }

    this.gridHandleService.add$
      .pipe(takeUntil(this.destroy$)) // Automatically unsubscribes when component is destroyed
      .subscribe(async (data: NgForm) => {
        if (!this.isSubmitting) {
          // Prevent multiple submissions
          this.isSubmitting = true;

          try {
            await this.onSubmit(data); // Your form submission logic
            this.gridHandleService.selectedTab = 'List';
          } catch (error) {
            console.error('Error during submission:', error);
          } finally {
            this.isSubmitting = false; // Reset flag after completion
          }
        }
      });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  ngOnInit(): void {}
  onSubmit(form: NgForm) {
    this.insertOrUpdate(form);
  }
  getDataById() {
    this.dataService
      .PostData(this.getDataByIdAPI, this.gridHandleService.checkBoxSelectedData)
      .subscribe((data: any) => {
        // this.FormData=data.data;
        // this.FormData = mapKeys(data.data, (_, key) => camelCase(key)) as Doctor;
        this.DetailsData = data.data;
        this.DetailsData.forEach((item: any) => {
          item.dueAmount  = 0; 
          item.ait = 0;
          item.paymentAmount = item.totalInvAmount - item.alreadyDone - item.returnAmt - item.totalOrderDiscount;
          item.discountAmount = 0;
          item.payable = item.totalInvAmount - item.alreadyDone - item.returnAmt - item.totalOrderDiscount;
        });
        this.FormData.moneyReceiptDetails = this.DetailsData;
      });
  }
  insertOrUpdate(form: NgForm) {
    
    this.changeData();
    this.dataService.PostData(this.insertOrUpdateAPI, this.FormData).subscribe(
      (res) => {
        this.toastr.success('Successfull', `${this.fromHeader} Information`);
        this.FormData = new Doctor();
        this.route.navigate([this.listRoute]);
        this.gridHandleService.selectedTab = 'List';
      },
      (err) => {
        this.toastr.error('Please Try Again', 'Invalid Information!!');
        console.log(err);
      }
    );
  }

  DetailsDataReceived(eventData: { value: any; index: any; fieldName: any }) {
    this.DetailsData = eventData.value;
    this.FormData.moneyReceiptDetails = this.DetailsData;
    if (!this.DetailsData || !this.DetailsData[eventData.index]) return;
    const ind = this.DetailsData[eventData.index];
    ind.dueAmount = (ind.payable) - (Number(ind.paymentAmount) + Number(ind.discountAmount) + Number(ind.ait));
    this.DetailsData[eventData.index] = ind;
  }
  changeData(){
    this.totalInvoiceAmount = this.DetailsData.reduce((acc, curr) => acc + curr.totalInvAmount, 0);
    this.totalOrderAmount = this.DetailsData.reduce((acc, curr) => acc + curr.totalOrderAmount, 0);
    this.totalOrderDiscount = this.DetailsData.reduce((acc, curr) => acc + curr.totalOrderDiscount, 0);
    this.totalPaymentAmount = this.DetailsData.reduce((acc, curr) => Number(acc) + Number(curr.paymentAmount), 0);
    this.totalDiscountAmount = this.DetailsData.reduce((acc, curr) => Number(acc) + Number(curr.discountAmount), 0);
    this.totalDueAmount = this.DetailsData.reduce((acc, curr) => Number(acc) + Number(curr.dueAmount), 0);
    this.totalAit = this.DetailsData.reduce((acc, curr) => Number(acc) + Number(curr.ait), 0);

    this.FormData.totalInvAmount  = this.totalInvoiceAmount;
    this.FormData.totalOrderAmount = this.totalOrderAmount;
    this.FormData.totalOrderDiscount = this.totalOrderDiscount;
    this.FormData.paymentAmount = this.totalPaymentAmount;
    this.FormData.moneyReceiptDiscountAmount  = this.totalDiscountAmount;
    this.FormData.dueAmount = this.totalDueAmount;
    this.FormData.ait = this.totalAit;
  }
}
