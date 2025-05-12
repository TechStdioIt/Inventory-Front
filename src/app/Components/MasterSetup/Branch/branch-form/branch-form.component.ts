import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { camelCase, mapKeys } from 'lodash';
import { GridHandlerService } from 'src/app/Services/GridHandler.service';
import { take } from 'rxjs';
import { Branch } from 'src/app/Models/Category';
import { CommonService } from 'src/app/Services/common.service';
@Component({
  selector: 'app-branch-form',
  templateUrl: './branch-form.component.html',
  styleUrl: './branch-form.component.scss'
})
export class BranchFormComponent implements OnInit {
  [key: string]: any;
  text: string = '';
  exist: boolean = false;
  FormData: any = new Branch();
  isSubmitting: boolean = false;
  fromHeader: string = 'Branch';
  insertOrUpdateAPI: string = 'Branch/CreateOrUpdateBranch';
  getDataByIdAPI: string = 'Branch/GetBranchById';
  listRoute: string = '/branchList';

  formdata: any[] = [
    { type: 'text', name: 'branchName', label: 'Branch Name', required: true,column:4},
    { type: 'text', name: 'contactNumber', label: 'Contact Number', required: true,column:4},
    { type: 'text', name: 'address', label: 'Address', required: false,column:4}
  ];
  constructor(
    private dataService: HttpClientConnectionService,
    private toastr: ToastrService,
    private router:ActivatedRoute,
    private route:Router,
    private location:Location,
    public gridHandleService:GridHandlerService,
    private common:CommonService
  ) {
    this.router.queryParams.subscribe((data:any)=>{
      if(data.do !=undefined && data !=null){
        this.getDataById(data.do);
      }else{
        this.FormData =new Branch();
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
      
      this.FormData = mapKeys(data.data, (_, key) => camelCase(key)) as Branch;
    })
  }
  insertOrUpdate(form: NgForm) {

    const isValid = this.common.validateFormData(this.formdata, this.FormData);
    if (isValid) {
          this.dataService.PostData(this.insertOrUpdateAPI, this.FormData).subscribe(
            (res) => {

              this.toastr.success('Successfull', `${this.fromHeader} Information`);
            this.FormData = new Branch();
            this.route.navigate([this.listRoute]);
            this.gridHandleService.selectedTab = "List";
            },
            (err) => {
              this.toastr.error(err.error.errorDetails, 'Invalid Information!!');
              console.log(err);
            }
          );
    }

    
  }

  handleEvent(functionName: string, event: any) {
    if (typeof this[functionName] === 'function') {
      this[functionName](event); // Dynamically call the specified function
    } else {
      console.error(`Function ${functionName} is not defined`);
    }
  }


  

  

  
  
}
