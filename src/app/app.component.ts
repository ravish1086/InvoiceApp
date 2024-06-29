import { Component, OnInit, ViewChild } from '@angular/core';
import { OtherdataService } from './services/otherdata.service';
import { tap } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { data } from './data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('screen', { static: true }) screen: any;
  title = 'EZInvoice';
show=false;
  selectedFileBLOB: any;
  constructor(private _sanitizer: DomSanitizer,private otherdataservice:OtherdataService)
  {
  
  }
  imagePath;
  ngOnInit()
  {
    // this.debugggingIssue()
  }
  capture()
  {

    
  }
  
  DataURIToBlob(dataURI: string) {
    const splitDataURI = dataURI.split(',')
    const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1])
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0]
        
    const ia = new Uint8Array(byteString.length)
    for (let i = 0; i < byteString.length; i++)
        ia[i] = byteString.charCodeAt(i)
      
        return new Blob([ia],{type:mimeString})
}

    debugggingIssue()
    {
      let dataobj = data;
      let debuggableArray=[]
      dataobj.forEach(obj => {
        let sum=0
        obj.products.forEach(obj=>{
          sum = sum+Number(obj.taxableAmount);
        })
        let myobj = {
          invNum: obj.invoiceNo,
          taxableValue:obj.totalTaxableValue,
          invoiceValue:obj.totalInvoiceValue,
          hsnTaxableAmount:sum
        }
        debuggableArray.push(myobj)
      });
      console.log(debuggableArray)
    }

}
