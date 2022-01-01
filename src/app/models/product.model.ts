export class ProductDetails{
    inStock:number;
    id:number;
    productName:string;
    productHsn:string;
    productPrice:string;
    productTaxRate:string;
    productUnit:string;
}

export class ProductInvoice{
   
    productName:string;
    productHsn:string;
    productPrice:string;
    productTaxRate:string;
    productUnit:string;
    productQuantity;
    productSgst:string;
    productCgst:string;
    productIgst:string;
    productTaxableAmount;
    productTotalAmount:string;
}