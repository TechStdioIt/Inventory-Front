import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GridButtonShow, GridCaption, GridDataModel, GridDataShow } from 'src/app/Models/GridModels';
import { GridHandlerService } from 'src/app/Services/GridHandler.service';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.scss'
})
export class RoleListComponent implements OnInit {
  dataList: any[] = [];

  ///routerData:any;

  constructor(
    // public service:FloorService,
    private dataService:HttpClientConnectionService,
    private toastr:ToastrService,
    private commonService:GridHandlerService,
    private route:ActivatedRoute) { }

  ngOnInit(): void {

   this.getData();
   this.commonService.data$.subscribe(newData => {
    this.edit(newData);
  });

  }
  getData = () => {
    this.dataService.GetData("Role/GetAllRole").subscribe((data:any)=>{
      this.dataList=data;
      this.sendDataCommonGrid();
    },
    (error:any)=>{
      console.log(error);
      this.toastr.error("failed to Get Data")
    }
    )
  }


  sendDataCommonGrid(){
    this.commonService.dataList=[];
    //Grid Caption 
    this.commonService.caption = new GridCaption();
       this.commonService.caption.caption1="Role Id";
       this.commonService.caption.caption2="Role Name";
  
      //PermitForShow or Not
      this.commonService.isShowData = new GridDataShow()
       this.commonService.isShowData.caption2=true;


       //Permit For Button Show or Not
       this.commonService.isShowButton =new GridButtonShow()
       this.commonService.isShowButton.button1=true //edit
       this.commonService.isShowButton.button2=true //delete
       this.commonService.isShowButton.button3=true
        this.commonService.isShowButton.button4=false;
      
       //Grid Data 
   for(let item of this.dataList){
        this.commonService.dataField = new GridDataModel();
        this.commonService.dataField.dataField1=item.id;
        this.commonService.dataField.dataField2=item.name;
  
    
  this.commonService.dataList.push(this.commonService.dataField);
  this.commonService.dataList=this.commonService.dataList.map((item,index)=>({ ...item,index:index+1}));
  
   }
  }
  
  edit(selectedRecord:any){
    let data=this.findSelectedItem(selectedRecord.row.data.dataField1);
    if(data !=null || data !=undefined){
    }
  }
  findSelectedItem(selectedItem:any){
  
   return this.dataList.find(x=>x.id === selectedItem);
  }
}
