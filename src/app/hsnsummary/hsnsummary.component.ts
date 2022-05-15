import { Component, OnInit } from '@angular/core';
import { HSNforGST, HsnSummaryModel } from '../models/hsn.model';
import { HsnService } from '../services/hsn.service';
import { ngxCsv } from 'ngx-csv/ngx-csv';
@Component({
  selector: 'app-hsnsummary',
  templateUrl: './hsnsummary.component.html',
  styleUrls: ['./hsnsummary.component.css']
})
export class HsnsummaryComponent implements OnInit {
  allinvoicesdetails;
  hsnsummary:HsnSummaryModel[]=[]
  hsnforGST:HSNforGST[]=[];
  distincthsnlist=[];
  generatedHSNsummary:HsnSummaryModel[]=[];
  startDate:Date;
  endDate:Date;
  hsnNumUQC = [
    {
      "num": "3812",
      "uqc": "PAC-PACKS",
    },
    {
      "num": "3506",
      "uqc": "KGS-KILOGRAMS"
    }
    , {
      "num": "3702",
      "uqc": "ROL-ROLLS"
    }
    , {
      "num": "3705",
      "uqc": "OTH-OTHERS"
    }
    , {
      "num": "3809",
      "uqc": "PAC-PACKS"
    }
    , {
      "num": "8443",
      "uqc": "PCS-PIECES"
    }
    , {
      "num": "3824",
      "uqc": "BTL-BOTTLES"
    }
    , {
      "num": "3814",
      "uqc": "LTR-LITRES"
    }
    , {
      "num": "3920",
      "uqc": "OTH-OTHERS"
    }
    , {
      "num": "2918",
      "uqc": "PAC-PACKS"
    }
    , {
      "num": "2902",
      "uqc": "BTL-BOTTLES"
    }
    , {
      "num": "3912",
      "uqc": "PCS-PIECES"
    }
    , {
      "num": "3707",
      "uqc": "LTR-LITRES"
    }
    , {
      "num": "3215",
      "uqc": "KGS-KILOGRAMS"
    }
    , {
      "num": "5909",
      "uqc": "MTR-METERS"
    }
    , {
      "num": "5111",
      "uqc": "MTR-METERS"
    }
    , {
      "num": "2809",
      "uqc": "LTR-LITRES"
    }
    , {
      "num": "1301",
      "uqc": "KGS-KILOGRAMS"
    }
    , {
      "num": "8442",
      "uqc": "OTH-OTHERS"
    }, {
      "num": "2905",
      "uqc": "LTR-LITRES"
    }, {
      "num": "4806",
      "uqc": "PAC-PACKS"
    }
  ]
  constructor(private hsnservice:HsnService) { }

  ngOnInit(): void {
  this.hsnservice.getAllInvoicesDetails().subscribe(res=>
    {
      this.allinvoicesdetails=res;
      this.processData(this.allinvoicesdetails);
    })
  }
 filterRecords()
  {
    var filteredSummary=[];
    var summary=this.allinvoicesdetails
    var invdate=new Date(summary[0].invoiceDate);
    var startdate=new Date(this.startDate).setHours(0,0,0,0)
    var enddate=new Date(this.endDate).setHours(0,0,0,0)
    console.log(invdate)
    console.log(this.startDate)

    console.log(new Date(this.endDate))
    console.log(new Date(this.startDate)<invdate)
    console.log(this.endDate>invdate)
console.log(summary)
    for(let i=0;i<summary.length;i++)
    {
     let date=new Date(summary[i].invoiceDate).setHours(0,0,0,0);
      if((date>startdate || date.valueOf() == startdate.valueOf()) && (date<enddate || date.valueOf() == enddate.valueOf()))
      {
        filteredSummary.push(summary[i]);
      }
    }
    // this.allinvoicesdetails=filteredSummary;

    console.log(filteredSummary)
    this.processData(filteredSummary)

  }
  hsnNumToUQC(hsn:string):string
  {
    let uqc;
    for(let i=0;i<this.hsnNumUQC.length;i++)
    {
      if(this.hsnNumUQC[i].num==hsn)
      {
        uqc=this.hsnNumUQC[i].uqc;
        break;
      }
    }
    return uqc;
  }
  processData(datatobeprocessed)
  {
    this.hsnsummary=[];
    let summaryobj=datatobeprocessed;
    for(let i=0;i<summaryobj.length;i++)
    { 
        let productsobj=summaryobj[i].products
      for(let j=0;j<productsobj.length;j++)
      {
        let hsnsum=new HsnSummaryModel();
          hsnsum.hsn=String(productsobj[j].hsn);
          hsnsum.quantity=String(productsobj[j].quantity);
          hsnsum.taxableAmount=String(productsobj[j].taxableAmount);
          hsnsum.sgst=String(productsobj[j].sgst);
          hsnsum.cgst=String(productsobj[j].cgst);
          hsnsum.taxRate=String(productsobj[j].taxRate);
         hsnsum.unit= String(productsobj[j].unit);
          
          this.hsnsummary.push(hsnsum);
          
      }
      
    }
    console.log(this.hsnsummary)
    this.filterHsnSummary(this.hsnsummary);
  }

