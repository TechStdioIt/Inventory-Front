import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { camelCase, mapKeys } from 'lodash';
import { GridHandlerService } from 'src/app/Services/GridHandler.service';
import { Subject, take, takeUntil } from 'rxjs';
import { Doctor, DoctorBrand, DoctorChamber, DoctorDegree, DoctorSpecialDay, DoctorSpeciality } from 'src/app/Models/Doctor';
import { options } from 'devexpress-reporting/scopes/reporting-designer-controls-pivotGrid-metadata';
import { CommonService } from 'src/app/Services/common.service';
import { DeliveryOrder } from 'src/app/Models/DeliveryOrder';
@Component({
  selector: 'app-delivery-order-form',
  templateUrl: './delivery-order-form.component.html',
  styleUrl: './delivery-order-form.component.scss'
})
export class DeliveryOrderFormComponent implements OnInit,OnDestroy {
  [key: string]: any;
  dropdownSettings = {};
  text: string = '';
  exist: boolean = false;
  FormData: any = new DeliveryOrder();
  isSubmitting: boolean = false;
  private destroy$ = new Subject<void>();
  fromHeader: string = 'Delivery Order';
  insertOrUpdateAPI: string = 'DeliveryOrder/CreateOrUpdate';
  getDataByIdAPI: string = 'DeliveryOrder/GetById';
  listRoute: string = '/deliveryOrderList';
  selectedItems: any[] = [];


    //For Bill Form Only
    DetailsData: any[] = [];
    userColumns = [
      { caption: 'ID', key: 'id', width: 50, isShow: false },
      { caption: 'SO Number', key: 'soNo' },
      { caption: 'Product Name ', key: 'productName' },
      { caption: 'Wings Name', key: 'wingsName' },
      { caption: 'Total Price', key: 'tpWithVat' }
    ];
  
    //end of Bill Form Only


  

  getModelClass(modelName: string): any {
    const modelMapping: { [key: string]: any } = {
      
    };
  
    return modelMapping[modelName] || Object;
  }

  businessOptions = [
    { id: true, name: 'Yes' },
    { id: false, name: 'No' }
  ];
  
  formdata: any[] = [
    {
      type: 'select', 
      name: 'soId', 
      label: 'So Id', 
      required: true,
      column:6,
      options:[],
      optionValue: 'id',
      optionText: 'name',
      flag:38,
      isReadOnly:true

    },
    // { type: 'text', name: 'dONo', label: 'Do No', required: true,column:6,placeHolder:"Enter Do No"},
    { type: 'date', name: 'deliveryDate', label: 'Delivery Date', required: true,column:6,placeHolder:"Enter Delivery Date"},
    
    {
      type: 'select', 
      name: 'wareHouseId', 
      label: 'WareHouse', 
      required: true,
      column:6,
      options:[],
      optionValue: 'id',
      optionText: 'name',
      flag:40
    },
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
    {
      type: 'select',
      name: 'isSelf',
      label: 'Is Self',
      required: true,
      column: 6,
      options: this.businessOptions,  
      optionValue: 'id',
      optionText: 'name',
    },
    {
      type: 'select', 
      name: 'deliveryVehicleId', 
      label: 'Delivery Man', 
      required: true,
      column:6,
      options:[],
      optionValue: 'id',
      optionText: 'name',
      flag:51
    },
    
    { type: 'text', name: 'customerName', label: 'Carry By', required: true ,column:6},
    { type: 'text', name: 'remarks', label: 'Remarks', required: true,column:6,placeHolder:"Enter Remarks"},

    

  ];

  SoId: any = 0;

  
  


  

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
      if(data.so !=undefined && data !=null){
        
        this.SoId = data.so;
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
  ngOnInit(): void {

    this.formdata.filter(x=>x.type =='select' || x.type == 'multi-select').forEach((item:any) => 
    {
      if(item.flag){
        this.commonService.getDropDownData(item.flag).subscribe((data:any)=>{
          item.options = data;
        });
      }
    

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

    this.FormData.soId = Number(this.SoId);
    this.onValueReceived({value:this.FormData.soId,fieldName:'soId'});
    this.FormData.deliveryDate = this.formatDate(new Date());
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  onSubmit(form: NgForm) {
    this.insertOrUpdate(form);
  }
  getDataById(id:any){
    this.dataService.GetData(`${this.getDataByIdAPI}?id=`+id).subscribe((data:any)=>{
      // this.FormData=data.data;
      this.FormData = mapKeys(data.data, (_, key) => camelCase(key)) as Doctor;
      this.FormData.deliveryDate = this.formatDate(this.FormData.deliveryDate);
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
    this.FormData[eventData.fieldName] = eventData.value;
    let flagdata = [
      { api: 'SalesOrder/GetOrderById?id=', fieldName: 'soId', for: 'areaId' },
    ];
    let filterflag = flagdata.find((x) => x.fieldName === eventData.fieldName);
    if (filterflag) {
      this.dataService
        .GetData(filterflag.api + eventData.value)
        .subscribe((data: any) => {
          // datagot
                
                this.DetailsData = data.data.detailsInfo;
                this.DetailsData.forEach((item:any)=>{
                  item.soNo = data.data.soNo;
                }
                );

          // this.formdata.find((x) => x.name == filterflag.for).options = data.data;
        });
    }
  }

  formatDate(date: string | Date): string {
    
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



  

