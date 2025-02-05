export class Category {
    id: number=0;
    name: string='';
  }

  export class Login{
    userName:string ='';
    password :string ='';
    rememberMe:boolean = false;
  }
  export class Role {
    id: string='';
    name: string ='';
}



export class BusinessTypeDetail {
  businessTypeId: number=0;
}


export class BusinessVM {
  id: number=0;
  businessName: string='';
  ownerName: string='';
  email: string='';
  totalBranch: number=1;
  packegeMasterId: number=0;
  userId: string='';
  isActive: boolean=false;
  contactNumber: string='';
  address: string='';
  logo: string='';
  businessTypeDetails: BusinessTypeDetail[]=[]; // Array of related BusinessTypeDetail
}
