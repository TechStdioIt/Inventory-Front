import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { camelCase, mapKeys } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { Regeion } from 'src/app/Models/Regeion';
import { CommonService } from 'src/app/Services/common.service';
import { GridHandlerService } from 'src/app/Services/GridHandler.service';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';

@Component({
  selector: 'app-regeion-form',
  templateUrl: './regeion-form.component.html',
  styleUrl: './regeion-form.component.scss'
})
export class RegeionFormComponent implements OnInit,OnDestroy{
  [key: string]: any;
  dropdownSettings = {};
  text: string = '';
  exist: boolean = false;
  FormData: any = new Regeion();
  isSubmitting: boolean = false;
  private destroy$ = new Subject<void>();
  fromHeader: string = 'Regeion Form';
  insertOrUpdateAPI: string = 'Unit/CreateOrUpdateRegeion';
  getDataByIdAPI: string = 'ProductDiscount/GetByIdProductDis';
  listRoute: string = '/productWiseDiscountList';
  selectedItems: any[] = [];
  selectedProduct: any;

  getModelClass(modelName: string): any {
    const modelMapping: { [key: string]: any } = {};
    return modelMapping[modelName] || Object;
  }

  formdata: any[] = [
    { type: 'text', name: 'districtName', label: 'Distric Name', required: true, column: 12,},
    {
      type: 'select',
      name: 'thanaParentId',
      label: 'Select District',
      required: true,
      column: 6,
      options: [],
      optionValue: 'id',
      optionText: 'name',
      flag: 14,
    },
    { type: 'text', name: 'upazilaName', label: 'Upazila Name', required: true, column: 6,},
    {type: 'select',name: 'districIdForUp',label: 'Select District',required: true,column: 4,
      options: [],optionValue: 'id',optionText: 'name',flag: 14,},
    {type: 'select',name: 'areaParentId',label: 'Select Upazila',required: true,column: 4,
      options: [],optionValue: 'id',optionText: 'name',flag:0},
    { type: 'text', name: 'areaName', label: 'Area Name', required: true, column: 4,},
    {type: 'select',name: 'districIdForArea',label: 'Select District',required: true,column: 3,
      options: [],optionValue: 'id',optionText: 'name',flag: 14,},
    {type: 'select',name: 'upazilaId',label: 'Select Upazila',required: true,column: 3,
      options: [],optionValue: 'id',optionText: 'name',flag:0},
    {type: 'select',name: 'subAreaParentId',label: 'Select Area',required: true,column: 3,
      options: [],optionValue: 'id',optionText: 'name',flag:0},
    { type: 'text', name: 'subAreaName', label: 'SubArea Name', required: true, column: 3,},
  ];

  constructor(
    private dataService: HttpClientConnectionService,
    private toastr: ToastrService,
    private router: ActivatedRoute,
    private route: Router,
    public gridHandleService: GridHandlerService,
    private commonService: CommonService
  ) {
    this.router.queryParams.subscribe((data: any) => {
      if (data.do != undefined && data != null) {
        this.getDataById(data.do);
      } else {
        this.FormData = new Regeion();
      }
    });
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
  }
  onSubmit(form: NgForm) {
    this.insertOrUpdate(form);
  }
  getDataById(id: any) {
    debugger;
    this.dataService.GetData(`${this.getDataByIdAPI}?id=` + id).subscribe((data: any) => {
      // this.FormData=data.data;
     
      this.FormData = mapKeys(data.data, (_, key) => camelCase(key)) as Regeion;
      this.FormData.activeFromDate = this.formatDate(this.FormData.activeFromDate);
      this.FormData.expireDate = this.formatDate(this.FormData.expireDate);
    });
  }
  insertOrUpdate(form: NgForm) {
    this.dataService.PostData(this.insertOrUpdateAPI, this.FormData).subscribe(
      (res) => {
        this.toastr.success('Successfull', `${this.fromHeader} Information`);
        this.FormData = new Regeion();
        this.route.navigate([this.listRoute]);
        this.gridHandleService.selectedTab = 'List';
      },
      (err) => {
        this.toastr.error('Please Try Again', 'Invalid Information!!');
        console.log(err);
      }
    );
  }
  handleEvent(functionName: string, event: any, fieldName?: string, optionModel?: any) {
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
      { api: 'Unit/GetAllRegeionByParentId?parentId=', fieldName: 'districIdForUp', for: 'areaParentId' },
      { api: 'Unit/GetAllRegeionByParentId?parentId=', fieldName: 'districIdForArea', for: 'upazilaId' },
      { api: 'Unit/GetAllRegeionByParentId?parentId=', fieldName: 'upazilaId', for: 'subAreaParentId' },
    ];
    let filterflag = flagdata.find((x) => x.fieldName === eventData.fieldName);
    if (filterflag) {
      this.dataService
        .GetData(filterflag.api + eventData.value)
        .subscribe((data: any) => {
          // datagot
                
          this.formdata.find((x) => x.name == filterflag.for).options = data.data;

          // this.formdata.find((x) => x.name == filterflag.for).options = data.data;
        });
    }
  
    if (eventData.fieldName == 'productId') {
      this.selectedProduct = this.formdata.find((x) => x.name == 'productId').options.find((x: any) => x.id === eventData.value);
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


  onValueSelect(event:any, fieldName: string)
  {
    debugger;
    maxDate: new Date();
  }
}
