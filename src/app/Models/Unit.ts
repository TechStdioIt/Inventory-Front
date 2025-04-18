export class Unit{
    id:number= 0;
    name: string='';
    shortCode: string='';
    description: string='';
}


export class WareHouseVM {
    id: number = 0;
    userId: string = '';
    wareHouseName: string = '';
    openTime: Date = new Date();
    closeTime: Date = new Date();
    note: string = '';
    street: string = '';
    city: string = '';
    province: string = '';
    postalCode: string = '';
  }
  