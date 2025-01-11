import { Component } from '@angular/core';
import { CommonDataGridWithCheckBoxComponent } from "../../../../CommonComponents/CommonDataGridWithCheckBox/common-data-grid-with-check-box.component";
import { CommonDataGridComponent } from "../../../../CommonComponents/CommonDataGrid/common-data-grid.component";
import { ToastrService } from 'ngx-toastr';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';
import { IMSMenu } from 'src/app/Models/IMSMenu';
import { GridHandlerService } from 'src/app/Services/GridHandler.service';
import { Router } from '@angular/router';
import { GridButtonShow, GridCaption, GridDataModel, GridDataShow } from 'src/app/Models/GridModels';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrl: './menu-list.component.scss',
  

})
export class MenuListComponent {


  FormData: IMSMenu = new IMSMenu();
  dataList: IMSMenu[] = [];

  constructor(
    public menuListComponent:MenuListComponent,
    private dataService:HttpClientConnectionService,
    private toastr:ToastrService,
    private gridHandlerService:GridHandlerService,
    private router:Router
  ) { }

   ngOnInit(): void {
  
     this.getData();
     this.gridHandlerService.data$.subscribe(newData => {
      this.edit(newData);
    });
  
    }
    getData = () => {
      this.dataService.GetData("Menu/GetAllMenu").subscribe((data:any)=>{
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
         this.gridHandlerService.caption.caption1="Category Id";
         this.gridHandlerService.caption.caption2="Category Name";
    
        //PermitForShow or Not
        this.gridHandlerService.isShowData = new GridDataShow()
         this.gridHandlerService.isShowData.caption2=true;
  
  
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
          this.gridHandlerService.dataField.dataField2=item.name;
    
      
    this.gridHandlerService.dataList.push(this.gridHandlerService.dataField);
    this.gridHandlerService.dataList=this.gridHandlerService.dataList.map((item,index)=>({ ...item,index:index+1}));
    
     }
    }
    
    edit(selectedRecord:any){
      let data=this.findSelectedItem(selectedRecord.row.data.dataField1);
      if(data !=null || data !=undefined){
        this.gridHandlerService.selectedTab='Form';
          var jsonString=JSON.stringify(data);
          const encodeValue = CryptoJS.AES.encrypt(jsonString, "values").toString();
        this.router.navigate(['/categoryForm'],{ queryParams: { category: encodeValue } });
      }
    }
    findSelectedItem(selectedItem:any){
    
     return this.dataList.find(x=>x.id === selectedItem);
    }
}
