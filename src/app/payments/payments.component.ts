import { Component, OnInit } from '@angular/core';
import { ReceivedPayments } from '../models/payments.model';
import { InvoiceService } from '../services/invoice.service';
import { OtherdataService } from '../services/otherdata.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {
  customerNameIndex;
  dateofReceipt=new Date();
  amountReceived;
  modeofPayment;
  paymentDetails;
  gst;
  paymentEntry= new ReceivedPayments();
  paymentHistory;
  invoiceHistory;
  customerList=[];
  filteredPaymentHistory;
  filteredInvoiceHistory;
  filterValue=""
  typeofpayments=["Cheque","Online","Cash","NA"];
  netPaymentReceived:number=0;
  netInvoiceAmount:number=0;
  lastFYBalance:number=0
  balanceRemaining:number=0;
  constructor(private dateservice:OtherdataService,private invoiceservice:InvoiceService) { }

  ngOnInit(): void {
    this.dateservice.getCustomerDetails().subscribe(res=>
      {
        this.customerList=res;
      })

      this.fetchPaymentDetails();
      this.fetchInvoiceDetails();
  }

  submitDetails()
  {
    let index=Number[this.customerNameIndex];
    console.log(this.customerNameIndex)
    this.gst=this.customerList[this.customerNameIndex].customerGst;
    this.paymentEntry.gst=this.gst
    this.paymentEntry.customerName=this.customerList[this.customerNameIndex].customerName;
    this.paymentEntry.dateofReceipt=new Date(this.dateofReceipt).toDateString()?new Date(this.dateofReceipt).toDateString():"";
    this.paymentEntry.amountReceived=this.amountReceived?this.amountReceived:0
    this.paymentEntry.modeofPayment=this.modeofPayment?this.modeofPayment:""
    this.paymentEntry.paymentDetails=this.paymentDetails?this.paymentDetails:""
    this.paymentEntry.lastFYBalance=this.lastFYBalance?this.lastFYBalance:null

    console.log(this.paymentEntry);

    this.dateservice.insertPaymentDetails(this.paymentEntry).subscribe(res=>
      {
        console.log(res);
        setTimeout(data=>
          {
            location.reload()
          },1000)
      })
  }

  fetchPaymentDetails()
  {
    this.dateservice.fetchPaymentDetails().subscribe(res=>
      {
        console.log(res);
        this.paymentHistory=res;
        this.filteredPaymentHistory=this.paymentHistory;
      })
  }
  fetchInvoiceDetails()
  {
    this.invoiceservice.getAllInvoicesDetails().subscribe(res=>
      {
        this.invoiceHistory=res;
        this.filteredInvoiceHistory=this.invoiceHistory;
      })
  }

  filterRecords(name)
  {
    let lastFYBalance=0
    console.log(name);
    this.filteredInvoiceHistory=[]
    this.filteredPaymentHistory=[]
    this.netPaymentReceived=0;
    this.netInvoiceAmount=0;
    this.balanceRemaining=0;

    for(let i=0;i<this.invoiceHistory.length;i++)
    {
      if(this.invoiceHistory[i].customer.customerName==name)
      {
        this.filteredInvoiceHistory.push(this.invoiceHistory[i]);
        this.netInvoiceAmount=this.netInvoiceAmount+Number(this.invoiceHistory[i].totalInvoiceValue.toFixed(0))
      }
    }
  
    for(let i=0;i<this.paymentHistory.length;i++)
    {
      if(this.paymentHistory[i].customerName==name)
      {
        this.filteredPaymentHistory.push(this.paymentHistory[i]);
        lastFYBalance?(lastFYBalance=lastFYBalance):(lastFYBalance=this.paymentHistory[i].lastFYBalance?this.paymentHistory[i].lastFYBalance:0)
        this.netPaymentReceived=this.netPaymentReceived+Number(this.paymentHistory[i].amountReceived);
      }
    }
      this.balanceRemaining=this.calculateBalance(this.netInvoiceAmount,this.netPaymentReceived,lastFYBalance);
  }

  calculateBalance(netinvoiceamt,netpaymentReceived,lastFYBalance)  {
    return (netinvoiceamt+lastFYBalance-netpaymentReceived);
  }
 
}
