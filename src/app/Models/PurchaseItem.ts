export class PurchaseItem {
    id: number = 0;
    purchaseOrderId: number = 0;
    productId: number = 0;
    unitId: number = 0;
    discount: number = 0;
    tax: number = 0;
    subTotal: number = 0;
    actualQty: number = 0;
    netTotal: number = 0;
    unitPrice: number = 0;
    availableQty: number = 0;
    sellRate:number=0;
    sellDiscount:number=0;
    actualSellRate:number=0;
}


export class PurchaseOrder {
    id: number =0;
    orderDate: Date = new Date();
    supplierId: number =0;
    totalAmount: number =0;
    shippingCost: number =0;
    tax: number =0;
    totalDiscount: number =0;
    paymentMethodId: number =0;
    purchasList: PurchaseItem[] =[];
}