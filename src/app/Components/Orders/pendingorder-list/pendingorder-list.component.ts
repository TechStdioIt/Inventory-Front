
import {Component, OnInit } from '@angular/core';
import {Router } from '@angular/router';
import { take } from 'rxjs';
import { GridHandlerService } from 'src/app/Services/GridHandler.service';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pendingorder-list',
  // standalone: true,
  templateUrl: './pendingorder-list.component.html',
  styleUrl: './pendingorder-list.component.scss',
  // imports: [CommonDataGridComponent],

})
export class PendingorderListComponent implements OnInit {
  fromHeader: string = 'Order';
  formRoute: string = '/orderForm';
  listAPI: string = 'SalesOrder/GetAllPendingData';
  deleteAPI: string = 'SalesOrder/DeleteOrder';
  haveQueryPram: boolean = false;
  pageSize: number = 10;
  pageSizes: number[] = [5, 10, 20, 50, 100];
  reloadCount: number = 0;
  tablename:string='Orders';

  userColumns = [
    { caption: 'ID', key: 'id', width: 50, isShow: false },
    { caption: 'So No', key: 'soNo' },
    { caption: 'Delivery Date', key: 'deliveryDate' },
    { caption: 'Pharmacy Name', key: 'pharmacyName' },
    { caption: 'Territory Name', key: 'territotyName' },
    { caption: 'Total Amount', key: 'totalOrder' },
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
    this.commonService.delete$.pipe(take(1)).subscribe(async (data: any) => {
      this.deleteAll(data,this.tablename);
    });
    this.commonService.approve$.pipe(take(1)).subscribe(async (data: any) => {
      this.approve(data,this.tablename);
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
  approve(selectedRecord: any,tablename?:string) {
      var data = {
        ids: selectedRecord,
        flag: 1,
        tableName: tablename
      };
      Swal.fire({
        title: 'Are you sure?',
        text: 'You want to approve selected record',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, approve it!',
        cancelButtonText: 'No, keep it'
      }).then((result) => {
        if (result.value) {
          this.dataService.PostData('SalesOrder/updateStatus',data).subscribe(
            (response: any) => {
              this.reloadCount++;
              Swal.fire('Done', 'Your record is Approved :)', 'success');
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
  
    deleteAll(selectedRecord: any,tablename?:string) {
      var data = {
        ids: selectedRecord,
        flag: 1,
        tableName: tablename
      };
      this.dataService.PostData('Administrator/MultipleDelete',data).subscribe(
        (response: any) => {
          this.reloadCount++;
          Swal.fire('Done', 'Your record is Deleted :)', 'success');
        },
        (error: any) => {
          console.error('Failed to get data:', error);
        }
      );
    }
  
}
