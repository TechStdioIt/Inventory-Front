import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { camelCase, mapKeys } from 'lodash';
import { GridHandlerService } from 'src/app/Services/GridHandler.service';
import { Subject, take, takeUntil } from 'rxjs';
import { CommonService } from 'src/app/Services/common.service';
import { MoneyReceipt } from 'src/app/Models/MoneyReciept';
import { Doctor } from 'src/app/Models/Doctor';
@Component({
  selector: 'app-mr-form',
  templateUrl: './mr-form.component.html',
  styleUrl: './mr-form.component.scss'
})
export class MrFormComponent implements OnInit,OnDestroy {
  [key: string]: any;
  dropdownSettings = {};
  text: string = '';
  exist: boolean = false;
  FormData: any = new MoneyReceipt();
  isSubmitting: boolean = false;
  private destroy$ = new Subject<void>();
  fromHeader: string = 'Money Receipt';
  insertOrUpdateAPI: string = 'MoneyReceipt/CreateOrUpdateMoneyReceipt';
  getDataByIdAPI: string = 'MoneyReceipt/GetMoneyReceiptById';
  listRoute: string = '/mrList';
  selectedItems: any[] = [];
  totalInvoiceAmount: number = 0;
  paymentAmount: number = 0;

  getModelClass(modelName: string): any {
    const modelMapping: { [key: string]: any } = {
      
    };
  
    return modelMapping[modelName] || Object;
  }

  
  
  formdata: any[] = [
    {
      type: 'select', 
      name: 'invoiceId', 
      label: 'Invoice', 
      required: true,
      column:6,
      options:[],
      optionValue: 'id',
      optionText: 'name',
      flag:42,
      isReadOnly:true
    },
    { type: 'date', name: 'moneReceiptDate', label: 'Money Receipt Date', required: true,column:6,placeHolder:"Money Receipt Date"},
    { type: 'number', name: 'paymentAmount', label: 'Payment Amount', required: true,column:6,placeHolder:"Enter Payment Amount",isLabelNote:true,
      LabelNote:""},
    { type: 'number', name: 'discountAmount', label: 'Discount Amount', required: true,column:6,placeHolder:"Enter Discount Amount"},
    { type: 'number', name: 'tax', label: 'Tax', required: true,column:6,placeHolder:"Enter Tax"},
    { type: 'number', name: 'vat', label: 'Vat', required: true,column:6,placeHolder:"Enter Vat"},
    { type: 'number', name: 'ait', label: 'AIT', required: true,column:6,placeHolder:"Enter AIT"},
    {
      type: 'select', 
      name: 'paymentMethodId', 
      label: 'Payment Method', 
      required: true,
      column:6,
      options:[],
      optionValue: 'id',
      optionText: 'name',
      flag:18
    },
    

  ];

  DetailsData: any[] = [];
  userColumns = [
    { caption: 'ID', key: 'id', width: 50, isShow: false },
    { caption: 'Product Name ', key: 'productName'},
    { caption: 'Wings Name', key: 'wingsName' },
    { caption: 'Total Price', key: 'tpWithVat' },
    { caption: 'Order Quantity', key: 'orderQty' },
    { caption: 'Return Product', key: 'returnQty', type: 'text' }
  ];

  Inv: any = 0;
  


  

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

      if(data.inv !=undefined && data !=null){
        debugger;
        this.Inv = data.inv;
      }

