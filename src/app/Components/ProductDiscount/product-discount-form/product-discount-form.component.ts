import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { event } from 'jquery';
import { camelCase, mapKeys, max } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { discountProduct } from 'src/app/Models/DiscountProduct';
import { CommonService } from 'src/app/Services/common.service';
import { GridHandlerService } from 'src/app/Services/GridHandler.service';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';

@Component({
  selector: 'app-product-discount-form',
  templateUrl: './product-discount-form.component.html',
  styleUrl: './product-discount-form.component.scss'
})
export class ProductDiscountFormComponent implements OnInit, OnDestroy{
  [key: string]: any;
  dropdownSettings = {};
  text: string = '';
  exist: boolean = false;
  FormData: any = new discountProduct();
  isSubmitting: boolean = false;
  private destroy$ = new Subject<void>();
  fromHeader: string = 'Discount Product';
  insertOrUpdateAPI: string = 'ProductDiscount/CreateOrUpdateProductDis';
  getDataByIdAPI: string = 'ProductDiscount/GetByIdProductDis';
  listRoute: string = '/productWiseDiscountList';
  selectedItems: any[] = [];

  selectedProduct: any;

  getModelClass(modelName: string): any {
    const modelMapping: { [key: string]: any } = {};

    return modelMapping[modelName] || Object;
  }

  formdata: any[] = [
    {
      type: 'select',
      name: 'productId',
      label: 'Select Product',
      required: true,
      column: 6,
      options: [],
      optionValue: 'id',
      optionText: 'name',
      flag: 11,
    },
    { type: 'number', name: 'discountPercent', label: 'Discount in Percent', required: true, column: 6,
      eventEmit:{
        keyup: "onDiscountChange"
      }
     },
    { type: 'number', name: 'discountPrice', label: 'Discount in Amount', required: true, column: 6,
      eventEmit:{
        keyup: "onDiscountChange"
      } },
      { type: 'date', name: 'activeFromDate', label: 'Active Form', required: true, column: 6, min:this.formatDate(new Date())
       
      },
      { type: 'date', name: 'expireDate', label: 'Expire In', required: true, column: 6, min:this.formatDate(new Date()) },
  ];

  constructor(
    private dataService: HttpClientConnectionService,
    private toastr: ToastrService,
    private router: ActivatedRoute,
    private route: Router,
    private location: Location  ,
    public gridHandleService: GridHandlerService,
    private commonService: CommonService
  ) {
    this.router.queryParams.subscribe((data: any) => {
      if (data.do != undefined && data != null) {
        this.getDataById(data.do);
      } else {
        this.FormData = new discountProduct();
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
    this.formdata
      .filter((x) => x.type == 'select' || x.type == 'multi-select')
      .forEach((item: any) => {
        if(item.name == 'productId'){
          this.commonService.getDropDownData(item.flag).subscribe((data: any) => {
            data.forEach((element: any) => {
              element.name = element.name + ', Price - ' + (element.price !== null ? element.price : 0) + ' Taka';
              if(element.id == this.FormData.productId){
                this.selectedProduct = element;
              }
            });
            item.options = data;
          });
        }
        else{
          this.commonService.getDropDownData(item.flag).subscribe((data: any) => {
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
     
      this.FormData = mapKeys(data.data, (_, key) => camelCase(key)) as discountProduct;
      this.FormData.activeFromDate = this.formatDate(this.FormData.activeFromDate);
      this.FormData.expireDate = this.formatDate(this.FormData.expireDate);
    });
  }
  insertOrUpdate(form: NgForm) {
    this.dataService.PostData(this.insertOrUpdateAPI, this.FormData).subscribe(
      (res) => {
        this.toastr.success('Successfull', `${this.fromHeader} Information`);
        this.FormData = new discountProduct();
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
    this.FormData[eventData.fieldName] = eventData.value;
    
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


  onDiscountChange(event:any, fieldName: string){
    debugger;
    if(this.selectedProduct){
      if(fieldName == 'discountPercent')
      {
        this.FormData.discountPrice = 0;
        const discountPrice = (this.selectedProduct.price * event.target.value / 100);
        if(discountPrice > this.selectedProduct.price)
        {
          this.toastr.error('Discount Price can not be greater than Purchase Rate', 'Invalid Information!!');
          this.FormData.discountPercent = 0;
          this.FormData.discountPrice = 0;
          return
        }
        this.FormData.discountPrice = discountPrice;
      }
      if(fieldName == 'discountPrice')
      {
        this.FormData.discountPercent = 0;
        const discountPercent = (event.target.value / this.selectedProduct.price) * 100;
        if(discountPercent > 100)
        {
          this.toastr.error('Discount Amount Can not be Grater than Sale Price', 'Invalid Information!!');
          this.FormData.discountPercent = 0;
          this.FormData.discountPrice = 0;
          return
        }
        this.FormData.discountPercent = discountPercent;
      }
    }
  }

  onValueSelect(event:any, fieldName: string)
  {
    debugger;
    maxDate: new Date();
  }

}
