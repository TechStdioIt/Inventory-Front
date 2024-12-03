import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Suppliers } from 'src/app/Models/Suppliers';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';
import * as CryptoJS from 'crypto-js';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-suppliers-form',
  templateUrl: './suppliers-form.component.html',
  styleUrl: './suppliers-form.component.scss'
})
export class SuppliersFormComponent implements OnInit {
  text: string = '';
  exist: boolean = false;
  FormData: Suppliers = new Suppliers();

  constructor(
    private dataService: HttpClientConnectionService,
    // public service: FloorService,
    private toastr: ToastrService,
    private router:ActivatedRoute,
    private location:Location
  ) {
    this.router.queryParams.subscribe((data:any)=>{
      if(data.suppliers !=undefined && data !=null){
        const bytes = CryptoJS.AES.decrypt(data.suppliers, "values");
        var jsonData= bytes.toString(CryptoJS.enc.Utf8);
        this.FormData =JSON.parse(jsonData);
        //this.dateToday=this.commonService.LRPFormData.surveyDate;
      }else{
        this.FormData =new Suppliers();
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
    this.dataService.PostData('Suppliers/CreateOrUpdate', this.FormData).subscribe(
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
    this.dataService.PostData('Suppliers/CreateOrUpdate',this.FormData).subscribe(
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
    this.FormData = new Suppliers();
  }
  onDuplicate() {}
  onBack(){
    this.location.back();
  }
}