      if(data.do !=undefined && data !=null){
        this.getDataById(data.do);
      }else{
        this.FormData =new Doctor();
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

    this.formdata.filter(x=>x.type =='select' || x.type == 'multi-select').forEach((item:any) => 
    {
      this.commonService.getDropDownData(item.flag).subscribe((data:any)=>{
        item.options = data;
      });

    });


    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };
    debugger;
    this.FormData.invoiceId = Number(this.Inv);
    this.onValueReceived({value:this.FormData.invoiceId,fieldName:'invoiceId'});
    this.FormData.moneReceiptDate = this.formatDate(new Date());

  }
  onSubmit(form: NgForm) {
    this.insertOrUpdate(form);
  }
  getDataById(id:any){
    this.dataService.GetData(`${this.getDataByIdAPI}?id=`+id).subscribe((data:any)=>{
      // this.FormData=data.data;
      this.FormData = mapKeys(data.data, (_, key) => camelCase(key)) as Doctor;
      this.FormData.moneReceiptDate = this.formatDate(this.FormData.moneReceiptDate);

    })
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
  insertOrUpdate(form: NgForm) {
    this.dataService.PostData(this.insertOrUpdateAPI, this.FormData).subscribe(
      (res) => {
        this.dataService.PostData('ProductReturn/CreateOrUpdateProductReturn', this.DetailsData).subscribe((data:any)=>{
          console.log(data);
        });
        this.toastr.success('Successfull', `${this.fromHeader} Information`);
       this.FormData = new Doctor();
       this.route.navigate([this.listRoute]);
       this.gridHandleService.selectedTab = "List";
      },
      (err) => {
        this.toastr.error('Please Try Again', 'Invalid Information!!');
        console.log(err);
      }
    );
  }
  handleEvent(functionName: string, event: any, fieldName?: string,  optionModel?: any) {
    if (typeof this[functionName] === 'function') {
      this[functionName](event, fieldName, optionModel); // Dynamically call the specified function
    } else {
      console.error(`Function ${functionName} is not defined`);
    }
  }
  onItemSelect(item: any, fieldName: string, optionModel: any) {
    if (!this.FormData[fieldName]) {
      this.FormData[fieldName] = [];
    }
    this.selectedItems.push(item.id);
    let ModelClass = this.getModelClass(optionModel.model);
    let newEntry = new ModelClass();
    newEntry[optionModel.optionValue] = item.id;
    this.FormData[fieldName].push(newEntry);
  }
  // Triggered when an item is unselected
  onItemDeSelect(item: any, fieldName: string) {
    var exist = this.selectedItems.find((x: number) => x === item.id);
    var foundItem = this.FormData[fieldName]?.find((x: any) => x.specialityId === item.id);
  
    if (foundItem) {
      const index = this.FormData[fieldName].indexOf(foundItem);
      if (index !== -1) {
        this.FormData[fieldName].splice(index, 1);
      }
    }
    if (exist) {
      const selectedIndex = this.selectedItems.indexOf(exist);
      if (selectedIndex !== -1) {
        this.selectedItems.splice(selectedIndex, 1);
      }
    }
  }
  // Triggered when all items are selected
  onSelectAll(items: any, fieldName: string, optionModel: any) {
    if (!this.FormData[fieldName]) {
      this.FormData[fieldName] = [];
    }
    let ModelClass = this.getModelClass(optionModel.model);
    items.forEach((item: any) => {
      this.selectedItems.push(item.id);
  
      let newEntry = new ModelClass();
      newEntry[optionModel.optionValue] = item.id;
  
      this.FormData[fieldName].push(newEntry);
    });
  }
  // Triggered when all items are unselected
  onDeSelectAll(items: any, fieldName: string) {
    this.selectedItems = [];
    this.FormData[fieldName] = [];
  }
  onValueReceived(eventData: { value: any; fieldName?: any }) {
    this.FormData[eventData.fieldName] = eventData.value;
    let flagdata = [
      { api: 'Invoice/GetById?id=', fieldName: 'invoiceId' },
    ];
    let filterflag = flagdata.find((x) => x.fieldName === eventData.fieldName);
    if (filterflag) {
      this.dataService
        .GetData(filterflag.api + eventData.value)
        .subscribe((data: any) => {
          // datagot
          debugger;
                this.DetailsData = data.data.detailsInfo;
                this.totalInvoiceAmount = this.DetailsData.reduce((a:any,b:any)=>a+b.tpWithVat,0);
                this.paymentAmount = this.totalInvoiceAmount;
                // this.FormData.paymentAmount = this.totalInvoiceAmount;
                this.formdata.find(x=>x.name == 'paymentAmount').LabelNote = `Inv Amount: ${this.totalInvoiceAmount} || Payment Amount: ${this.paymentAmount}`;

        });
    }

  }

  DetailsDataReceived(eventData: { value: any, index: any, fieldName: any }) {
    debugger;
    this.DetailsData = eventData.value;
    
    // Ensure index exists in DetailsData
    if (!this.DetailsData || !this.DetailsData[eventData.index]) return;

    const ind = this.DetailsData[eventData.index];
    const total = ind.tpWithVat;
    const returnQty = ind.returnQty;
    const orderQty = ind.orderQty;

    // Prevent division by zero
    const returnAmount = (orderQty > 0) ? (total / orderQty) * returnQty : 0;

    // Recalculate total `paymentAmount` correctly for all products
    this.paymentAmount = this.DetailsData.reduce((acc: number, item: any) => {
        const itemTotal = item.tpWithVat || 0;
        const itemReturnQty = item.returnQty || 0;
        const itemOrderQty = item.orderQty || 1; // Avoid division by zero
        const itemReturnAmount = (itemOrderQty > 0) ? (itemTotal / itemOrderQty) * itemReturnQty : 0;
        return acc + (itemTotal - itemReturnAmount);
    }, 0);

    // Update form label
    this.formdata.find(x => x.name === 'paymentAmount').LabelNote = 
        `Inv Amount: ${this.totalInvoiceAmount} || Payment Amount: ${this.paymentAmount}`;
}





  
}
