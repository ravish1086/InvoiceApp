import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { SellerModel } from '../models/seller.model';
import { OtherdataService } from '../services/otherdata.service';
@Component({
  selector: 'app-seller-details',
  templateUrl: './seller-details.component.html',
  styleUrls: ['./seller-details.component.css']
})
export class SellerDetailsComponent implements OnInit {
  seller:SellerModel[]=[];
  data;
  savedSellers:SellerModel[]=[];
  isImport=false;
  constructor(private otherdataservice:OtherdataService) { }

  ngOnInit(): void {
    this.getSellerDetails();
  }
  getSellerDetails()
  {
    this.otherdataservice.getSellerDetails().subscribe(res=>
      {
        console.log(res);
          for(let i=0;i<res.length;i++)
          {
            let seller=new SellerModel();
            seller.sellerGst=res[i].sellerGst
            seller.sellerName=res[i].sellerName
            seller.sellerPan=res[i].sellerPan
            seller.sellerContact=res[i].sellerContact
            seller.sellerAddress=res[i].sellerAddress
            this.savedSellers.push(seller);
          }
          
         
          console.log(this.savedSellers);
          this.otherdataservice.loadedSeller=this.savedSellers;
      })
  }
  onFileChange(evt: any) {
    const target : DataTransfer =  <DataTransfer>(evt.target);
    
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');

    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const bstr: string = e.target.result;

      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      const wsname : string = wb.SheetNames[0];

      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      console.log(ws);

      this.data = (XLSX.utils.sheet_to_json(ws, { header: 1 }));

      console.log(this.data);

      let x = this.data.slice(1);
      console.log(x);
        for(let i=1;i<this.data.length;i++)
        {
          
          let seller=new SellerModel();
          seller.sellerGst=this.data[i][3];
          seller.sellerName=this.data[i][0];
          seller.sellerPan=this.data[i][1];
          seller.sellerContact=this.data[i][2];
          seller.sellerAddress=this.data[i][4];
          this.seller.push(seller);
        }
        console.log(this.seller);
        this.otherdataservice.exportSellerData(this.seller).subscribe((res)=>
        {
          console.log(res);
        })
    };

    reader.readAsBinaryString(target.files[0]);
}
}
