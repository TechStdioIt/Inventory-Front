import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { camelCase, mapKeys } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { Subject, take, takeUntil } from 'rxjs';
import { Role } from 'src/app/Models/Category';
import { GridHandlerService } from 'src/app/Services/GridHandler.service';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';

@Component({
  selector: 'app-role-create',
  templateUrl: './role-create.component.html',
  styleUrl: './role-create.component.scss'
})
export class RoleCreateComponent implements OnInit,OnDestroy {
  text: string = '';
  exist: boolean = false;
  FormData: Role = new Role();
  isSubmitting: boolean = false;
  private destroy$ = new Subject<void>();
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
      if(data.do !=undefined && data !=null){
       this.getDataById(data.do);
        
      }else{
        this.FormData =new Role();
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
  getDataById(id:any){
    this.dataService.GetData('Administrator/GetRoleById?id='+id).subscribe((data:any)=>{
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
