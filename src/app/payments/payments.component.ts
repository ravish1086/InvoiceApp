import { Component, OnInit, Renderer2 } from '@angular/core';
import { ReceivedPayments } from '../models/payments.model';
import { InvoiceService } from '../services/invoice.service';
import { OtherdataService } from '../services/otherdata.service';
import { forkJoin } from 'rxjs';

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
  filterValue="all"
  typeofpayments=["Cheque","Online","Cash","NA"];
  netPaymentReceived:number=0;
  netInvoiceAmount:number=0;
  lastFYBalance:number=0
  balanceRemaining:number=0;
  paymentInvoiceCombined: any;
  splitView=true
  simpleReport=[]
  viewButtonLabel='Show Simplifield Report'
  constructor(private dateservice:OtherdataService,private invoiceservice:InvoiceService, private renderer:Renderer2) { }

  ngOnInit(): void {
    this.dateservice.getCustomerDetails().subscribe(res=>
      {
        this.customerList=res;
      })
      let $obspaymentdetails =  this.dateservice.fetchPaymentDetails();
      let $obsinvoicedetails =  this.invoiceservice.getAllInvoicesDetails();
      forkJoin([$obsinvoicedetails,$obspaymentdetails]).subscribe({
        next : (data)=>{
          this.invoiceHistory=data[0];
        this.filteredInvoiceHistory=data[0];
          this.paymentHistory=data[1];
        this.filteredPaymentHistory=data[1];
        this.filterRecords("all")
        }
      })
      // this.fetchPaymentDetails();
      // this.fetchInvoiceDetails();
  }
  toggleReportView()
  {
    this.splitView=!this.splitView;
    if(this.splitView)
    {
      this.viewButtonLabel = 'Show Simplifield Report'
    }
    else{
      this.viewButtonLabel = 'Show Split Report View'
    }
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

    if(this.paymentEntry.lastFYBalance){
      this.paymentEntry.dateofReceipt = new Date("04-01-2023").toDateString();
    }

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
    this.simpleReport=[]
    let lastFYBalance=0
    console.log(name);
    this.filteredInvoiceHistory=[]
    this.filteredPaymentHistory=[]
    this.netPaymentReceived=0;
    this.netInvoiceAmount=0;
    this.balanceRemaining=0;

    for(let i=0;i<this.invoiceHistory.length;i++)
    {
      if(this.invoiceHistory[i].customer.customerName==name || name == "all")
      {
        this.filteredInvoiceHistory.push(this.invoiceHistory[i]);
        this.netInvoiceAmount=this.netInvoiceAmount+Number(this.invoiceHistory[i].totalInvoiceValue.toFixed(0))
      }
    }
  
    for(let i=0;i<this.paymentHistory.length;i++)
    {
      if(this.paymentHistory[i].customerName==name || name == "all")
      {
        this.filteredPaymentHistory.push(this.paymentHistory[i]);
        lastFYBalance?(lastFYBalance=lastFYBalance):(lastFYBalance=this.paymentHistory[i].lastFYBalance?this.paymentHistory[i].lastFYBalance:0)
        this.netPaymentReceived=this.netPaymentReceived+Number(this.paymentHistory[i].amountReceived);
      }
    }

      this.paymentInvoiceCombined=this.filteredInvoiceHistory.concat(...this.filteredPaymentHistory);
      console.log(this.paymentInvoiceCombined)
      let simplifiedData=[]
    
      this.paymentInvoiceCombined.forEach(obj => {
        let tempObj={}
        if(obj.lastFYBalance>0)
        {
          tempObj['firmName']=obj.customerName
          tempObj['lastFy']=obj.lastFYBalance
          simplifiedData.unshift(tempObj)
        }
        else if(obj.invoiceDate)
          {
             tempObj['firmName']= obj.customer.customerName
             tempObj['date']=obj.invoiceDate
             tempObj['invoiceValue']=obj.totalInvoiceValue
             tempObj['invoiceNumber']=obj.invoiceNo
             simplifiedData.push(tempObj); 
            } 
             else if(obj.dateofReceipt)
             {
               if(obj.amountReceived>0)
              {
                tempObj['firmName']= obj.customerName
                tempObj['date']=obj.dateofReceipt
                tempObj['paymentReceived']=obj.amountReceived
                tempObj['modeofPayment']=obj.modeofPayment
                simplifiedData.push(tempObj); 
              }
                
              }
                   
                
          }
      )
      
      simplifiedData.sort(function(a, b) {
        var keyA = new Date(a.date),
          keyB = new Date(b.date);
        // Compare the 2 dates
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
      })
      console.log(simplifiedData);
      this.simpleReport = simplifiedData
      this.balanceRemaining=this.calculateBalance(this.netInvoiceAmount,this.netPaymentReceived,lastFYBalance);
  }

  calculateBalance(netinvoiceamt,netpaymentReceived,lastFYBalance)  {
    return (netinvoiceamt+lastFYBalance-netpaymentReceived);
  }
  printReport()
  {
    document.getElementById('ul-div').style.display="none";
    document.getElementById('paymentForm').style.display="none";
    document.getElementById('pbutton').style.display="none";
    document.getElementById('labelTohide').style.display="none";
    document.getElementById('dropdowntohide').style.display="none";
    document.getElementById('toggleButton').style.display="none";
    this.renderer.addClass(document.getElementsByClassName('content-outlet')[0],'printPadding');
    window.print()
    document.getElementById('pbutton').style.display="inline-block"
    document.getElementById('toggleButton').style.display="inline-block"
    document.getElementById('ul-div').style.display="flex"
    document.getElementById('paymentForm').style.display="block"
    document.getElementById('labelTohide').style.display="inline-block"
    document.getElementById('dropdowntohide').style.display="inline-block";
    this.renderer.removeClass(document.getElementsByClassName('content-outlet')[0],'printPadding');
  }
}
