import { Component, OnInit } from '@angular/core';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { StoreType } from 'src/app/Models/StoreType';
import { ActivatedRoute } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { Location } from '@angular/common';
@Component({
  selector: 'app-store-type-form',
  templateUrl: './store-type-form.component.html',
  styleUrl: './store-type-form.component.scss'
})
export class StoreTypeFormComponent implements OnInit {
  text: string = '';
  exist: boolean = false;
  FormData: StoreType = new StoreType();

  constructor(
    private dataService: HttpClientConnectionService,
    // public service: FloorService,
    private toastr: ToastrService,
    private router:ActivatedRoute,
    private location:Location
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
    })
  }

  ngOnInit(): void {}

  onSubmit(form: NgForm) {
    if (this.FormData.id === 0) this.insertRecord(form);
    else this.updateRecord(form);
  }

  insertRecord(form: NgForm) {
    this.dataService.PostData('StoreType/CreateOrUpdateStore', this.FormData).subscribe(
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
    this.dataService.PostData('StoreType/CreateOrUpdateStore',this.FormData).subscribe(
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
    this.FormData = new StoreType();
  }
  onDuplicate() {}
  onBack(){
    this.location.back();
  }
}
