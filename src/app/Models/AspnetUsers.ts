export class AspnetUsers{
    id: string = '';
    email: string = '';
    mobile: string = '';
    password: string = '';
    userFName: string = '';
    userLName: string = '';
    userName: string = '';
    userTypeId: number = 0;
    profileImageUrl?: string = '';
    userRoleId: string = '';
    businessMasterId: number = 0;
}


export class AspNetRole {
    id: string = "";
    name: string = "";
    normalizedName:string="";
    concurrencyStamp:string="";
    AspNetRoleClaims:[]=[];
    selected:boolean=true;

}