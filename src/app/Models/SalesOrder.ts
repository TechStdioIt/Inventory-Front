export class SalesOrder{
    id: number = 0;
    customerId: number = 0;
    totalOrder: number = 0;
    deliveryDate: Date = new Date();
    salesTypeId: number = 0;
    currencyId: number = 0;
    ordersList: OrderItem[] = [];
    actualAmount:number =0;
    discountAmount:number = 0
    orderStatusId:number = 0
    activityStatusId:number = 0


    
}

export class OrderItem {
    productId: number = 0;
    orderQty: number = 0;
  }