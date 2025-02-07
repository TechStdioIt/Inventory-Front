import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { camelCase, mapKeys } from 'lodash';
import { GridHandlerService } from 'src/app/Services/GridHandler.service';
import { take } from 'rxjs';
import { Unit } from 'src/app/Models/Unit';
import { PurchaseOrder } from 'src/app/Models/PurchaseItem';
import { CommonService } from 'src/app/Services/common.service';
@Component({
  selector: 'app-purchase-order-form',
  templateUrl: './purchase-order-form.component.html',
  styleUrl: './purchase-order-form.component.scss'
})
export class PurchaseOrderFormComponent implements OnInit {
  [key: string]: any;
  text: string = '';
  exist: boolean = false;
  FormData: any = new PurchaseOrder();
  isSubmitting: boolean = false;
  fromHeader: string = 'Purchase Order';
  insertOrUpdateAPI: string = 'PurchasOrder/CreateOrUpdatePurchaseOrder';
  getDataByIdAPI: string = 'PurchasOrder/GetUnitById';
  listRoute: string = '/purchaseOrderList';
selectedItemList:any[]=[];
allProduct:any[]=[];
  formdata: any[] = [
    { type: 'select', name: 'supplierId', label: 'Supplier Name', required: true,column:4,options:[]},
    { type: 'number', name: 'shippingCost', label: 'Shipping Cost', required: true ,column:4},
    { type: 'select', name: 'paymentMethodId', label: 'Payment Method', required: true ,column:4,options:[]},
    
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
    this.gridHandleService.addNewData$.pipe(take(1)).subscribe(async (data: NgForm) => {
      if (!this.isSubmitting) {
        this.isSubmitting = true;
        try {
          await this.onSubmit(data); 
          this.gridHandleService.selectedTab = "List";
          
        } catch (error) {
          console.error('Error during submission:', error);
        } finally {
          this.isSubmitting = false; // Reset flag when the operation completes or fails
        }
      }
    });
  }
  ngOnInit(): void {
    this.getSupplierData();
    this.getPaymentMethod();
    this.getProductList();
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
      // this.FormData=data.data;
      this.FormData = mapKeys(data.data, (_, key) => camelCase(key)) as PurchaseOrder;
    })
  }
  insertOrUpdate(form: NgForm) {
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

  handleEvent(functionName: string, event: any) {
    if (typeof this[functionName] === 'function') {
      this[functionName](event); // Dynamically call the specified function
    } else {
      console.error(`Function ${functionName} is not defined`);
    }
  }
 
  
  selectProduct(option: any) {
    this.selectedItemList.push(option);
  }
}
