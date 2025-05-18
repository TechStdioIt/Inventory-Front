import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { StoreType } from 'src/app/Models/StoreType';
import { ActivatedRoute, Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { Location } from '@angular/common';
import { GridHandlerService } from 'src/app/Services/GridHandler.service';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-store-type-form',
  templateUrl: './store-type-form.component.html',
  styleUrl: './store-type-form.component.scss'
})
export class StoreTypeFormComponent implements OnInit,OnDestroy {
  text: string = '';
  exist: boolean = false;
  FormData: StoreType = new StoreType();
  isSubmitting: boolean = false;
  private destroy$ = new Subject<void>();
  constructor(
    private dataService: HttpClientConnectionService,
    // public service: FloorService,
    private toastr: ToastrService,
    private router:ActivatedRoute,
    private location:Location,
    public gridHandleService:GridHandlerService,
    private route:Router
  ) {
    this.router.queryParams.subscribe((data:any)=>{
      ;
      if(data.storeType !=undefined && data !=null){
        const bytes = CryptoJS.AES.decrypt(data.storeType, "values");
        var jsonData= bytes.toString(CryptoJS.enc.Utf8);
        this.FormData =JSON.parse(jsonData);
        //this.dateToday=this.commonService.LRPFormData.surveyDate;
      }else{
        this.FormData =new StoreType();
        //this.getLrpNo();
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
    ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  ngOnInit(): void {}

  onSubmit(form: NgForm) {
   this.insertRecord(form);
   
  }

  insertRecord(form: NgForm) {
    this.dataService.PostData('StoreType/CreateOrUpdateStore', this.FormData).subscribe(
      (res) => {
        //this.resetForm(form);
        this.toastr.success('Created Successfully', 'Floor Information');
                this.route.navigate(['/storetypeList']);
        if (res) {
        }
      },
      (err) => {
        this.toastr.error('Please Try Again', 'Invalid Information!!');

        console.log(err);
      }
    );
  }

 
 
  onDuplicate() {}
  onBack(){
    this.location.back();
  }
}


