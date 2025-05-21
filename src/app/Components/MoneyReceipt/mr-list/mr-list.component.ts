import {AfterViewInit, Component, OnInit } from '@angular/core';
import {Router } from '@angular/router';
import { take } from 'rxjs';
import { CommonService } from 'src/app/Services/common.service';
import { GridHandlerService } from 'src/app/Services/GridHandler.service';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mr-list',
  // standalone: true,
  templateUrl: './mr-list.component.html',
  styleUrl: './mr-list.component.scss',
  // imports: [CommonDataGridComponent],

})
export class MrListComponent implements OnInit, AfterViewInit {
  fromHeader: string = 'Approve Money Receipt List';
  formRoute: string = '/mrForm';
  listAPI: string = 'MoneyReceipt/GetAllMoneyReceipt';
  deleteAPI: string = 'MoneyReceipt/DeleteMoneyReceipt';
  haveQueryPram: boolean = false;
  pageSize: number = 10;
  

  userColumns = [
    { caption: 'ID', key: 'id', width: 50, isShow: false },
    { caption: 'Money Receipt No', key: 'moneyReceiptNo' },
    { caption: 'Payment Amount', key: 'paymentAmount' },
    { caption: 'Invoice No', key: 'invoiceNo' }
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
    
    print:{
      isShow: true,
      emit: (selectedRecord: any) => this.print(selectedRecord)
    }
  };

  constructor(
    private dataService: HttpClientConnectionService,
    private commonService: GridHandlerService,
    private router: Router,
    private common : CommonService
  ) {
    
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
  print(selectedRecord: any) {
    ;
    const url = this.router.createUrlTree(['/ReportViewer'], { 
      queryParams: { do: selectedRecord.id, reportName: 'rptMoneyReceipt' } 
  }).toString();
  
  window.open(url, '_blank');
  }
}
