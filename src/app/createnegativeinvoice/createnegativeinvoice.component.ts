import { Component, OnInit } from '@angular/core';
import { GenerateInvoice, Invoice } from '../models/invoice.model';
import {FormsModule} from '@angular/forms'
import { ProductDetails, ProductInvoice } from '../models/product.model';
import {OtherdataService} from '../services/otherdata.service';
import { CustomerModel } from '../models/customer.model';
import { InvoiceService } from '../services/invoice.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-createnegativeinvoice',
  templateUrl: './createnegativeinvoice.component.html',
  styleUrls: ['./createnegativeinvoice.component.css']
})
export class CreatenegativeinvoiceComponent implements OnInit {
  interstate=false;
  products:ProductDetails[]=[];
  customer:CustomerModel=new CustomerModel();;
  customers:CustomerModel[]=[];
  totalTaxableValue:number=0;
  totalInvoiceValue:number=0;
  totalTax:number=0;
  sgstorcgstamt28:number=0;
  sgstorcgstamt18:number=0;
  sgstorcgstamt12:number=0;
  sgstorcgstamt5:number=0;
 igstamt28:number=0;
 igstamt18:number=0;
 igstamt12:number=0;
 igstamt5:number=0;
 taxable5:number=0;
 taxable12:number=0;
 taxable18:number=0;
 taxable28:number=0;
 reverseCharge="N";
 invoiceNumber=4;
 customerState;
 todaysDate=new Date().toDateString();
  constructor(private otherdata:OtherdataService,private invoiceservice:InvoiceService,private router:Router,private route: ActivatedRoute ) { 

  }



  ngOnInit(): void {
    this.invoiceservice.getLastInvoiceNumber().subscribe(res=>
      {
        this.invoiceNumber=Number(res.invoiceNumber)+1;
      })
    this.otherdata.getProductDetails().subscribe(res=>
      {
        this.products=res;
      });

      this.otherdata.getCustomerDetails().subscribe(res=>{
        this.customers=res;
      })
  }


  invoiceView:Invoice[]=[];
  addRow()
  {
    var invoice=new Invoice();
    invoice.productName="";
    invoice.hsn="";
    invoice.taxRate="";
    invoice.rate="";
    invoice.amount="";
    invoice.quantity="";
    invoice.description=""
    this.invoiceView.push(invoice);
  }
  deleteRow()
  {
  
    this.invoiceView.pop()
  }

