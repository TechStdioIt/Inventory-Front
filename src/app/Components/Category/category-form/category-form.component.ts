import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/Models/Category';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';
import { Location } from '@angular/common';
import * as CryptoJS from 'crypto-js';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss'
})
export class CategoryFormComponent implements OnInit {
  text: string = '';
  exist: boolean = false;
  FormData: Category = new Category();

  constructor(
    private dataService: HttpClientConnectionService,
    // public service: FloorService,
    private toastr: ToastrService,
    private router:ActivatedRoute,
    private location:Location
  ) {
    this.router.queryParams.subscribe((data:any)=>{
      debugger;
      if(data.category !=undefined && data !=null){
        const bytes = CryptoJS.AES.decrypt(data.category, "values");
        var jsonData= bytes.toString(CryptoJS.enc.Utf8);
        this.FormData =JSON.parse(jsonData);
        //this.dateToday=this.commonService.LRPFormData.surveyDate;
      }else{
        this.FormData =new Category();
        //this.getLrpNo();
      }
    })
  }

  ngOnInit(): void {}

  onSubmit(form: NgForm) {
    if (this.FormData.id === 0) this.insertRecord(form);
    else this.updateRecord(form);
  }

  insertRecord(form: NgForm) {
    this.dataService.PostData('Category/CreateOrUpdate', this.FormData).subscribe(
      (res) => {
        this.resetForm(form);
        this.toastr.success('Created Successfully', 'Floor Information');
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
