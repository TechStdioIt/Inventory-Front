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
    debugger;
    var checkExist = this.selectedProductList.find(x=>x.productId == selectedProduct.id);
    if(!checkExist){
      var newProduct = {
        productName:selectedProduct.name,
        price:selectedProduct.price,
        qty:1,
        productId:selectedProduct.id,
        productCode : selectedProduct.productCode,
        totalPrice:selectedProduct.price
      };
      this.selectedProductList.push(newProduct);
      this.totalAmountCalculate();
    }else{
      this.updateQty(selectedProduct.id,'add');
    }

  }

  totalAmountCalculate(){
    this.productAmount = this.selectedProductList.reduce((total: number, item: any) => {
      return total +  item.totalPrice;
    }, 0);
  }


updateQty(productId:any,action:string){
  var checkExist = this.selectedProductList.find(x=>x.productId == productId);
  if(checkExist){
    if(action == 'add'){
      checkExist.qty += 1;
    
    }else{
      if(checkExist.qty > 1){
        checkExist.qty -= 1;
      }
      
    }
    checkExist.totalPrice=checkExist.price * checkExist.qty
    
  }
  this.totalAmountCalculate();
}

onDeleteProdcut(productId:any){
  this.selectedProductList = this.selectedProductList.filter(x => x.productId !== productId);

}

}