  options = { 
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true, 
    showTitle: false,
    title: '',
    useBom: true,
    headers: ["HSN", "Description", "UQC","Total Quantity","Total Value","Taxable Value","Integrated Tax Amount","Central Tax Amount","State/UT Tax Amount","Cess Amount","Rate"]
  };
 
downloadHSNCSV()
{
   this.generateHsnSummaryGST(this.generatedHSNsummary);
  new ngxCsv(this.hsnforGST, "HSNReport", this.options);
}
  generateHsnSummaryGST(generatedSummary)
  {
    this.hsnforGST=[];
    for(let i=0;i<generatedSummary.length;i++)
    {
      let hsnrow=new HSNforGST();
      hsnrow.hsn=this.generatedHSNsummary[i].hsn
      hsnrow.description="" //this.generatedHSNsummary[i]
      hsnrow.uqc=this.hsnNumToUQC(this.generatedHSNsummary[i].hsn) //this.generatedHSNsummary[i]
      hsnrow.quantity=this.generatedHSNsummary[i].quantity
      hsnrow.totalvalue=String(Number(this.generatedHSNsummary[i].taxableAmount)+Number(this.generatedHSNsummary[i].cgst)+Number(this.generatedHSNsummary[i].sgst));
      hsnrow.taxableValue=this.generatedHSNsummary[i].taxableAmount
      hsnrow.integratedTax="" //this.generatedHSNsummary[i]
      hsnrow.centraltax=this.generatedHSNsummary[i].cgst
      hsnrow.stateTax=this.generatedHSNsummary[i].sgst
      hsnrow.cess="" //this.generatedHSNsummary[i]
      hsnrow.rate=this.generatedHSNsummary[i].taxRate;

      this.hsnforGST.push(hsnrow);
    }
      
  }
  filterHsnSummary(createHsnDetails)
  {
    let hsnsummary=createHsnDetails
    this.generatedHSNsummary=[]
    this.distincthsnlist=[];
    for(let i=0;i<hsnsummary.length;i++)
    {
      let item=hsnsummary[i]
      if((this.distincthsnlist).indexOf(item.hsn)>=0)
      {
        let index = this.distincthsnlist.indexOf(item.hsn);

        if(this.generatedHSNsummary[index].hsn===item.hsn)
        {
          console.log("Match is Genuine");
          this.generatedHSNsummary[index].quantity=String(Number(this.generatedHSNsummary[index].quantity)+Number(hsnsummary[i].quantity))
          this.generatedHSNsummary[index].cgst=String(Number(this.generatedHSNsummary[index].cgst)+Number(hsnsummary[i].cgst))
          this.generatedHSNsummary[index].sgst=String(Number(this.generatedHSNsummary[index].sgst)+Number(hsnsummary[i].sgst))
          
          this.generatedHSNsummary[index].taxableAmount=String(Number(this.generatedHSNsummary[index].taxableAmount)+Number(hsnsummary[i].taxableAmount))

        }
        else{
          console.log("Some Error Occurred while finding HSN match");
        }
      }
      else{
        this.distincthsnlist.push(hsnsummary[i].hsn);
        let hsnitem=new HsnSummaryModel();
        hsnitem.hsn=hsnsummary[i].hsn;
        hsnitem.unit=hsnsummary[i].unit;
        hsnitem.taxableAmount=hsnsummary[i].taxableAmount
        hsnitem.taxRate=hsnsummary[i].taxRate
        hsnitem.quantity=hsnsummary[i].quantity
        hsnitem.sgst=hsnsummary[i].sgst;
        hsnitem.cgst=hsnsummary[i].cgst;

        this.generatedHSNsummary.push(hsnitem);
        
      }
    }
    console.log(this.distincthsnlist);
    console.log(this.generatedHSNsummary);
  }

}
