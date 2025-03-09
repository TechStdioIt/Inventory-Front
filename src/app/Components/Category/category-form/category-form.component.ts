import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/Models/Category';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';
import { Location } from '@angular/common';
import * as CryptoJS from 'crypto-js';
import { NgForm } from '@angular/forms';
import { GridHandlerService } from 'src/app/Services/GridHandler.service';
import { take } from 'rxjs';
@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss'
})
export class CategoryFormComponent implements OnInit {
  text: string = '';
  exist: boolean = false;
  FormData: Category = new Category();
  isSubmitting = false;
  constructor(
    private dataService: HttpClientConnectionService,
    // public service: FloorService,
    private toastr: ToastrService,
    private router:ActivatedRoute,
    private location:Location,
    private route:Router,
    private gridHandleService:GridHandlerService
  ) {
    this.router.queryParams.subscribe((data:any)=>{
      if(data.category !=undefined && data !=null){
        const bytes = CryptoJS.AES.decrypt(data.category, "values");
        var jsonData= bytes.toString(CryptoJS.enc.Utf8);
        this.FormData =JSON.parse(jsonData);
        //this.dateToday=this.commonService.LRPFormData.surveyDate;
      }else{
        this.FormData =new Category();
        //this.getLrpNo();
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
    if (this.FormData.id === 0) this.insertRecord(form);
    else this.updateRecord(form);
  }

  insertRecord(form: NgForm) {
    this.dataService.PostData('Category/CreateOrUpdate', this.FormData).subscribe(
      (res) => {
        this.toastr.success('Created Successfully', 'Floor Information');
        this.route.navigate(['/categoryList']);
        if (res) {
        }
      },
      (err) => {
        this.toastr.error('Please Try Again', 'Invalid Information!!');

        console.log(err);
      }
    );
  }

  updateRecord(form: NgForm) {
    this.dataService.PostData('Category/CreateOrUpdate',this.FormData).subscribe(
      (res) => {
        this.resetForm(form);
        this.route.navigate(['/categoryList']);
        this.toastr.info('Updated Successfully', 'Department Information');
      
        if (res) {
        }
      },
      (err) => {
        this.toastr.error('Please Try Again', 'Invalid Information!!');

        console.log(err);
      }
    );
  }
  resetForm(form: NgForm) {
    form.form.reset();
    this.FormData = new Category();
  }
  onDuplicate() {}
  onBack(){
    this.location.back();
  }
}
