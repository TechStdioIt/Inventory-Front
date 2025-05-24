import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { camelCase, mapKeys } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { Routers } from 'src/app/Models/Routers';
import { GridHandlerService } from 'src/app/Services/GridHandler.service';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';

@Component({
  selector: 'app-routerform',
  templateUrl: './routerform.component.html',
  styleUrl: './routerform.component.scss'
})
export class RouterformComponent implements OnInit{
 [key: string]: any;
  text: string = '';
  exist: boolean = false;
  FormData: any = new Routers();
  isSubmitting: boolean = false;
  fromHeader: string = 'Router';
  insertOrUpdateAPI: string = 'Mikrotik/CreateMikrotikRouter';
  getDataByIdAPI: string = 'Suppliers/GetSuppliersById';
  listRoute: string = '/routerList';

  formdata: any[] = [
    { type: 'text', name: 'name', label: 'Router Name', required: true,column:4,placeHolder:"Enter Router Name"},
    { type: 'text', name: 'ipAddress', label: 'Ip Address', required: true ,column:4},
    { type: 'text', name: 'apiPort', label: 'Api Port', required: true ,column:4},
    { type: 'text', name: 'username', label: 'Username', required: true,column:4},
    { type: 'text', name: 'passwordEnc', label: 'Password', required: true ,column:4 },
    { type: 'text', name: 'routerLocation', label: 'Router Location', required: true,column:4 },
    { type: 'text', name: 'comment', label: 'Comment', required: true,column:4 },
    
  ];


  
  private destroy$ = new Subject<void>();
  constructor(
    private dataService: HttpClientConnectionService,

    private toastr: ToastrService,
    private router:ActivatedRoute,
    private route:Router,
    public gridHandleService:GridHandlerService
  ) {
    this.router.queryParams.subscribe((data:any)=>{
      if(data.do !=undefined && data !=null){
        this.getDataById(data.do);
      }else{
        this.FormData =new Routers();
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
    this.insertOrUpdate(form);
  }
  getDataById(id:any){
    this.dataService.GetData(`${this.getDataByIdAPI}?id=`+id).subscribe((data:any)=>{
      ;
      // this.FormData=data.data;
      this.FormData = mapKeys(data.data, (_, key) => camelCase(key)) as Routers;
    })
  }
  insertOrUpdate(form: NgForm) {
    this.dataService.PostData(this.insertOrUpdateAPI, this.FormData).subscribe(
      (res) => {
        this.toastr.success('Successfull', `${this.fromHeader} Information`);
       this.FormData = new Routers();
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
