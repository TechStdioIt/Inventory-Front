import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { camelCase, mapKeys } from 'lodash';
import { GridHandlerService } from 'src/app/Services/GridHandler.service';
import { Subject, take, takeUntil } from 'rxjs';
import { Unit } from 'src/app/Models/Unit';
import { PurchaseOrder } from 'src/app/Models/PurchaseItem';
import { CommonService } from 'src/app/Services/common.service';
@Component({
  selector: 'app-purchase-order-form',
  templateUrl: './purchase-order-form.component.html',
  styleUrl: './purchase-order-form.component.scss'
})
export class PurchaseOrderFormComponent implements OnInit,OnDestroy {
  [key: string]: any;
  text: string = '';
  exist: boolean = false;
  FormData: any = new PurchaseOrder();
  isSubmitting: boolean = false;
  fromHeader: string = 'Purchase Order';
  insertOrUpdateAPI: string = 'PurchasOrder/CreateOrUpdatePurchaseOrder';
  getDataByIdAPI: string = 'PurchasOrder/GetPOById';
  listRoute: string = '/purchaseOrderList';
selectedItemList:any[]=[];
allProduct:any[]=[];
searchText: string = '';
private destroy$ = new Subject<void>();
  formdata: any[] = [
    { type: 'select', name: 'supplierId', label: 'Supplier Name', required: true,column:4,options:[],optionText:'name',optionValue:'id'},
    { type: 'text', name: 'batchNo', label: 'Batch No', required: true ,column:4},
    { type: 'date', name: 'orderDate', label: 'Order Date', required: true ,column:4},
    { type: 'number', name: 'shippingCost', label: 'Shipping Cost', required: true ,column:4},
    { type: 'select', name: 'paymentMethodId', label: 'Payment Method', required: true ,column:4,options:[],optionText:'name',optionValue:'id'},
    { type: 'number', name: 'totalDiscount', label: 'Total Discount', required: true ,column:4,isReadOnly:true},
    { type: 'number', name: 'tax', label: 'Total Tax', required: true ,column:4,isReadOnly:true},
    { type: 'number', name: 'totalAmount', label: 'Total Amount', required: true ,column:4,isReadOnly:true},
    
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
        this.FormData =new PurchaseOrder();
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
    this.getSupplierData();
    this.getPaymentMethod();
    this.getProductList();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  getProductList(){
    this.dataService.GetData('Products/GetAllProductData?take=100&skip=0').subscribe((data:any)=>{
      this.allProduct = data.data
    })
  }
  getSupplierData(take:number =10,skip:number =0){
this.dataService.GetData(`Suppliers/GetAllSuppliers?take=${take}&skip=${skip}`).subscribe((data:any)=>{
  this.formdata.find(field => field.name === 'supplierId').options = data.data.map((x:any) => ({ 
    id: x.id, 
    name: x.companyName 
  }));
  
})
  }
  getPaymentMethod(){
   this.commonService.getDropDownData(6).subscribe((data:any)=>{
    this.formdata.find(field => field.name === 'paymentMethodId').options = data;
   })
  }
  onSubmit(form: NgForm) {
    this.insertOrUpdate(form);
  }
  getDataById(id:any){
    this.dataService.GetData(`${this.getDataByIdAPI}?id=`+id).subscribe((data:any)=>{
      debugger;
      // this.FormData=data.data;
      this.FormData = mapKeys(data.data, (_, key) => camelCase(key)) as PurchaseOrder;
      debugger;
      this.FormData.orderDate = this.formatDate(this.FormData.orderDate);
      if(data.data.detailsInfo.length >0){
        this.FormData.purchasList =[];
        data.data.detailsInfo.forEach((element:any) => {
        this.updateGridData(element);
        });
        this.totalAmountCalculate();
      }
      
    })
  }
  insertOrUpdate(form: NgForm) {
    debugger;
    this.dataService.PostData(this.insertOrUpdateAPI, this.FormData).subscribe(
      
      (res) => {
        this.toastr.success('Successfull', `${this.fromHeader} Information`);
       this.FormData = new PurchaseOrder();
       this.route.navigate([this.listRoute]);
       this.gridHandleService.selectedTab = "List";
      },
      (err) => {
        this.toastr.error('Please Try Again', 'Invalid Information!!');
        console.log(err);
      }
    );
  }
  onValueReceived(eventData: { value: any; fieldName?: any }) {
    this.FormData[eventData.fieldName] = eventData.value;

  }
  handleEvent(functionName: string, event: any) {
    if (typeof this[functionName] === 'function') {
      this[functionName](event); // Dynamically call the specified function
    } else {
      console.error(`Function ${functionName} is not defined`);
    }
  }
 updateGridData(option:any){

  const data = {
    id: option.id,
    purchaseOrderId: option.purchaseOrderId,
    productId: option.productId,
    actualQty: option.actualQty,
    unitPrice: option.unitPrice,
    subTotal: option.subTotal,
    name: option.productName,
    productCode: option.productCode,
    unitId:option.unitId,
    unitName:option.unitName,
    discount:option.discount,
    tax:option.tax,
    netTotal : option.netTotal,
    sellRate:option.sellRate,
    sellDiscount:option.sellDiscount,
    actualSellRate:option.actualSellRate
  };
  this.selectedItemList.push(data);
  this.FormData.purchasList.push(data);

 }
  
  selectProduct(option: any) {
    
    // Check if the product already exists in selectedItemList based on productId (option.id)
    const existingProduct = this.selectedItemList.find(item => item.productId === option.id);
    
    if (existingProduct) {
      this.toastr.error('Already Added','Duplicate!')
    } else {
      // Product doesn't exist, add it to the selectedItemList
      const data = {
        id: 0,
        purchaseOrderId: 0,
        productId: option.id,
        actualQty: 1,
        unitPrice: option.price,
        subTotal: option.price,
        name: option.name,
        productCode: option.productCode,
        unitId:option.unitId,
        unitName:option.unitName,
        discount:0,
        tax:0,
        netTotal : option.price,
        sellRate:option.price,
        sellDiscount:0,
        actualSellRate:option.price
      };
      this.selectedItemList.push(data);
      this.FormData.purchasList.push(data);
      this.totalAmountCalculate();
    }
  }
  
  totalAmountCalculate() {
    this.FormData.totalAmount = 0;
  this.FormData.totalDiscount = 0;
  this.FormData.actualAmount = 0;
  this.FormData.tax =0;
  this.FormData.purchasList.forEach((item: any) => {
    this.FormData.totalAmount += item.netTotal || 0;
    this.FormData.totalDiscount += item.discount || 0;
    this.FormData.tax += item.tax || 0;
  });

  }
  onCellValueChanged(event: any) {
    
    const updatedData = event.data;
    
    // Check if 'quantity' or 'unitPrice' has changed
    if (updatedData.actualQty || updatedData.unitPrice || updatedData.discount || updatedData.tax || updatedData.sellRate || updatedData.sellDiscount) {
      var exist = this.FormData.purchasList.find((x:any)=>x.productId == updatedData.productId);
      if(exist){
        exist.actualQty = updatedData.actualQty;
        exist.discount = updatedData.discount;
        exist.tax = updatedData.tax;
        exist.unitPrice = updatedData.unitPrice
        exist.subTotal = updatedData.actualQty * updatedData.unitPrice;
        exist.actualSellRate = updatedData.sellRate - updatedData.sellDiscount;
          // Calculate and update the 'totalPrice'
      updatedData.subTotal = updatedData.actualQty * updatedData.unitPrice;
      updatedData.netTotal = (exist.subTotal + updatedData.tax) -updatedData.discount;
      updatedData.actualSellRate = exist.actualSellRate;
      this.totalAmountCalculate();
      }
    }
  }
  onRowUpdated(event: any) {
    
    const updatedData = event.data;
    
    // Check if 'quantity' or 'unitPrice' has changed
    if (updatedData.actualQty || updatedData.unitPrice || updatedData.discount || updatedData.tax || updatedData.sellRate || updatedData.sellDiscount) {
      var exist = this.FormData.purchasList.find((x:any)=>x.productId == updatedData.productId);
      if(exist){
        exist.actualQty = updatedData.actualQty;
        exist.discount = updatedData.discount;
        exist.tax = updatedData.tax;
        exist.unitPrice = updatedData.unitPrice
        exist.subTotal = updatedData.actualQty * updatedData.unitPrice;
        exist.actualSellRate = updatedData.sellRate - updatedData.sellDiscount;
          // Calculate and update the 'totalPrice'
      updatedData.subTotal = updatedData.actualQty * updatedData.unitPrice;
      updatedData.netTotal = (exist.subTotal + updatedData.tax) -updatedData.discount;
      updatedData.actualSellRate = exist.actualSellRate;
      this.totalAmountCalculate();
      }
    
    }
    
    // You can refresh the grid if necessary (although DevExtreme usually handles this automatically)
    event.component.refresh();
    this.totalAmountCalculate();
  }


  filteredProducts() {
    if (!this.searchText) {
      return this.allProduct;
    }
    return this.allProduct.filter(option =>
      option.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
      option.productCode.toLowerCase().includes(this.searchText.toLowerCase()) 
    );
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
