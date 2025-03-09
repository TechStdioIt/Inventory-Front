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
import { SalesInvoice } from 'src/app/Models/SalesInvoice';
import { Doctor } from 'src/app/Models/Doctor';
@Component({
  selector: 'app-inv-form',
  templateUrl: './inv-form.component.html',
  styleUrl: './inv-form.component.scss'
})
export class InvFormComponent implements OnInit,OnDestroy {
  [key: string]: any; 
  dropdownSettings = {};
  text: string = '';
  exist: boolean = false;
  FormData: any = new SalesInvoice();
  isSubmitting: boolean = false;
  private destroy$ = new Subject<void>();
  fromHeader: string = 'Invoice';
  insertOrUpdateAPI: string = 'Invoice/CreateOrUpdate';
  getDataByIdAPI: string = 'Invoice/GetById';
  listRoute: string = '/invList';
  selectedItems: any[] = [];


  

  getModelClass(modelName: string): any {
    const modelMapping: { [key: string]: any } = {
      
    };
  
    return modelMapping[modelName] || Object;
  }

  
  
  formdata: any[] = [
    {
      type: 'select', 
      name: 'dOId', 
      label: 'Do Id', 
      required: true,
      column:6,
      options:[],
      optionValue: 'id',
      optionText: 'name',
      flag:41,
      isReadOnly:true
    },
    { type: 'date', name: 'invoiceDate', label: 'Invoice Date', required: true,column:6,placeHolder:"Enter Invoice Date"},
    { type: 'text', name: 'remarks', label: 'Remarks', required: true,column:6,placeHolder:"Enter Remarks"},
    

  ];
  DetailsData: any[] = [];
  userColumns = [
    { caption: 'ID', key: 'id', width: 50, isShow: false },
    { caption: 'Product Name ', key: 'productName' },
    { caption: 'Wings Name', key: 'wingsName' },
    { caption: 'Total Price', key: 'tpWithVat' }
  ];
  
  Inv:any = 0;


  

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
      // doNo
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
    this.FormData.dOId = Number(this.Inv);
    this.onValueReceived({value:this.FormData.dOId,fieldName:'dOId'});
    this.FormData.invoiceDate = this.formatDate(new Date());
  }
  onSubmit(form: NgForm) {
    this.insertOrUpdate(form);
  }
  getDataById(id:any){
    this.dataService.GetData(`${this.getDataByIdAPI}?id=`+id).subscribe((data:any)=>{
      // this.FormData=data.data;
      this.FormData = mapKeys(data.data, (_, key) => camelCase(key)) as Doctor;
      this.FormData.invoiceDate = this.formatDate(this.FormData.invoiceDate);
    })
  }
  insertOrUpdate(form: NgForm) {
    this.dataService.PostData(this.insertOrUpdateAPI, this.FormData).subscribe(
      (res) => {
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
    debugger;
    this.FormData[eventData.fieldName] = eventData.value;
    let flagdata = [
      { api: 'DeliveryOrder/GetById?id=', fieldName: 'dOId' },
    ];
    let filterflag = flagdata.find((x) => x.fieldName === eventData.fieldName);
    if (filterflag) {
      this.dataService
        .GetData(filterflag.api + eventData.value)
        .subscribe((data: any) => {
          // datagot
          debugger;
                this.DetailsData = data.data.detailsInfo;
                this.FormData.invoiceAmount = this.DetailsData.reduce((a:any,b:any)=>a+b.tpWithVat,0);
                // this.DetailsData.forEach((item:any)=>{
                //   item.tpWithVat = item.totalPrice + item.vatAmount;
                // });


          // this.formdata.find((x) => x.name == filterflag.for).options = data.data;
        });
    }
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
