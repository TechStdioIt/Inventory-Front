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
import { Products } from 'src/app/Models/Products';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-products-form',
  templateUrl: './products-form.component.html',
  styleUrl: './products-form.component.scss'
})
export class ProductsFormComponent implements OnInit {
  [key: string]: any;
  text: string = '';
  exist: boolean = false;
  FormData: any = new Products();
  isSubmitting: boolean = false;
  fromHeader: string = 'Product';
  insertOrUpdateAPI: string = 'Products/CreateOrUpdate';
  getDataByIdAPI: string = 'Products/GetProductById';
  listRoute: string = '/productsList';

  formdata: any[] = [
    { type: 'text', name: 'name', label: 'Product Name', required: true,column:4},
    { type: 'select', name: 'categoryId', label: 'Short Name', required: true ,column:4},
    { type: 'text', name: 'description', label: 'Description', required: true ,column:4},
    { type: 'number', name: 'price', label: 'Price', required: true ,column:4},
    { type: 'number', name: 'quantityInStock', label: 'Stock In', required: true ,column:4},
    { type: 'select', name: 'unitId', label: 'Unit', required: true ,column:4},
    
  ];


  

  constructor(
    private dataService: HttpClientConnectionService,
    private toastr: ToastrService,
    private router:ActivatedRoute,
    private route:Router,
    private location:Location,
    public gridHandleService:GridHandlerService
  ) {
    this.router.queryParams.subscribe((data:any)=>{
      if(data.do !=undefined && data !=null){
        this.getDataById(data.do);
      }else{
        this.FormData =new Products();
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
    this.getUnitData();
  }
  onSubmit(form: NgForm) {
    this.insertOrUpdate(form);
  }
  getUnitData(){
    this.dataService.GetData('Unit/GetAllUnit?take=10&skip=0').subscribe((data:any)=>{

    },
    (error:HttpErrorResponse) =>{

    }
  )
  }
  getCategoryData(){
    this.dataService.GetData('Category/GetAllCategory?take=10&skip=0').subscribe((data:any)=>{

    },
    (error:HttpErrorResponse) =>{

    }
  )
  }
  getDataById(id:any){
    this.dataService.GetData(`${this.getDataByIdAPI}?id=`+id).subscribe((data:any)=>{
      // this.FormData=data.data;
      this.FormData = mapKeys(data.data, (_, key) => camelCase(key)) as Products;
    })
  }
  insertOrUpdate(form: NgForm) {
    this.dataService.PostData(this.insertOrUpdateAPI, this.FormData).subscribe(
      (res) => {
        this.toastr.success('Successfull', `${this.fromHeader} Information`);
       this.FormData = new Products();
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

  

  
  
}
