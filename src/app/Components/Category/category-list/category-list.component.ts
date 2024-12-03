import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/Models/Category';
import { GridButtonShow, GridCaption, GridDataModel, GridDataShow } from 'src/app/Models/GridModels';
import { GridHandlerService } from 'src/app/Services/GridHandler.service';
import { HttpClientConnectionService } from 'src/app/Services/HttpClientConnection.service';
import * as CryptoJS from 'crypto-js';
@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss'
})
export class CategoryListComponent implements OnInit {
  dataList: Category[] = [];

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
    this.dataService.GetData("Category/GetAllCategory").subscribe((data:any)=>{
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
       this.commonService.caption.caption1="Category Id";
       this.commonService.caption.caption2="Category Name";
  
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
      this.commonService.selectedTab='Form';
        var jsonString=JSON.stringify(data);
        const encodeValue = CryptoJS.AES.encrypt(jsonString, "values").toString();
      this.router.navigate(['/categoryForm'],{ queryParams: { category: encodeValue } });
    }
  }
  findSelectedItem(selectedItem:any){
  
   return this.dataList.find(x=>x.id === selectedItem);
  }
}
