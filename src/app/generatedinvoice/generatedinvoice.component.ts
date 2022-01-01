import { isNull } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isNullOrUndefined } from 'util';

import { InvoiceService } from '../services/invoice.service';
import { OtherdataService } from '../services/otherdata.service';

@Component({
  selector: 'app-generatedinvoice',
  templateUrl: './generatedinvoice.component.html',
  styleUrls: ['./generatedinvoice.component.css']
})
export class GeneratedinvoiceComponent implements OnInit {
  generatedInvoice;
  gstin;
  companyName;
  ownerName;
  state;
  pin;
  email;
  stateCode;
  city;
  mob;
  houseNum;
  area;
  pan;
  balancerow=23;
  balancerows=[];
  invoiceNum;
  invoiceType="Original";
  onPrintO(divName) {
    console.log("print Method Called");
    //this.invoiceType="Original";
    (document.getElementById('nav-div') as HTMLFormElement).style.display="none";
  (document.getElementById('ul-div') as HTMLFormElement).style.display="none";
  (document.getElementById('buttons') as HTMLFormElement).style.display="none";

  (document.getElementById('screenshot-div') as HTMLFormElement).style.display="none";
    window.print();
    (document.getElementById('nav-div') as HTMLFormElement).style.display="block";
    (document.getElementById('ul-div') as HTMLFormElement).style.display="inline-flex";
    (document.getElementById('buttons') as HTMLFormElement).style.display="block";

    (document.getElementById('screenshot-div') as HTMLFormElement).style.display="block";
      
}
// onPrintD(divName) {
//   //this.invoiceType="Duplicate";
//   console.log("print Method Called");
//   // let printContents = document.getElementById(divName).innerHTML;
//   // let originalContents = document.body.innerHTML;
//   // document.body.innerHTML = printContents;
//   // window.print();
//   // document.body.innerHTML = originalContents;
 
//   (document.getElementById('nav-div') as HTMLFormElement).style.display="none";
//   (document.getElementById('ul-div') as HTMLFormElement).style.display="none";
//   if(document.getElementById('screenshot-div')!=null)
//   (document.getElementById('screenshot-div') as HTMLFormElement).style.display="none";
//     window.print();
//     (document.getElementById('nav-div') as HTMLFormElement).style.display="block";
//     (document.getElementById('ul-div') as HTMLFormElement).style.display="block";
//     if(document.getElementById('screenshot-div')!=null)
//     (document.getElementById('screenshot-div') as HTMLFormElement).style.display="block";
      
// }
toggleOD(type)
{
  this.invoiceType=type
}
  constructor(private invoiceService:InvoiceService,private otherDataService:OtherdataService,private router:Router,private route:ActivatedRoute) { }

  ngOnInit(): void {
   
    console.log(isNullOrUndefined(this.invoiceType))
    this.route.params.subscribe(params=>
      {
        this.invoiceNum=params['invoicenum'];
        console.log(params)
      
   //var invoiceNum=2;
    this.generatedInvoice=this.invoiceService.getInvoiceDetails(this.invoiceNum).subscribe(res=>
      {
        this.generatedInvoice=res;
        console.log(this.generatedInvoice);
        this.balancerow=this.balancerow-this.generatedInvoice.products.length
        for(let i=0;i<this.balancerow;i++)
        {
          this.balancerows.push(i);
        }
      });

      this.otherDataService.getAppConfig().subscribe(res=>
        {
          this.otherDataService.appConfig = res;
          console.log(this.otherDataService.appConfig)


          this.companyName=this.otherDataService.appConfig.companyName;
          this.gstin=this.otherDataService.appConfig.companyGSTIN
          this.ownerName=this.otherDataService.appConfig.ownerName
          this.city=this.otherDataService.appConfig.city
          this.pin=this.otherDataService.appConfig.pin
          this.mob=this.otherDataService.appConfig.mobile
          this.state=this.otherDataService.appConfig.state
          this.stateCode=this.otherDataService.appConfig.stateCode
          this.email=this.otherDataService.appConfig.email
          this.houseNum=this.otherDataService.appConfig.houseNo
          this.area=this.otherDataService.appConfig.area
          this.pan=this.otherDataService.appConfig.pan
        });

      })
      
  }


inWords (num) {
  num= Number(num).toFixed(0);

  var a = ['','One ','Two ','Three ','Four ', 'Five ','Six ','Seven ','Eight ','Nine ','Ten ','Eleven ','Twelve ','Thirteen ','Fourteen ','Fifteen ','Sixteen ','Seventeen ','Eighteen ','Nineteen '];
  var b = ['', '', 'Twenty','Thirty','Forty','Fifty', 'Sixty','Seventy','Eighty','Ninety'];
  
    if ((num = num.toString()).length > 9) return 'overflow';
    let n:any = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return; var str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'only ' : '';
    return str;
}

}
