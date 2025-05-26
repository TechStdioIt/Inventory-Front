export class SalesInvoice {
    id?: number | null;
    dOId?: number | null;
    invoiceNo?: string | null;
    invoiceDate?: string | null;
    remarks?: string | null;
    userId?: string | null;
    isDelete?: boolean | null;
    isActive?: boolean | null;
    
  
    
  }
  



  export class OrderDetailsVM {
    orderId: number  = 0;
    purchaseDetailsId: number = 0;
    orderQty: number = 0;
    returnQty: number = 0;
    returnDate: Date = new Date();
    actualSellRate:number=0
  }
  
  export class OrderVM {
    id: number  = 0;
    subTotal: number  = 0;
    discount: number = 0;
    netTotal: number = 0;
    vatAmount: number  =0;
    vatPercent: number = 0;
    grandTotal: number = 0;
    extraDiscount: number  =0;
    deliveryCharge: number  =0;
    othersCost: number  =0;
    payableAmount: number  = 0;
    givenAmount: number  = 0;
    dynamicLabel: string  = 'Change'
    dynamicLabelAmount: number  = 0;
    customerId: number  = 0;
    isAdvance: boolean  = false;
    isDelivered: boolean  = true;
  
    ordersList: OrderDetailsVM[] = [];
  }
  