  sendData()
  {
    console.log(this.invoiceView)
  }
  calculateAmount(index)
  { 
    this.totalTaxableValue=0;
  this.totalInvoiceValue=0;
  this.totalTax=0;
  this.sgstorcgstamt28=0;
  this.sgstorcgstamt18=0;
  this.sgstorcgstamt12=0;
  this.sgstorcgstamt5=0;
 this.igstamt28=0;
 this.igstamt18=0;
 this.igstamt12=0;
 this.igstamt5=0;
 this.taxable5=0;
 this.taxable12=0;
 this.taxable18=0;
 this.taxable28=0;

    this.invoiceView[index].taxableAmount=((Number(this.invoiceView[index].rate)*Number(this.invoiceView[index].quantity))).toFixed(2);
    var taxamount=  Number(((Number(this.invoiceView[index].rate)*(Number(this.invoiceView[index].taxRate)/100))*Number(this.invoiceView[index].quantity)).toFixed(2));
    this.invoiceView[index].sgst=String(taxamount/2);
    this.invoiceView[index].cgst=String(taxamount/2);
    
    this.invoiceView[index].amount=((
        (Number(this.invoiceView[index].rate)*(Number(this.invoiceView[index].taxRate)/100))
        +(Number(this.invoiceView[index].rate)))
        *(this.invoiceView[index].quantity)).toFixed(2);
      console.log( this.invoiceView[index].amount);

      for(let i=0;i<this.invoiceView.length;i++)
      {
        if(this.invoiceView[i].taxRate=="28")
        {
          this.taxable28=Number((this.taxable28+Number(this.invoiceView[i].taxableAmount)).toFixed(2));
          if(!this.interstate)
          {
            this.sgstorcgstamt28=Number((this.sgstorcgstamt28+Number(this.invoiceView[i].sgst)).toFixed(2));
            
          }
          else{
            this.igstamt28=Number((this.igstamt28+Number(this.invoiceView[i].Igst)).toFixed(2));
          }
        }
       else if(this.invoiceView[i].taxRate=="18")
        {
          this.taxable18=Number((this.taxable18+Number(this.invoiceView[i].taxableAmount)).toFixed(2));
          if(!this.interstate)
          {
            this.sgstorcgstamt18=Number((this.sgstorcgstamt18+Number(this.invoiceView[i].sgst)).toFixed(2));
            
          }
          else{
            this.igstamt18=Number((this.igstamt18+Number(this.invoiceView[i].Igst)).toFixed(2));
          }
        }
        else if(this.invoiceView[i].taxRate=="12")
        {
          this.taxable12=Number((this.taxable12+Number(this.invoiceView[i].taxableAmount)).toFixed(2));
          if(!this.interstate)
          {
            this.sgstorcgstamt12=Number((this.sgstorcgstamt12+Number(this.invoiceView[i].sgst)).toFixed(2));
       
          }
          else{
            this.igstamt12=Number((this.igstamt12+Number(this.invoiceView[i].Igst)).toFixed(2));
          }
        }
        else if(this.invoiceView[i].taxRate=="5")
        {
          this.taxable5=Number((this.taxable5+Number(this.invoiceView[i].taxableAmount)).toFixed(2));
          if(!this.interstate)
          {
            this.sgstorcgstamt5=Number((this.sgstorcgstamt5+Number(this.invoiceView[i].sgst)).toFixed(2));
           
          }
          else{
            this.igstamt5=Number((this.igstamt5+Number(this.invoiceView[i].Igst)).toFixed(2));
            
          }
        }
        
        this.totalTaxableValue=Number((Number(this.totalTaxableValue)+Number(this.invoiceView[i].taxableAmount)).toFixed(2));
        this.totalTax=Number((Number(this.totalTax)+Number(this.invoiceView[i].sgst)+Number(this.invoiceView[i].sgst)).toFixed(2));
        this.totalInvoiceValue=Number((Number(this.totalInvoiceValue)+Number(this.invoiceView[i].amount)).toFixed(2));
      }


    }
    populateFields(productName,indexofItemList)
    {
      console.log(productName)
      let i=0;
      for(let j=0;j<this.products.length;j++)
      {
        if(this.products[j].productName === (productName))
        {
          console.log("match success")
          console.log(this.products[i].productHsn);
          i=j;
        }
      }
        this.invoiceView[indexofItemList].hsn=this.products[i].productHsn
        this.invoiceView[indexofItemList].rate=this.products[i].productPrice
        this.invoiceView[indexofItemList].taxRate=this.products[i].productTaxRate
        this.invoiceView[indexofItemList].unit=this.products[i].productUnit
    }
    populateCustomerFields(customerGst)
    {
      this.customer=new CustomerModel();
      console.log(customerGst)
      let i=0;
      for(let j=0;j<this.customers.length;j++)
      {
        if(this.customers[j].customerName === (customerGst))
        {
          console.log("match success")         
             i=j;
          console.log(this.customers[i].customerAddress);
        }
      }
        this.customer.customerAddress=this.customers[i].customerAddress
        this.customer.customerContact=this.customers[i].customerContact
        this.customer.customerPan=this.customers[i].customerPan
    
        this.customer.customerState=this.customers[i].customerState
        this.customer.customerName=this.customers[i].customerName
        this.customer.customerGst=this.customers[i].customerGst
        console.log(this.customer)
    }
    createInvoice()
    {
      var generateInvoice=new GenerateInvoice();
      generateInvoice.invoiceNo=this.invoiceNumber;
      generateInvoice.invoiceDate=this.todaysDate;
      generateInvoice.placeOfSupply=this.customer.customerState;
      generateInvoice.reverseCharge=this.reverseCharge;
      generateInvoice.totalTaxableValue=this.totalTaxableValue;
    generateInvoice.totalInvoiceValue=this.totalInvoiceValue;
    generateInvoice.taxAmtsgstorcgst28=this.sgstorcgstamt28;
    generateInvoice.taxAmtsgstorcgst18=this.sgstorcgstamt18;
    generateInvoice.taxAmtsgstorcgst12=this.sgstorcgstamt12;
    generateInvoice.taxAmtsgstorcgst5=this.sgstorcgstamt5;
    generateInvoice.taxAmtIgst28=this.igstamt28;
    generateInvoice.taxAmtIgst18=this.igstamt18;
    generateInvoice.taxAmtIgst12=this.igstamt12;
    generateInvoice.taxAmtIgst5=this.igstamt5;
    generateInvoice.taxable28=this.taxable28;
    generateInvoice.taxable18=this.taxable18;
    generateInvoice.taxable12=this.taxable12;
    generateInvoice.taxable5=this.taxable5;
    generateInvoice.customer=this.customer
    generateInvoice.products=this.invoiceView;
    generateInvoice.invoiceStatus="valid";
    console.log(generateInvoice);
    this.invoiceservice.generateInvoice(generateInvoice).subscribe(res=>
      {
        console.log(res);
        if(res===null || res===undefined)
        {
          alert("Something Wrong Occurred");
        }
        else{
          alert("Invoice Generated");
          var setLastInvoiceNumber={
          "invoiceNumber":this.invoiceNumber
          }
          this.invoiceservice.setLastInvoiceNumber(setLastInvoiceNumber).subscribe(res=>
            {
              console.log(res);
            })
          setTimeout(run=>
            {
                this.router.navigate(['generatedInvoice',this.invoiceNumber])
            },2000);
        }
      }
      );
    }
}
