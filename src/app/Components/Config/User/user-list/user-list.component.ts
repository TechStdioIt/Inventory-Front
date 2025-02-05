import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { GridCaption, GridDataShow, GridButtonShow, GridDataModel } from 'src/app/Models/GridModels';
import { CommonService } from 'src/app/Services/common.service';
import { GridHandlerService } from 'src/app/Services/GridHandler.service';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {

  fromHeader: string = 'User';
  formRoute: string = '/userForm';
  listAPI: string = 'Administrator/GetUserByBusinessId';
  deleteAPI: string = 'Administrator/DeleteUser';
  haveQueryPram: boolean = false;
  pageSize: number = 10;
  pageSizes: number[] = [5, 10, 20, 50, 100];
  reloadCount: number = 0;

  userColumns = [
    { caption: 'User Id', key: 'id', width: 50, isShow: false },
    { caption: 'User Full Name', key: 'companyName' },
    { caption: 'Email', key: 'email' },
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





  dataList: any[] = [];

  constructor(
    private dataService:HttpClientConnectionService,
    private toastr:ToastrService,
    private gridHandlerService:GridHandlerService,
    private commonService:CommonService,
    private router:Router
  ) {

    
        this.gridHandlerService.edit$.pipe(take(1)).subscribe(async (data: any) => {
          this.edit(data);
        });
        this.gridHandlerService.details$.pipe(take(1)).subscribe(async (data: any) => {
          this.details(data);
        });
   }

   ngOnInit(): void {
  
    this.gridHandlerService.data$.subscribe((newData) => {
      this.edit(newData);
    });

    }

edit(selectedRecord: any) {
    this.gridHandlerService.selectedTab = 'Form';
    this.router.navigate([this.formRoute], { queryParams: { do: selectedRecord.id } });
  }
  details(selectedRecord: any) {
    this.gridHandlerService.selectedTab = 'Details';
    this.router.navigate([this.formRoute], { queryParams: { do: selectedRecord.id } });
  }
  delete(selectedRecord: any) {
    debugger;
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



    getData = () => {
      this.dataService.GetData("Administrator/GetUserByBusinessId").subscribe((data:any)=>{
        debugger;
        this.dataList=data.data;
        this.sendDataCommonGrid();
      },
      (error:any)=>{
        this.toastr.error("failed to Get Data")
      }
      )
    }
  
  
    sendDataCommonGrid(){
      this.gridHandlerService.dataList=[];
      //Grid Caption 
      this.gridHandlerService.caption = new GridCaption();
         this.gridHandlerService.caption.caption1="User Id";
         this.gridHandlerService.caption.caption2="User Full Name";
         this.gridHandlerService.caption.caption3="Email";
         this.gridHandlerService.caption.caption4="Mobile";
         this.gridHandlerService.caption.caption5="Account Create Date";
         this.gridHandlerService.caption.caption6="Active";  
         this.gridHandlerService.caption.PictureCaption ='Profile Picture'  
        //PermitForShow or Not
        this.gridHandlerService.isShowData = new GridDataShow()
         this.gridHandlerService.isShowData.caption2=true;
         this.gridHandlerService.isShowData.caption3=true;
         this.gridHandlerService.isShowData.caption4=true;
         this.gridHandlerService.isShowData.caption5=true;
         this.gridHandlerService.isShowData.caption6=true;
      this.gridHandlerService.isShowData.isShowPicture = true;
  
  
         //Permit For Button Show or Not
         this.gridHandlerService.isShowButton =new GridButtonShow()
         this.gridHandlerService.isShowButton.button1=true //edit
         this.gridHandlerService.isShowButton.button2=true //delete
         this.gridHandlerService.isShowButton.button3=true
          this.gridHandlerService.isShowButton.button4=false;
        
         //Grid Data 
     for(let item of this.dataList){
        this.gridHandlerService.dataField = new GridDataModel();
          this.gridHandlerService.dataField.dataField1=item.id;
          this.gridHandlerService.dataField.dataField2=[item.userFName, item.userLName].filter(Boolean).join(" ");
          this.gridHandlerService.dataField.dataField3=item.email;
          this.gridHandlerService.dataField.dataField4=item.mobile;
          this.gridHandlerService.dataField.dataField5=this.commonService.formatDate(item.createdAt,'dd-MM-yyyy');
          this.gridHandlerService.dataField.dataField6=item.isActive;
          this.gridHandlerService.dataField.PictureField = item.ProfileImageUrl.result
    
      
    this.gridHandlerService.dataList.push(this.gridHandlerService.dataField);
    this.gridHandlerService.dataList=this.gridHandlerService.dataList.map((item,index)=>({ ...item,index:index+1}));
    
     }
    }
    
   
}
