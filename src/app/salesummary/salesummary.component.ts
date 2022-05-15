import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InvoiceService } from '../services/invoice.service';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { B2BModel, B2CModel } from '../models/b2breport.model';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-salesummary',
  templateUrl: './salesummary.component.html',
  styleUrls: ['./salesummary.component.css']
})
export class SalesummaryComponent implements OnInit {
  summary;
  b2bsummary:B2BModel[]=[];
  b2csummary:B2CModel[]=[];
  startDate:Date;
  endDate:Date;
summaryBackup;
  constructor(private invoiceService:InvoiceService,private router:Router) { }

  ngOnInit(): void {
    this.invoiceService.getAllInvoicesDetails().subscribe(res=>
      {
        this.summary=res;
        this.summaryBackup=res;
        //this.downloadCSVForB2B()
      })

  }
  optionsb2b = { 
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true, 
    showTitle: false,
    title: '',
    useBom: true,
    headers: ["GSTIN/UIN of Recipient", "Receiver Name", "Invoice Number","Invoice date","Invoice Value","Place Of Supply","Reverse Charge","Applicable % of Tax Rate","Invoice Type","E-Commerce GSTIN","Rate","Taxable Value","Cess Amount"]
  };
  optionsb2c = { 
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true, 
    showTitle: false,
    title: '',
    useBom: true,
    headers: ["Type", "Place Of Supply", "Rate","Applicable % of Tax Rate","Taxable Value","Cess Amount","E-Commerce GSTIN"]
  };
  optionsSummary = { 
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true, 
    showTitle: false,
    title: '',
    useBom: true,
    headers: ["Name", "GSTIN", "State of Supply","Invoice Number","Date","Invoice Value","Taxable Value","CGST AMT","SGST AMT","Total Tax"]
  };
 monthList=["Jan","Feb","Mar","Apr","May","Jun","July","Aug","Sep","Oct","Nov","Dec"]
downloadCSVForB2B()
{
  this.generateB2BSummary();
  let name = this.monthList[new Date(this.startDate).getMonth()] + "_" +this.monthList[new Date(this.endDate).getMonth()]+" "+new Date(this.startDate).getFullYear() + "_" + [(new Date(this.startDate).getFullYear())+1] + "_B2B_GSTR 1_3b";
  new ngxCsv(this.b2bsummary, name, this.optionsb2b);
}
downloadCSVForB2C()
{
  this.generateB2CSummary();
  let name = this.monthList[new Date(this.startDate).getMonth()] + "_" +this.monthList[new Date(this.endDate).getMonth()]+" "+new Date(this.startDate).getFullYear() + "_" +[new Date(this.startDate).getFullYear()+1] + "_B2C_GSTR 1_3b";
  new ngxCsv(this.b2csummary, name, this.optionsb2c);
}
downloadCSVCurrentReport()
{
  // this.generateB2CSummary();
  // let name = this.monthList[new Date(this.startDate).getMonth()] + "_" +this.monthList[new Date(this.endDate).getMonth()]+" "+new Date(this.startDate).getFullYear() + "_" +[new Date(this.startDate).getFullYear()+1] + "_B2C_GSTR 1_3b";
  let summaryForExcel=[]
  for(let i=0;i<this.summary.length;i++)
  {
    let obj={
      "Name":this.summary[i].customer.customerName,
      "GSTIN":this.summary[i].customer.customerGst,
      "State Of Supply":this.summary[i].customer.customerState,
      "Invoice Number":this.summary[i].invoiceNo,
      "Date":this.summary[i].invoiceDate,
      "Invoice Value":this.summary[i].totalInvoiceValue,
      "Taxable Value":this.summary[i].totalTaxableValue,
      "CSGT Amount":(this.summary[i].taxAmtsgstorcgst5+this.summary[i].taxAmtsgstorcgst12+this.summary[i].taxAmtsgstorcgst18+this.summary[i].taxAmtsgstorcgst28),
      "SGST Amount":(this.summary[i].taxAmtsgstorcgst5+this.summary[i].taxAmtsgstorcgst12+this.summary[i].taxAmtsgstorcgst18+this.summary[i].taxAmtsgstorcgst28),
      "Total Tax":(this.summary[i].taxAmtsgstorcgst5+this.summary[i].taxAmtsgstorcgst12+this.summary[i].taxAmtsgstorcgst18+this.summary[i].taxAmtsgstorcgst28+this.summary[i].taxAmtsgstorcgst5+this.summary[i].taxAmtsgstorcgst12+this.summary[i].taxAmtsgstorcgst18+this.summary[i].taxAmtsgstorcgst28+this.summary[i].taxAmtIgst5+this.summary[i].taxAmtIgst12+this.summary[i].taxAmtIgst18+this.summary[i].taxAmtIgst28)
    }
    summaryForExcel.push(obj)
  }
  new ngxCsv(summaryForExcel, "Report", this.optionsSummary);
}
  editInvoice(id)
  {
    id=id+1;
    this.router.navigate(['editInvoice',id]);
  }
  viewInvoice(id)
  {
    id=id+1;
    this.router.navigate(['generatedInvoice',id]);
  }

