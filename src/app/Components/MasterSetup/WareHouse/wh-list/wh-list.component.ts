


import {Component, OnInit } from '@angular/core';
import {Router } from '@angular/router';
import { take } from 'rxjs';
import { GridHandlerService } from 'src/app/Services/GridHandler.service';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-wh-list',
  templateUrl: './wh-list.component.html',
  styleUrl: './wh-list.component.scss'
})
export class WhListComponent  implements OnInit {
  fromHeader: string = 'WareHouse';
  formRoute: string = '/wareHouseForm';
  listAPI: string = 'WareHouse/GetAllWareHouse';
  deleteAPI: string = 'WareHouse/DeleteWareHouse';
  haveQueryPram: boolean = false;
  pageSize: number = 10;
  pageSizes: number[] = [5, 10, 20, 50, 100];
  reloadCount: number = 0;

  userColumns = [
    { caption: 'ID', key: 'id', width: 50, isShow: false },
    { caption: 'Name', key: 'name' },
    { caption: 'Status', key: 'isActive' }
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
  ) {
    this.commonService.edit$.pipe(take(1)).subscribe(async (data: any) => {
      this.edit(data);
    });
    this.commonService.details$.pipe(take(1)).subscribe(async (data: any) => {
      this.details(data);
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
