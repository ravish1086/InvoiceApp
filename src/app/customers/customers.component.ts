import { Component, OnInit } from '@angular/core';
import { CustomerModel } from '../models/customer.model';

import { OtherdataService } from '../services/otherdata.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  name;
  gst;
  pan;
 contact;
address;
shopno;
area;
city;
state;
country;
addCustomerForm=false;
  customers:CustomerModel[]=[];
  data;
  savedCustomers:CustomerModel[]=[];
  isImport=true;
  constructor(private otherdataservice:OtherdataService) { }

  ngOnInit(): void {
    this.getcustomerDetails();
  }

  addCustomer()
  {
    let customer=new CustomerModel();
          customer.customerName=this.name
          customer.customerGst =this.gst
          customer.customerPan=this.pan
          customer.customerContact=this.contact
          customer.customerAddress=this.address;
          customer.customershopNo=this.shopno;
          customer.customerArea=this.area;
          customer.customerCity=this.city
          customer.customerState=this.state
          customer.customerCountry=this.country
          this.otherdataservice.addCustomerToDb(customer).subscribe(res=>
            {
              console.log(res);
            })
  }
  showForm()
  {
      this.addCustomerForm=!this.addCustomerForm;
  }
  getcustomerDetails()
  {
    this.otherdataservice.getCustomerDetails().subscribe(res=>
      {
        console.log(res);
          for(let i=0;i<res.length;i++)
          {
            let customer=new CustomerModel();
            customer.customerGst=res[i].customerGst
            customer.customerName=res[i].customerName
            customer.customerPan=res[i].customerPan
            customer.customerContact=res[i].customerContact
            customer.customerAddress=res[i].customerAddress
            this.savedCustomers.push(customer);
          }
          
         
          console.log(this.savedCustomers);
          this.otherdataservice.loadedCustomers=this.savedCustomers;
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
          
          let customer=new CustomerModel();
          customer.customerGst=this.data[i][3];
          customer.customerName=this.data[i][0];
          customer.customerPan=this.data[i][1];
          customer.customerContact=this.data[i][2];
          customer.customerAddress=this.data[i][4];
          customer.customershopNo=this.data[i][5];
          customer.customerArea=this.data[i][6];
          customer.customerCity=this.data[i][7];
          customer.customerState=this.data[i][8];
          customer.customerCountry=this.data[i][9];
          this.otherdataservice.exportCustomerData(customer).subscribe((res)=>
        {
          console.log(res);
        })
         
        }
        ;
        
    };

    reader.readAsBinaryString(target.files[0]);
}

toggleEdit(index)
{
 //var ins=
 let  element1 = document.getElementsByClassName('editmode1') as HTMLCollectionOf<HTMLElement>
 for(let i=index*5;i<index*5+5;i++)
 {
  element1[i].style.display='block';
 }
 let  element2 = document.getElementsByClassName('editmode2') as HTMLCollectionOf<HTMLElement>
 for(let j=index*5;j<index*5+5;j++)
 {
  element2[j].style.display='none';
 }
 
}
SaveRecords(entry,index:number)
{

  let  element1 = document.getElementsByClassName('editmode1') as HTMLCollectionOf<HTMLElement>


  for(let i=index*5;i<index*5+5;i++)
 {
  element1[i].style.display='none';
 }

  let  element2 = document.getElementsByClassName('editmode2') as HTMLCollectionOf<HTMLElement>
  
  for(let j=index*5;j<index*5+5;j++)
 {
  element2[j].style.display='block';
 }
  this.otherdataservice.saveCustomer(entry,index).subscribe(res=>
    {
      console.log(res);
    })
 
}
}
