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
  dateofReceipt;
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
  typeofpayments=["Cheque","Online","Cash"];
  netPaymentReceived:number=0;
  netInvoiceAmount:number=0;
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
    this.paymentEntry.dateofReceipt=new Date(this.dateofReceipt).toDateString();
    this.paymentEntry.amountReceived=this.amountReceived
    this.paymentEntry.modeofPayment=this.modeofPayment
    this.paymentEntry.paymentDetails=this.paymentDetails

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
        this.netInvoiceAmount=this.netInvoiceAmount+Number(this.invoiceHistory[i].totalInvoiceValue)
      }
    }
  
    for(let i=0;i<this.paymentHistory.length;i++)
    {
      if(this.paymentHistory[i].customerName==name)
      {
        this.filteredPaymentHistory.push(this.paymentHistory[i]);
        this.netPaymentReceived=this.netPaymentReceived+Number(this.paymentHistory[i].amountReceived);
      }
    }
      this.balanceRemaining=this.calculateBalance(this.netInvoiceAmount,this.netPaymentReceived);
  }

  calculateBalance(netinvoiceamt,netpaymentReceived)  {
    return (netinvoiceamt-netpaymentReceived);
  }
 
}
