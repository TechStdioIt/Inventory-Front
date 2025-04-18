import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { camelCase, mapKeys } from 'lodash';
import { GridHandlerService } from 'src/app/Services/GridHandler.service';
import { Observable, take } from 'rxjs';
import { Unit } from 'src/app/Models/Unit';
import { Products } from 'src/app/Models/Products';
import { HttpErrorResponse } from '@angular/common/http';



@Component({
  selector: 'app-products-form',
  templateUrl: './products-form.component.html',
  styleUrl: './products-form.component.scss'
})
export class ProductsFormComponent implements OnInit {
  [key: string]: any;
  text: string = '';
  exist: boolean = false;
  FormData: any = new Products();
  isSubmitting: boolean = false;
  fromHeader: string = 'Product';
  insertOrUpdateAPI: string = 'Products/CreateOrUpdate';
  getDataByIdAPI: string = 'Products/GetProductById';
  listRoute: string = '/productsList';
  @ViewChild('fileInput') fileInput!: ElementRef;
  isDragging: boolean = false; // Toggles drag-and-drop styles
  selectedLogo?: File
  fileData: string | ArrayBuffer | null = null;
  fileName: string = '';
  formdata: any[] = [
    { type: 'text', name: 'name', label: 'Product Name', required: true, column: 4 },
    { type: 'select', name: 'categoryId', label: 'Category', required: true, column: 4, options: [] },
    { type: 'select', name: 'brandId', label: 'Brand', required: true, column: 4, options: [] },
    { type: 'text', name: 'description', label: 'Description', required: true, column: 4 },
    { type: 'number', name: 'price', label: 'Price', required: true, column: 4 },
    // { type: 'number', name: 'quantityInStock', label: 'Stock In', required: true, column: 4 },
    { type: 'select', name: 'unitId', label: 'Unit', required: true, column: 4, options: [] },

  ];

  unitData: any[] = [];




  constructor(
    private dataService: HttpClientConnectionService,
    private toastr: ToastrService,
    private router: ActivatedRoute,
    private route: Router,
    private location: Location,
    public gridHandleService: GridHandlerService
  ) {
    this.router.queryParams.subscribe((data: any) => {
      if (data.do != undefined && data != null) {
        this.getDataById(data.do);
      } else {
        this.FormData = new Products();
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
  ngOnInit(): void {
    this.getUnitData();
    this.getCategoryData();
    this.getBrandData();
  }
  onSubmit(form: NgForm) {
    this.insertOrUpdate(form);
  }



  getUnitData() {
    return this.dataService.GetData('Unit/GetAllUnit?take=1000&skip=0').subscribe((data: any) => {
      this.formdata.find(field => field.name === 'unitId').options = data.data;
    })
  }
  getCategoryData() {
    return this.dataService.GetData('Category/GetAllCategory?take=1000&skip=0').subscribe((data: any) => {
      ;
      this.formdata.find(field => field.name === 'categoryId').options = data.data;
    })
  }
  getBrandData() {
    return this.dataService.GetData('Brand/GetAll?take=1000&skip=0').subscribe((data: any) => {
      ;
      this.formdata.find(field => field.name === 'brandId').options = data.data;
    })
  }


  getDataById(id: any) {
    this.dataService.GetData(`${this.getDataByIdAPI}?id=` + id).subscribe((data: any) => {
      // this.FormData=data.data;
      this.FormData = mapKeys(data.data, (_, key) => camelCase(key)) as Products;
      ;
      this.fileData = data.data.imageUrl.result;
    })
  }
  insertOrUpdate(form: NgForm) {
    var data = new FormData();
    data.append('id', this.FormData.id.toString());
    data.append('name', this.FormData.name);
    data.append('description', this.FormData.description);
    data.append('categoryId', this.FormData.categoryId.toString());
    data.append('price', this.FormData.price.toString());
    data.append('quantityInStock', this.FormData.quantityInStock.toString());
    data.append('unitId', this.FormData.unitId.toString());
    data.append('isActive',this.FormData.isActive.toString())
    if (this.selectedLogo) {
      data.append('imageFile', this.selectedLogo);
    }
    this.dataService.PostData(this.insertOrUpdateAPI, data).subscribe(
      (res) => {
        this.toastr.success('Successfull', `${this.fromHeader} Information`);
        this.FormData = new Products();
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
  removeFile(): void {
    this.fileData = null;
    this.fileName = '';
    this.selectedLogo = undefined;
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
  onChange() {
    this.FormData.isActive = !this.FormData.isActive
  }

}
