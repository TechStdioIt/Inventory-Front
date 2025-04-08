import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Customer } from 'src/app/Models/Customer';
import { OrderDetailsVM, OrderVM } from 'src/app/Models/SalesInvoice';
import { CommonService } from 'src/app/Services/common.service';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';

@Component({
  selector: 'app-sales-form',
  templateUrl: './sales-form.component.html',
  styleUrl: './sales-form.component.scss'
})
export class SalesFormComponent implements OnInit {
  
  [key: string]: any;
  categoryList: any[] = [];
  productList: any[] = [];
  selectedProductList: any[] = [];
  isPopupVisible: boolean = false;
  FormData: any = new Customer();
  showOTPInputBox: boolean = false;


masterData:OrderVM=new OrderVM();


  formdata: any[] = [
    { type: 'text', name: 'name', label: 'Customer Name', required: true, column: 4 },
    { type: 'text', name: 'address', label: 'Customer Address', required: true, column: 4 },
    { type: 'text', name: 'phone', label: 'Mobile', required: true, column: 4 },
    { type: 'text', name: 'email', label: 'Email', required: true, column: 4 },
    { type: 'select', name: 'customerTypeId', label: 'Type of Customer', required: true, column: 4, options: [], optionValue: 'id', optionText: 'name' },
    { type: 'text', name: 'city', label: 'City', required: true, column: 4 },
    { type: 'number', name: 'cp', label: 'Customer CP', required: true, column: 4 },
    { type: 'text', name: 'zipCode', label: 'ZipCode', required: true, column: 4 },

  ];


  constructor(private dataService: HttpClientConnectionService, private commonService: CommonService, private toastr: ToastrService,private router:Router) { }
  ngOnInit(): void {
    this.GetAllCategory();
    this.onCategoryChange(0);
    this.commonService.getDropDownData(7).subscribe((data: any) => {
      this.formdata.find(field => field.name === 'customerTypeId').options = data
    })
  }
  GetAllCategory() {
    this.dataService.GetData('Category/GetAllCategory?take=1000&skip=0').subscribe((data: any) => {
      this.categoryList = data.data
    })
  }
  onCategoryChange(catId: any) {

    this.dataService.GetData(`Products/GetAllProductByCategoryId?catgoryId=${catId}`).subscribe((data: any) => {
      if (data) {
        this.productList = data.data;
      } else {
        this.productList = [];
      }

    })
  }
  onProductSelect(selectedProduct: any) {

    var checkExist = this.selectedProductList.find(x => x.purchaseDetailsId == selectedProduct.purchaseDetailsId);
    if (!checkExist) {
      var newProduct = {
        productName: selectedProduct.name,
        price: selectedProduct.actualSellRate,
        sellRate: selectedProduct.sellRate,
        qty: 1,
        productId: selectedProduct.id,
        productCode: selectedProduct.productCode,
        totalPrice: selectedProduct.sellRate,
        purchaseDetailsId: selectedProduct.purchaseDetailsId,
        sellDiscount: selectedProduct.sellDiscount,
        vat: selectedProduct.vat ?? 0
      };
      this.selectedProductList.push(newProduct);
      this.totalAmountCalculate();
    } else {
      this.updateQty(selectedProduct, 'add');
    }

  }

  totalAmountCalculate() {
    let subTotal = 0;
    let discountTotal = 0;
    let vatTotal = 0;

    this.selectedProductList.forEach((item: any) => {
      const qty = Number(item.qty) || 0;
      const price = Number(item.totalPrice) || 0;
      const discount = Number(item.sellDiscount) || 0;
      const vat = Number(item.vat) || 0;

      subTotal += price;
      discountTotal += qty * discount;
      vatTotal += qty * vat;
    });
debugger;
    this.masterData.subTotal = subTotal;
    this.masterData.discount = discountTotal;
    this.masterData.netTotal = this.masterData.subTotal - this.masterData.discount;
    this.masterData.vatAmount = this.calculateVatTotal(this.masterData.vatPercent,this.masterData.netTotal);
    this.masterData.grandTotal = this.masterData.netTotal + this.masterData.vatAmount ;
    this.masterData.payableAmount = this.masterData.grandTotal;
    this.masterData.givenAmount = this.masterData.grandTotal;
  }
  ShowCusAddPopUp() {
    this.isPopupVisible = !this.isPopupVisible;
  }

