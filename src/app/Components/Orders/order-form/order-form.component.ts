

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { camelCase, mapKeys } from 'lodash';
import { GridHandlerService } from 'src/app/Services/GridHandler.service';
import { Subject, takeUntil } from 'rxjs';
import { CommonService } from 'src/app/Services/common.service';
@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrl: './order-form.component.scss'
})
export class OrderFormComponent implements OnInit,OnDestroy {
  [key: string]: any;
  text: string = '';
  exist: boolean = false;
  FormData: any = {};
  isSubmitting: boolean = false;
  private destroy$ = new Subject<void>();
  fromHeader: string = 'Sales Order';
  insertOrUpdateAPI: string = 'SalesOrder/CreateOrUpdateOrder';
  getDataByIdAPI: string = 'SalesOrder/GetOrderById';
  listRoute: string = '/orderPList';
selectedItemList:any[]=[];

allProduct:any[]=[];
  formdata: any[] = [
    {  type: 'select',
      name: 'customerId',
      label: 'Customer',
      required: true,
      column: 6,
      options: [],
      optionValue: 'id',
      optionText: 'name',
      flag: 8,
    },
    { 
      type: 'select',
      name: 'salesTypeId',
      label: 'Sales Type',
      required: true,
      column: 6,
      options: [],
      optionValue: 'id',
      optionText: 'name',
      flag: 9, 
    },
    { type: 'date', name: 'deliveryDate', label: 'Delivery Date', required: true ,column:4},
    { type: 'number', name: 'totalOrder', label: 'Total Amount', required: true ,column:4,isReadOnly:true},
    { 
      type: 'select',
      name: 'currencyId',
      label: 'Currency',
      required: true,
      column: 6,
      options: [],
      optionValue: 'id',
      optionText: 'name',
      flag: 10, 
    }
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
        this.FormData ={}
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
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  ngOnInit(): void {
    this.formdata
      .filter((x) => x.type == 'select' || x.type == 'multi-select')
      .forEach((item: any) => {
        if (item.isApiData) {
          this.commonService.GetDataById(item.api).subscribe((data: any) => {
            item.options = data.data;
          });
        } else {
          if(!item.isApiCall){
            if (item.flag) {
              this.commonService.getDropDownData(item.flag).subscribe((data: any) => {
                item.options = data;
              });
            }
          }
          
        }
      });
    this.getProductList();
   
  }
  getProductList(){
    this.dataService.GetData('Products/GetAllProductData?take=100&skip=0').subscribe((data:any)=>{
      this.allProduct = data.data
    })
  }


  onSubmit(form: NgForm) {
    this.insertOrUpdate(form);
  }
  getDataById(id:any){
    this.dataService.GetData(`${this.getDataByIdAPI}?id=`+id).subscribe((data:any)=>{
      this.FormData = mapKeys(data.data, (_, key) => camelCase(key)) ;
      this.FormData.deliveryDate = this.formatDate(this.FormData.deliveryDate);
      if(data.data.detailsInfo.length >0){
        this.FormData.ordersList =[];
        data.data.detailsInfo.forEach((element:any) => {
        this.updateGridData(element);
        // this.totalAmountCalculate();
        });
      }
    
    })
  }
  insertOrUpdate(form: NgForm) {
    this.dataService.PostData(this.insertOrUpdateAPI, this.FormData).subscribe(
      
      (res) => {
        this.toastr.success('Successfull', `${this.fromHeader} Information`);
       this.FormData = {};
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
 updateGridData(item:any){
  const data = {
    productId: item.productId,
    orderQty: Number(item.orderQty),
    unitPrice: item.orderTp,
    totalPrice: item.price,
    name: item.productName,
    productCode: item.productCode,
    orderTp :item.orderTp,
    oderTtp :item.orderTtp,
    tpWithVat :item.tpWithVat
  };
  this.selectedItemList.push(data);
  this.FormData.ordersList.push(data);
 }
  
  selectProduct(option: any) {
    
    // Check if the product already exists in selectedItemList based on productId (option.id)
    const existingProduct = this.selectedItemList.find(item => item.productId === option.id);
    
    if (existingProduct) {
      this.toastr.error('Already Added','Duplicate!')
    } else {
      // Product doesn't exist, add it to the selectedItemList
      const data = {
        // id: 0,
        // purchaseOrderId: 0,
        // productId: option.id,
        // quantity: 1,
        // unitPrice: option.price,
        // totalPrice: option.price,
        // name: option.name,
        // productCode: option.productCode
        orderTp : option.price,
        productId : option.id,
        orderQty : 1,
        oderTtp :0,
        tpWithVat : 0,
        unitPrice: option.price,
        totalPrice: option.price,
        productCode: option.productCode,
        name: option.name
      };
      this.selectedItemList.push(data);
      this.FormData.ordersList.push(data);
      this.totalAmountCalculate();
    }
  }
  totalAmountCalculate() {
    this.FormData.totalOrder = this.FormData.ordersList.reduce((total: number, item: any) => {
      return total + item.totalPrice;
    }, 0);
  }
  
  onValueReceived(eventData: { value: any; fieldName?: any }) {
    this.FormData[eventData.fieldName] = eventData.value;
  }

  onCellValueChanged(event: any) {
    const updatedData = event.data;
    
    // Check if 'quantity' or 'unitPrice' has changed
    if (event.column.dataField === 'orderQty' ) {
      // Calculate and update the 'totalPrice'
      var exist = this.FormData.ordersList.find((x:any)=>x.productId == updatedData.productId);
      if(exist){
        exist.orderQty = Number(updatedData.orderQty);
        exist.unitPrice = updatedData.unitPrice
        exist.totalPrice = updatedData.orderQty * updatedData.unitPrice
        updatedData.totalPrice = updatedData.orderQty * updatedData.unitPrice;
      }
    }
  }
  onRowUpdated(event: any) {
    
    const updatedData = event.data;
    
    // Check if 'quantity' or 'unitPrice' has changed
    if (updatedData.orderQty) {
      var exist = this.FormData.ordersList.find((x:any)=>x.productId == updatedData.productId);
      if(exist){
        exist.orderQty = Number(updatedData.orderQty);
        exist.unitPrice = updatedData.unitPrice
        exist.totalPrice = Number(updatedData.orderQty) * updatedData.unitPrice;
          // Calculate and update the 'totalPrice'
      updatedData.totalPrice = updatedData.orderQty * updatedData.unitPrice;
      } 
      this.totalAmountCalculate();
    }
    
    // You can refresh the grid if necessary (although DevExtreme usually handles this automatically)
    event.component.refresh();
  }

  formatDate(date: string | Date): string {
    debugger;
    if (!date) return ''; // Handle undefined or null values

    // If date is already a Date object, convert it to YYYY-MM-DD format
    if (date instanceof Date) {
      return date.toISOString().split('T')[0]; 
    }

    // If date is a string (from API), convert it to a Date object first
    const parsedDate = new Date(date);
    
    if (isNaN(parsedDate.getTime())) {
      console.error("Invalid date format:", date);
      return ''; // Handle invalid date formats gracefully
    }

    return parsedDate.toISOString().split('T')[0]; // Extract YYYY-MM-DD
  }




}
