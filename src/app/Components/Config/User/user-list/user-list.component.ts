import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GridCaption, GridDataShow, GridButtonShow, GridDataModel } from 'src/app/Models/GridModels';
import { GridHandlerService } from 'src/app/Services/GridHandler.service';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {



  dataList: any[] = [];

  constructor(
    private dataService:HttpClientConnectionService,
    private toastr:ToastrService,
    private gridHandlerService:GridHandlerService,
    private router:Router
  ) { }

   ngOnInit(): void {
  
     this.getData();
     this.gridHandlerService.edit$.subscribe(newData => {
      this.edit(newData);
    });
  
    }
    getData = () => {
      this.dataService.GetData("Menu/GetAllMenuList").subscribe((data:any)=>{
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
         this.gridHandlerService.caption.caption1="Menu Id";
         this.gridHandlerService.caption.caption2="Menu Name";
         this.gridHandlerService.caption.caption3="Parent Menu Name";
         this.gridHandlerService.caption.caption4="Menu Type";
         this.gridHandlerService.caption.caption5="Menu Url";
         this.gridHandlerService.caption.caption6="Menu Icon";    
        //PermitForShow or Not
        this.gridHandlerService.isShowData = new GridDataShow()
         this.gridHandlerService.isShowData.caption2=true;
         this.gridHandlerService.isShowData.caption3=true;
         this.gridHandlerService.isShowData.caption4=true;
         this.gridHandlerService.isShowData.caption5=true;
         this.gridHandlerService.isShowData.caption6=true;

  
  
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
          this.gridHandlerService.dataField.dataField2=item.menuName;
          this.gridHandlerService.dataField.dataField3=item.parentName;
          this.gridHandlerService.dataField.dataField4=item.type;
          this.gridHandlerService.dataField.dataField5=item.url;
          this.gridHandlerService.dataField.dataField6=item.icon;
    
      
    this.gridHandlerService.dataList.push(this.gridHandlerService.dataField);
    this.gridHandlerService.dataList=this.gridHandlerService.dataList.map((item,index)=>({ ...item,index:index+1}));
    
     }
    }
    
    edit(selectedRecord:any){
      this.gridHandlerService.selectedTab='Form';
      this.router.navigate(['/userForm'],{ queryParams: { menu: selectedRecord.row.data.dataField1} });
    }
    findSelectedItem(selectedItem:any){
    
     return this.dataList.find(x=>x.id === selectedItem);
    }
}