  calculateVatTotal(vat: any, netTotal: any) {
    return netTotal * (vat / 100);
  }


  updateQty(selectedProduct: any, action: string) {
    var checkExist = this.selectedProductList.find(x => x.purchaseDetailsId == selectedProduct.purchaseDetailsId);
    var checkApiData = this.productList.find(d => d.purchaseDetailsId == selectedProduct.purchaseDetailsId);
    if (checkApiData) {
      if (action == 'add') {
    
        if (checkExist.qty < checkApiData.avaiableQty) {
          if (checkExist) {
            checkExist.qty += 1;
            
  
          }
        
        } else {
          this.toastr.error('Not Allow ', 'Error !')
        }
      }
      else {
        if (checkExist.qty > 1) {
          checkExist.qty -= 1;
        }

      }
      checkExist.totalPrice = Number(checkExist.sellRate) * Number(checkExist.qty);
      this.totalAmountCalculate();
    }

  }

  onDeleteProdcut(purchaseDetailsId: any) {
    this.selectedProductList = this.selectedProductList.filter(x => x.purchaseDetailsId !== purchaseDetailsId);
    this.totalAmountCalculate();

  }

  onValueChangedAutoSelect(eventData: { value: any; fieldName?: any, text?: any, showField?: any, emiter?: any }) {
    this.masterData.customerId = eventData.value;
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

  timerCount: number = 0;
  timerInterval: any;

  onExtraDiscount(){
    if(this.masterData.extraDiscount <= this.masterData.grandTotal ){
      this.masterData.payableAmount = this.masterData.grandTotal - this.masterData.extraDiscount;
      this.masterData.givenAmount = this.masterData.payableAmount;
    }else{
      this.toastr.error("Not Allow",'Error!');
      this.masterData.extraDiscount =0;
      this.masterData.payableAmount  = this.masterData.grandTotal;
    }
    
  }
  SendOtpbtn() {
    this.showOTPInputBox = true;
    this.startTimer();
    // Logic to send OTP
  }
  backBtn() {
    this.showOTPInputBox = false;
  }
  resendOTP() {
    this.startTimer();
    // Logic to resend OTP
  }

  startTimer() {
    this.timerCount = 10;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    this.timerInterval = setInterval(() => {
      this.timerCount--;
      if (this.timerCount <= 0) {
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }

  submitBtn() {
    // Submit logic
    this.insertOrUpdate();
  }
  insertOrUpdate() {
    this.dataService.PostData('Customer/CreateOrUpdateCustomer', this.FormData).subscribe(
      (res) => {
        this.toastr.success('Successfull', `Customer Information`);
        this.FormData = new Customer();
        this.isPopupVisible = false;
        
      },
      (err) => {
        this.toastr.error('Please Try Again', 'Invalid Information!!');
        console.log(err);
      }
    );
  }
  onGivenAmount(){
    this.masterData.dynamicLabelAmount = this.masterData.givenAmount - this.masterData.payableAmount
    if(this.masterData.dynamicLabelAmount >= 0){
      this.masterData.dynamicLabel = 'Change'
    }else{
      this.masterData.dynamicLabel ='Due'
    }
  }


  onCharge(isPrint:boolean){
    this.SetUpData();
    this.dataService.PostData('SalesOrder/CreateOrUpdateOrder',this.masterData).subscribe(
      (res:any) => {
        this.toastr.success('Successfull', `Customer Information`);
        this.masterData = new OrderVM();
        if(isPrint){
          debugger;
          
          const newUrl = this.router.serializeUrl(
            this.router.createUrlTree(['/reports'], { queryParams: { reportName: 'rptDemo', do: res.data[0].OrderId,isPrint:isPrint } })
          );
          
          // Open in new tab or window
          window.open(newUrl, '_blank');
        }
    
        this.selectedProductList = [];
        
      },
      (err) => {
        this.toastr.error('Please Try Again', 'Invalid Information!!');
        console.log(err);
      }
    );

  }
  SetUpData(){
    var detailsList:OrderDetailsVM[] = [];
    this.selectedProductList.forEach(element => {
      var details = new OrderDetailsVM();
      details.orderQty = element.qty;
      details.purchaseDetailsId = element.purchaseDetailsId
      detailsList.push(details);
    });
    this.masterData.ordersList = detailsList;
  }
}
