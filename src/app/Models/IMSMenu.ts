export class IMSMenu {
    id:number=0;
    name:string="";
    description:string="";
    active:boolean=true;
    menuUrl:string="";
    menuPriority:any;
    menuOrder:any;
    parentId:any=null;
    updatedBy:string="";
    updatedAt:Date=new Date();
    createdBy:string | null="";
    createdAt:Date=new Date();
    isDeleted:boolean=false;
    menuIcon:string=""; 
    expandable:boolean=false;
    isAuthenticated :boolean=false;
    isView:boolean=false;
}