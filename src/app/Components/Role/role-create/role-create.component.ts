import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { camelCase, mapKeys } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Role } from 'src/app/Models/Category';
import { GridHandlerService } from 'src/app/Services/GridHandler.service';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';

@Component({
  selector: 'app-role-create',
  templateUrl: './role-create.component.html',
  styleUrl: './role-create.component.scss'
})
export class RoleCreateComponent implements OnInit {
  text: string = '';
  exist: boolean = false;
  FormData: Role = new Role();
  isSubmitting: boolean = false;

  constructor(
    private dataService: HttpClientConnectionService,
    // public service: FloorService,
    private toastr: ToastrService,
    private router:ActivatedRoute,
    private location:Location,
    private route:Router,
    public gridHandleService:GridHandlerService
  ) {
    this.router.queryParams.subscribe((data:any)=>{
      if(data.role !=undefined && data !=null){
       this.getDataById(data.role);
        
      }else{
        this.FormData =new Role();
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
  getDataById(id:any){
    this.dataService.GetData('Menu/GetRollById?id='+id).subscribe((data:any)=>{
      // this.FormData=data.data;
      this.FormData = mapKeys(data.data, (_, key) => camelCase(key)) as Role;
    })
  }
  ngOnInit(): void {}

  onSubmit(form: NgForm) {
    if (this.FormData.id === '') this.insertRecord(form);
    else this.updateRecord(form);
  }

  insertRecord(form: NgForm) {

    this.dataService.PostData('Administrator/CreateRole', this.FormData).subscribe(
      (res) => {
        this.toastr.success('Created Successfully', 'Role Information');
       this.FormData = new Role();
       this.route.navigate(['/roleList']);
       this.gridHandleService.selectedTab = "List";
      },
      (err) => {
        this.toastr.error('Please Try Again', 'Invalid Information!!');

        console.log(err);
      }
    );
  }

  updateRecord(form: NgForm) {
    this.dataService.PutData('Administrator/EditRole',this.FormData.id,this.FormData).subscribe(
      (res) => {
        this.FormData = new Role();
       this.route.navigate(['/roleList']);
       this.gridHandleService.selectedTab = "List";
        this.toastr.info('Updated Successfully', 'Role Information');
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
    this.FormData = new Role();
  }
  onDuplicate() {}
  onBack(){
    this.location.back();
  }
}
