

import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { CommonService } from 'src/app/Services/common.service';
import { GridHandlerService } from 'src/app/Services/GridHandler.service';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-brand-list',
  templateUrl: './brand-list.component.html',
  styleUrl: './brand-list.component.scss'
})
export class BrandListComponent implements OnInit, AfterViewInit {
  fromHeader: string = 'Brand';
  formRoute: string = '/brandForm';
  listAPI: string = 'Brand/GetAll';
  deleteAPI: string = 'Brand/Delete';
  haveQueryPram: boolean = false;
  reloadCount: number = 0;
  idsValue:string =''
  SelectedMenuItems : any
  userColumns = [
    { caption: 'ID', key: 'id', width: 50, isShow: false },
    { caption: 'Name', key: 'name' },
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
    private common:CommonService,
    private activatedRoute:ActivatedRoute
  ) {
    this.commonService.edit$.pipe(take(1)).subscribe(async (data: any) => {
      this.edit(data);
    });
    this.commonService.details$.pipe(take(1)).subscribe(async (data: any) => {
      this.details(data);
    });
    this.activatedRoute.queryParams.subscribe(params => {
      this.idsValue= params['id'];
      var data = this.common.decrypt(this.idsValue,"menuPermissionData");
      this.SelectedMenuItems = JSON.parse(data);
      this.buttonShow.edit.isShow = this.SelectedMenuItems.isEdit
      this.buttonShow.viewDetails.isShow = this.SelectedMenuItems.isDetails
      this.buttonShow.delete.isShow = this.SelectedMenuItems.permissionDelete
    });
  }
  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    this.commonService.data$.subscribe((newData) => {
      this.edit(newData);
    });
  }

  edit(selectedRecord: any) {
    this.commonService.selectedTab = 'Form';
    this.router.navigate([this.formRoute], { queryParams: { do: selectedRecord.id,id:this.idsValue } });
  }
  details(selectedRecord: any) {
    this.commonService.selectedTab = 'Details';
    this.router.navigate([this.formRoute], { queryParams: { do: selectedRecord.id,id:this.idsValue } });
  }
  delete(selectedRecord: any) {
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
