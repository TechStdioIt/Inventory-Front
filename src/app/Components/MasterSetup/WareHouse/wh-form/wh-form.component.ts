
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { camelCase, mapKeys } from 'lodash';
import { GridHandlerService } from 'src/app/Services/GridHandler.service';
import { take } from 'rxjs';
import { WareHouseVM } from 'src/app/Models/Unit';
@Component({
  selector: 'app-wh-form',
  templateUrl: './wh-form.component.html',
  styleUrl: './wh-form.component.scss'
})
export class WhFormComponent implements OnInit {
  [key: string]: any;
  text: string = '';
  exist: boolean = false;
  FormData: any = new WareHouseVM();
  isSubmitting: boolean = false;
  fromHeader: string = 'Warehouse';
  insertOrUpdateAPI: string = 'WareHouse/CreateOrUpdateWareHouse';
  getDataByIdAPI: string = 'WareHouse/GetAllWareHouse';
  listRoute: string = '/wareHouseList';

  formdata: any[] = [
    { type: 'text', name: 'wareHouseName', label: 'WareHouse Name', required: true, column: 4 },
    { type: 'datetime', name: 'openTime', label: 'openTime', required: true, column: 4 },
    { type: 'datetime', name: 'closeTime', label: 'closeTime', required: true, column: 4 },
    { type: 'text', name: 'note', label: 'note', required: true, column: 4 },
    { type: 'text', name: 'street', label: 'street', required: true, column: 4 },
    { type: 'text', name: 'city', label: 'city', required: true, column: 4 },
    { type: 'text', name: 'province', label: 'province', required: true, column: 4 },
    { type: 'text', name: 'postalCode', label: 'postalCode', required: true, column: 4 },

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
        this.FormData =new WareHouseVM();
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
  ngOnInit(): void {}
  onSubmit(form: NgForm) {
    this.insertOrUpdate(form);
  }
  getDataById(id:any){
    this.dataService.GetData(`${this.getDataByIdAPI}?id=`+id).subscribe((data:any)=>{
      // this.FormData=data.data;
      this.FormData = mapKeys(data.data, (_, key) => camelCase(key)) as WareHouseVM;
    })
  }
  insertOrUpdate(form: NgForm) {
    this.dataService.PostData(this.insertOrUpdateAPI, this.FormData).subscribe(
      (res) => {
        this.toastr.success('Successfull', `${this.fromHeader} Information`);
       //this.FormData = new Unit();
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
