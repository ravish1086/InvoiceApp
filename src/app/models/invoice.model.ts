import { CustomerModel } from "./customer.model";


export class Invoice{
    quantityInStock:number;
    productId:number;
    productName:string;
    hsn:string;
    taxRate:string;
    quantity;
    rate:string;
    amount:string;
    unit:string;
    description:string;
    sgst:string;
    cgst:string;
    Igst:string;
    taxableAmount;
    
}

export class GenerateInvoice
{
    invoiceNo:number;
    invoiceDate:string;
    placeOfSupply:string;
    reverseCharge:string;
    totalTax;
    totalTaxableValue;
    totalInvoiceValue;
    taxAmtsgstorcgst28;
    taxAmtsgstorcgst18;
    taxAmtsgstorcgst12;
    taxAmtsgstorcgst5;
    taxAmtIgst28;
    taxAmtIgst18;
    taxAmtIgst12;
    taxAmtIgst5;
    taxable28;
    taxable18;
    taxable12;
    taxable5;
    invoiceStatus;
    customer:CustomerModel;
    products:Invoice[];

}