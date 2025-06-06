import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Suppliers } from 'src/app/Models/Suppliers';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';
import * as CryptoJS from 'crypto-js';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { camelCase, mapKeys } from 'lodash';
import { GridHandlerService } from 'src/app/Services/GridHandler.service';
import { Subject, take, takeUntil } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-bm-form',
  templateUrl: './bm-form.component.html',
  styleUrl: './bm-form.component.scss'
})
export class BmFormComponent implements OnInit,OnDestroy {
  [key: string]: any;
   @ViewChild('fileInput') fileInput!: ElementRef;
  text: string = '';
  fileData: string | ArrayBuffer | null = null; 
  fileName: string = ''; // Stores the name of the uploaded file
  exist: boolean = false;
  FormData: any = new Suppliers();
  isSubmitting: boolean = false;
  isDragging: boolean = false; // Toggles drag-and-drop styles
  fromHeader: string = 'Business Master';
  insertOrUpdateAPI: string = 'BusinessMaster/CreateOrUpdateBusinessMaster';
  getDataByIdAPI: string = 'BusinessMaster/GetByIdBusinessMaster';
  listRoute: string = '/bmList';
  selectedLogo?:File
  formdata: any[] = [
    { type: 'text', name: 'businessName', label: 'Business Name', required: true,column:4,placeHolder:"Enter Business Name"},
    { type: 'text', name: 'ownerName', label: 'Owner Name', required: true,column:4,placeHolder:"Enter Owner Name"},
    { type: 'text', name: 'email', label: 'Email', required: true,column:4,placeHolder:"Enter Email Address"},
    { type: 'number', name: 'totalBranch', label: 'Total Branch', required: true,column:4,placeHolder:"Enter Total Branch"},
    { type: 'text', name: 'contactNumber', label: 'Contact Number', required: true,column:4,placeHolder:"Enter Contact Number"},
    { type: 'text', name: 'address', label: 'Address', required: true,column:4,placeHolder:"Enter Address"}

  ];


  
  private destroy$ = new Subject<void>();
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
        this.FormData =new Suppliers();
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
      this.FormData = mapKeys(data.data.result, (_, key) => camelCase(key)) as Suppliers;
      this.fileData= data.data.logo.result;
    })
  }
  insertOrUpdate(form: NgForm) {
    var data =new FormData();
     ;
          data.append('businessName',this.FormData.businessName);
          data.append('id',this.FormData.id??0);
          data.append('ownerName',this.FormData.ownerName);
          data.append('email',this.FormData.email);
          data.append('totalBranch',this.FormData.totalBranch.toString());
          if (this.selectedLogo) {
            data.append('logoFile',this.selectedLogo);
          }
         data.append('address',this.FormData.address);
         data.append('contactNumber',this.FormData.contactNumber);
          // if (this.FormData.businessTypeDetails.length >0) {
          //   this.FormData.businessTypeDetails.forEach((detail:any, index:any) => {
          //     data.append(`businessTypeDetails[${index}].businessTypeId`, detail.businessTypeId.toString());
          //   });
          // }
          this.dataService.PostData('BusinessMaster/CreateOrUpdateBusinessMaster',data).subscribe((data:any)=>{
            ;
            this.route.navigate(['/bmList']);
          },
          (error:HttpErrorResponse)=>{
          })
  }
  removeFile(): void {
    this.fileData = null;
    this.fileName = '';
    this.selectedLogo= undefined;
  }
    // Handle file selection
    onFileSelected(event: Event): void {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        const file = input.files[0];
        this.fileName = file.name;
        this.selectedLogo = file;
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            this.fileData = e.target.result; // Store base64 image data
          }
        };
        reader.readAsDataURL(file);
      }
    }

  handleEvent(functionName: string, event: any) {
    if (typeof this[functionName] === 'function') {
      this[functionName](event); // Dynamically call the specified function
    } else {
      console.error(`Function ${functionName} is not defined`);
    }
  }
 // Handle drag over
 onDragOver(event: DragEvent): void {
  event.preventDefault();
  this.isDragging = true;
}

// Handle drag leave
onDragLeave(event: DragEvent): void {
  event.preventDefault();
  this.isDragging = false;
}

// Handle drop
onDrop(event: DragEvent): void {
  event.preventDefault();
  this.isDragging = false;

  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    const file = event.dataTransfer.files[0];
    this.fileName = file.name;
    this.selectedLogo = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        this.fileData = e.target.result; // Store base64 image data
      }
    };
    reader.readAsDataURL(file);
  }
}
triggerFileInput() {
  this.fileInput.nativeElement.click();
}
  

  
  
}
