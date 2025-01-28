import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { GridButtonShow, GridCaption, GridDataModel, GridDataShow } from '../Models/GridModels';

@Injectable({
  providedIn: 'root'
})
export class GridHandlerService {
  selectedTab:string="List";
  checkBoxSelectedData: any[] = [];
  isLoadPanelVisible:boolean=false;
  private dataSubject = new Subject<any>();
  data$ = this.dataSubject.asObservable();
  //this varible for add new records;
  private addNewSubject = new Subject<any>();
  addNewData$=this.addNewSubject.asObservable();
  private editSubject = new Subject<any>();
  edit$=this.editSubject.asObservable();

  isSearch:boolean=false;
  isPagger:boolean=false; 
  isButtonColumn:boolean=true;
  dataList:any[]=[];
  isShowData:GridDataShow=new GridDataShow();
  isShowButton:GridButtonShow = new GridButtonShow();
  dataField:GridDataModel=new GridDataModel();
  caption:GridCaption= new GridCaption();
  
  constructor() {
    this.edit=this.edit.bind(this);
    this.addPermission=this.addPermission.bind(this)
    this.details=this.details.bind(this);
    this.addNew = this.addNew.bind(this);
    
  }
  edit(selectedRecord:any){
    this.editSubject.next(selectedRecord);
  }
  delete() {
    this.dataSubject.next(this.checkBoxSelectedData);
  }
  addNew() {
    this.addNewSubject.next(NgForm);
  }

details(selectedRecord:any){
  this.dataSubject.next(selectedRecord);
}
  addPermission(selectedRecord :any){
    selectedRecord.column.command="permission";
    this.dataSubject.next(selectedRecord);
  }

}
