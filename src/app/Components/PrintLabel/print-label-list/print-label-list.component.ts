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
import { OrderVM } from 'src/app/Models/SalesInvoice';
@Component({
  selector: 'app-print-label-list',
  templateUrl: './print-label-list.component.html',
  styleUrl: './print-label-list.component.scss'
})
export class PrintLabelListComponent implements OnInit {
  [key: string]: any;
  text: string = '';
  exist: boolean = false;
  FormData: any = new Unit();
  isSubmitting: boolean = false;
  fromHeader: string = 'Brand';
  insertOrUpdateAPI: string = 'Brand/CreateOrUpdate';
  getDataByIdAPI: string = 'Brand/GetById';
  listRoute: string = '/brandList';

  masterData:OrderVM=new OrderVM();

  formdata: any[] = [
    { type: 'text', name: 'name', label: 'Qunatity', required: true,column:4},
    { type: 'select', name: 'warehouseId', label: 'Warehouse', required: true, column: 4, options: [] },
    
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
        this.FormData =new Unit();
      }
    });
    this.gridHandleService.add$.pipe(take(1)).subscribe(async (data: NgForm) => {
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

    this.getwarehouse();
  }
  onSubmit(form: NgForm) {
    this.insertOrUpdate(form);
  }
  getwarehouse() {
    return this.dataService.GetData('WareHouse/GetAllWareHouse?take=1000&skip=0').subscribe((data: any) => {
      ;
      this.formdata.find(field => field.name === 'warehouseId').options = data.data;
    })
  }
  onValueChangedAutoSelect(eventData: { value: any; fieldName?: any, text?: any, showField?: any, emiter?: any }) {
    this.masterData.customerId = eventData.value;
  }


  getDataById(id:any){
    this.dataService.GetData(`${this.getDataByIdAPI}?id=`+id).subscribe((data:any)=>{
      // this.FormData=data.data;
      this.FormData = mapKeys(data.data, (_, key) => camelCase(key)) as Unit;
    })
  }
  insertOrUpdate(form: NgForm) {
    this.dataService.PostData(this.insertOrUpdateAPI, this.FormData).subscribe(
      (res) => {
        this.toastr.success('Successfull', `${this.fromHeader} Information`);
       this.FormData = new Unit();
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

