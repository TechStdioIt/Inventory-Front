import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GridButtonShow, GridCaption, GridDataModel, GridDataShow } from 'src/app/Models/GridModels';
import { Suppliers } from 'src/app/Models/Suppliers';
import { GridHandlerService } from 'src/app/Services/GridHandler.service';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';

@Component({
  selector: 'app-suppliers-list',
  templateUrl: './suppliers-list.component.html',
  styleUrl: './suppliers-list.component.scss'
})
export class SuppliersListComponent implements OnInit {
  dataList: any[] = [];

  ///routerData:any;

  constructor(
    // public service:FloorService,
    private dataService:HttpClientConnectionService,
    private toastr:ToastrService,
    private commonService:GridHandlerService,
    private route:ActivatedRoute,
    private router:Router
  ) { }

  ngOnInit(): void {

   this.getData();
   this.commonService.data$.subscribe(newData => {
    this.edit(newData);
  });

  }
  getData = () => {
    this.dataService.GetData("Suppliers/GetAllSuppliers").subscribe((data:any)=>{
      console.log(data.data);
      this.dataList=data.data;
      this.sendDataCommonGrid();
    },
    (error:any)=>{
      this.toastr.error("failed to Get Data")
    }
    )
  }


  sendDataCommonGrid(){
    this.commonService.dataList=[];
    //Grid Caption 
    this.commonService.caption = new GridCaption();
       this.commonService.caption.caption1="Suppliers ID";
       this.commonService.caption.caption2="Company Name";
       this.commonService.caption.caption3="Company ID";
  
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
        this.commonService.dataField.dataField2=item.companyName;
  
    
  this.commonService.dataList.push(this.commonService.dataField);
  this.commonService.dataList=this.commonService.dataList.map((item,index)=>({ ...item,index:index+1}));
  
   }
  }
  
  edit(selectedRecord:any){
    let data=this.findSelectedItem(selectedRecord.row.data.dataField1);
    if(data !=null || data !=undefined){
      this.commonService.selectedTab='Form';
        var jsonString=JSON.stringify(data);
        const encodeValue = CryptoJS.AES.encrypt(jsonString, "values").toString();
      this.router.navigate(['/suppliersForm'],{ queryParams: { suppliers: encodeValue } });
    }
  }
  findSelectedItem(selectedItem:any){
  
   return this.dataList.find(x=>x.id === selectedItem);
  }
}
