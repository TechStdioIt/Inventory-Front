import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/Models/Category';
import { GridButtonShow, GridCaption, GridDataModel, GridDataShow } from 'src/app/Models/GridModels';
import { GridHandlerService } from 'src/app/Services/GridHandler.service';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';
import * as CryptoJS from 'crypto-js';
import { CommonService } from 'src/app/Services/common.service';
import { take } from 'rxjs';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss'
})
export class CategoryListComponent implements OnInit , AfterViewInit{
 fromHeader: string = 'Category';
  formRoute: string = '/customerForm';
  listAPI: string = 'Category/GetAllCategory';
  deleteAPI: string = 'Category/DeleteCategory';
  haveQueryPram: boolean = false;
  reloadCount: number = 0;
  
  userColumns = [
    { caption: 'ID', key: 'id', width: 50, isShow: false },
    { caption: 'Name', key: 'name' }
  ];

  buttonShow = {
    edit: {
      isShow: true,
      emit: (selectedRecord: any) => this.edit(selectedRecord)
    },
    viewDetails: {
      isShow: true,
      emit: (selectedRecord: any) => this.details(selectedRecord)
    },
    delete: {
      isShow: true,
      emit: (selectedRecord: any) => this.delete(selectedRecord)
    },
  };

  constructor(
    private dataService: HttpClientConnectionService,
    private commonService: GridHandlerService,
    private router: Router,
    private common : CommonService,
    private activatedRoute:ActivatedRoute
  ) {
    this.commonService.edit$.pipe(take(1)).subscribe(async (data: any) => {
      this.edit(data);
    });
    this.commonService.details$.pipe(take(1)).subscribe(async (data: any) => {
      this.details(data);
    });
    
  }
  
ngAfterViewInit(): void {
    this.common.getPermissionData(this.router.url.split('?')[0]).subscribe((data: any) => {
      this.buttonShow.edit.isShow = data.data.IsEdit
      this.buttonShow.viewDetails.isShow = data.data.IsDetails
      this.buttonShow.delete.isShow = data.data.IsDelete
    });
  }
  ngOnInit(): void {
    this.commonService.data$.subscribe((newData) => {
      this.edit(newData);
    });
  }

  edit(selectedRecord: any) {
    this.commonService.selectedTab = 'Form';
    this.router.navigate([this.formRoute], { queryParams: { do: selectedRecord.id } });
  }
  details(selectedRecord: any) {
    this.commonService.selectedTab = 'Details';
    this.router.navigate([this.formRoute], { queryParams: { do: selectedRecord.id } });
  }
  delete(selectedRecord: any) {
    ;
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete selected record',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.dataService.DeleteData(`${this.deleteAPI}?id=${selectedRecord.id}`).subscribe(
          (response: any) => {
            this.reloadCount++;
            Swal.fire('Done', 'Your record is Deleted :)', 'success');

          },
          (error: any) => {
            console.error('Failed to get data:', error);
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Your record is safe :)', 'error');
      }
    });
  }
}