  filterRecords()
  {
    this.summary=this.summaryBackup
    var filteredSummary=[];
    var summary=this.summary
    // var invdate=new Date(summary[0].invoiceDate);
    var startdate=new Date(this.startDate).setHours(0,0,0,0)
    var enddate=new Date(this.endDate).setHours(0,0,0,0)
    
    // console.log(startdate)
    // console.log(enddate)

    // console.log(startdate>new Date())

    for(let i=0;i<summary.length;i++)
    {
     let date=new Date(summary[i].invoiceDate).setHours(0,0,0,0);
    //  console.log(date)
    console.log( date.valueOf() == startdate.valueOf()) 
    console.log(date)
    console.log(startdate)
    // console.log(date>startdate )
     
      if((date>startdate || date.valueOf() == startdate.valueOf()) && (date<enddate || date.valueOf() == enddate.valueOf()))
      {
        filteredSummary.push(summary[i]);
      }
    }
    this.summary=filteredSummary;

    console.log(this.summary)

  }
  generateB2CSummary()
  {
    let  rowData5=new B2CModel();
    let  rowData12=new B2CModel();
    let  rowData18=new B2CModel();
    let  rowData28=new B2CModel();
    for(let i=0;i<this.summary.length;i++){

      if(this.summary[i].customer.customerGst=="" || isNullOrUndefined(this.summary[i].customer.customerGst)){
          //  let  rowData=new B2CModel();
          //rowData.gstin=this.summary[i].customer.customerGst
    //  rowData.type="OE"
    //  rowData.placeofsupply="09-"+this.summary[i].placeOfSupply;
       
        if(this.summary[i].taxable5!=0)
        { 
          rowData5.type="OE";
          rowData5.placeofsupply="09-"+this.summary[i].placeOfSupply;
          rowData5.rate="5";
          rowData5.applicabletaxrate="";
          rowData5.taxablevalue=Number(this.summary[i].taxable5)
          rowData5.cessamount=""
          rowData5.ecomGstin=""
        
        }
        if(this.summary[i].taxable12!=0)
        {
          
          rowData12.type="OE";
          rowData12.placeofsupply="09-"+this.summary[i].placeOfSupply;
          rowData12.rate="12";
          rowData12.applicabletaxrate="";
          rowData12.taxablevalue=Number(this.summary[i].taxable12)
          rowData12.cessamount=""
          rowData12.ecomGstin=""
         
        }
        if(this.summary[i].taxable18!=0)
        {
          rowData18.type="OE";
          rowData18.placeofsupply="09-"+this.summary[i].placeOfSupply;
          rowData18.rate="18";
          rowData18.applicabletaxrate="";
          rowData18.taxablevalue=Number(this.summary[i].taxable18)
          rowData18.cessamount=""
          rowData18.ecomGstin=""
        }
        if(this.summary[i].taxable28!=0)
        {
          rowData28.type="OE";
          rowData28.placeofsupply="09-"+this.summary[i].placeOfSupply;
          rowData28.rate="28";
          rowData28.applicabletaxrate="";
          rowData28.taxablevalue=Number(this.summary[i].taxable28)
          rowData28.cessamount=""
          rowData28.ecomGstin=""
        }
        
       
    }
  }
  if(rowData5.taxablevalue!=0 && !isNullOrUndefined(rowData5.taxablevalue))
  this.b2csummary.push(rowData5);
  if(rowData12.taxablevalue!=0 && !isNullOrUndefined(rowData12.taxablevalue))
  this.b2csummary.push(rowData12);
  if(rowData18.taxablevalue!=0 && !isNullOrUndefined(rowData18.taxablevalue))
  this.b2csummary.push(rowData18);
  if(rowData28.taxablevalue!=0 && !isNullOrUndefined(rowData28.taxablevalue))
  this.b2csummary.push(rowData28);
  
  console.log(this.b2csummary);  
  }
  generateB2BSummary()
  {
    for(let i=0;i<this.summary.length;i++){
      
        if(this.summary[i].customer.customerGst!="" && !isNullOrUndefined(this.summary[i].customer.customerGst)){
             let  rowData=new B2BModel();
            rowData.gstin=this.summary[i].customer.customerGst
          rowData.name=this.summary[i].customer.customerName;
          rowData.invoiceNumber=this.summary[i].invoiceNo;
          rowData.invoiceDate= this.converDateToDDMMMYYYY(this.summary[i].invoiceDate);
          rowData.invoiceValue=this.summary[i].totalInvoiceValue.toFixed(0);
          rowData.placeOfSupply="09-"+this.summary[i].placeOfSupply;
          rowData.reverseCharge=this.summary[i].reverseCharge
          rowData.applicableTaxRate=""
          rowData.invoiceType="Regular"
          rowData.eCommerceGstin=""
         
          if(this.summary[i].taxable5!=0)
          { 
            let  rowData=new B2BModel();
            rowData.gstin=this.summary[i].customer.customerGst
          rowData.name=this.summary[i].customer.customerName;
          rowData.invoiceNumber=this.summary[i].invoiceNo;
          rowData.invoiceDate= this.converDateToDDMMMYYYY(this.summary[i].invoiceDate);
          rowData.invoiceValue=this.summary[i].totalInvoiceValue.toFixed(0);
          rowData.placeOfSupply="09-"+this.summary[i].placeOfSupply;
          rowData.reverseCharge=this.summary[i].reverseCharge
          rowData.applicableTaxRate=""
          rowData.invoiceType="Regular"
          rowData.eCommerceGstin=""
            rowData.taxRate="5"
          rowData.taxableValue=this.summary[i].taxable5
          rowData.cessAmount=""
          
          this.b2bsummary.push(rowData);
          }
          if(this.summary[i].taxable12!=0)
          {
            let  rowData=new B2BModel();
            rowData.gstin=this.summary[i].customer.customerGst
          rowData.name=this.summary[i].customer.customerName;
          rowData.invoiceNumber=this.summary[i].invoiceNo;
          rowData.invoiceDate= this.converDateToDDMMMYYYY(this.summary[i].invoiceDate);
          rowData.invoiceValue=this.summary[i].totalInvoiceValue.toFixed(0);
          rowData.placeOfSupply="09-"+this.summary[i].placeOfSupply;
          rowData.reverseCharge=this.summary[i].reverseCharge
          rowData.applicableTaxRate=""
          rowData.invoiceType="Regular"
          rowData.eCommerceGstin=""
            rowData.taxRate="12"
            rowData.taxableValue=this.summary[i].taxable12
            rowData.cessAmount=""
          
            this.b2bsummary.push(rowData);
          }
          if(this.summary[i].taxable18!=0)
          {
            let  rowData=new B2BModel();
            rowData.gstin=this.summary[i].customer.customerGst
          rowData.name=this.summary[i].customer.customerName;
          rowData.invoiceNumber=this.summary[i].invoiceNo;
          rowData.invoiceDate= this.converDateToDDMMMYYYY(this.summary[i].invoiceDate);
          rowData.invoiceValue=this.summary[i].totalInvoiceValue.toFixed(0);
          rowData.placeOfSupply="09-"+this.summary[i].placeOfSupply;
          rowData.reverseCharge=this.summary[i].reverseCharge
          rowData.applicableTaxRate=""
          rowData.invoiceType="Regular"
          rowData.eCommerceGstin=""
            rowData.taxRate="18"
            rowData.taxableValue=this.summary[i].taxable18
            rowData.cessAmount=""
          
            this.b2bsummary.push(rowData);
          }
          if(this.summary[i].taxable28!=0)
          {
            let  rowData=new B2BModel();
            rowData.gstin=this.summary[i].customer.customerGst
          rowData.name=this.summary[i].customer.customerName;
          rowData.invoiceNumber=this.summary[i].invoiceNo;
          rowData.invoiceDate= this.converDateToDDMMMYYYY(this.summary[i].invoiceDate);
          rowData.invoiceValue=this.summary[i].totalInvoiceValue.toFixed(0);
          rowData.placeOfSupply="09-"+this.summary[i].placeOfSupply;
          rowData.reverseCharge=this.summary[i].reverseCharge
          rowData.applicableTaxRate=""
          rowData.invoiceType="Regular"
          rowData.eCommerceGstin=""
            rowData.taxRate="28"
            rowData.taxableValue=this.summary[i].taxable28
            rowData.cessAmount=""
          
            this.b2bsummary.push(rowData);
          }
          
         
      }
    }
    console.log(this.b2bsummary);  
  }

  converDateToDDMMMYYYY(datein:string):string
  {
    let convertedDate;
    let date=new Date(datein);
    let months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    convertedDate=date.getDate() + "-" +months[date.getMonth()] + "-" +date.getFullYear();
    return convertedDate;
  }
}
