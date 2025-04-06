import { Component, OnInit } from '@angular/core';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';

@Component({
  selector: 'app-sales-form',
  templateUrl: './sales-form.component.html',
  styleUrl: './sales-form.component.scss'
})
export class SalesFormComponent implements OnInit{
  categoryList:any[]=[];
  productList:any[]=[];
  selectedProductList:any[]=[];
  productAmount:any =0;
  constructor(private dataService:HttpClientConnectionService){}
  ngOnInit(): void {
    this.GetAllCategory();
   this.onCategoryChange(0);
  }
  GetAllCategory(){
    this.dataService.GetData('Category/GetAllCategory?take=1000&skip=0').subscribe((data:any)=>{
      this.categoryList = data.data
    })
  }
  onCategoryChange(catId:any){

    this.dataService.GetData(`Products/GetAllProductByCategoryId?catgoryId=${catId}`).subscribe((data:any)=>{
      if(data){
        this.productList = data.data;
      }else{
        this.productList =[];
      }
      
    })
  }
  onProductSelect(selectedProduct:any){

    var checkExist = this.selectedProductList.find(x=>x.purchaseDetailsId == selectedProduct.purchaseDetailsId);
    if(!checkExist){
      var newProduct = {
        productName:selectedProduct.name,
        price:selectedProduct.actualSellRate,
        qty:1,
        productId:selectedProduct.id,
        productCode : selectedProduct.productCode,
        totalPrice:selectedProduct.actualSellRate,
        purchaseDetailsId:selectedProduct.purchaseDetailsId
      };
      this.selectedProductList.push(newProduct);
      this.totalAmountCalculate();
    }else{
      this.updateQty(selectedProduct,'add');
    }

  }

  totalAmountCalculate(){
    this.productAmount = this.selectedProductList.reduce((total: number, item: any) => {
      return total +  Number(item.totalPrice);
    }, 0);
  }


updateQty(selectedProduct:any,action:string){
  var checkExist = this.selectedProductList.find(x=>x.productId == selectedProduct.purchaseDetailsId);
  var checkApiData = this.productList.find(d=>d.purchaseDetailsId == selectedProduct.purchaseDetailsId)
  if(checkExist){
    if(action == 'add'){
      checkExist.qty += 1;
    
    }else{
      if(checkExist.qty > 1){
        checkExist.qty -= 1;
      }
      
    }
    checkExist.totalPrice=Number(checkExist.price) * Number(checkExist.qty);
    
  } 
  this.totalAmountCalculate();
}

onDeleteProdcut(purchaseDetailsId:any){
  this.selectedProductList = this.selectedProductList.filter(x => x.purchaseDetailsId !== purchaseDetailsId);

}

}
